import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/db';
import Analysis from '@/models/Analysis';
import { GoogleGenerativeAI, Schema, SchemaType } from '@google/generative-ai';

// Initialize Gemini API
const geminiApiKey = process.env.GEMINI_API_KEY;

// Response schema for structured JSON output from Gemini
const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    title: { 
      type: SchemaType.STRING,
      description: "A short, professional title summarizing the analysis of the dataset."
    },
    summary: { 
      type: SchemaType.STRING, 
      description: "A comprehensive, professional business summary explaining overall trends, key drivers, potential warnings, and actionable recommendations in 3-5 sentences."
    },
    kpis: {
      type: SchemaType.ARRAY,
      description: "List of 3 to 5 key performance indicators extracted or calculated from the data.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          label: { type: SchemaType.STRING, description: "Name of the metric, e.g., 'Gross Revenue', 'Active Users', 'Avg Deal Size'" },
          value: { type: SchemaType.STRING, description: "Formatted value of the metric, e.g., '$104,200', '1,450', '22%'" },
          change: { type: SchemaType.STRING, description: "Trend description with direction, e.g., '+14.2% MoM', '-2.5% vs Last Q', 'Stable'" },
          status: { 
            type: SchemaType.STRING, 
            description: "Up for positive trends, down for negative/warning trends, neutral for stable or mixed metrics. Must be exactly 'up', 'down', or 'neutral'." 
          }
        },
        required: ["label", "value", "status"]
      }
    },
    chartData: {
      type: SchemaType.ARRAY,
      description: "A list of 5 to 12 monthly, quarterly, or category-wise data points suitable for plotting line, bar, and area charts.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING, description: "The label for the x-axis, e.g. 'Jan', 'Q1', 'Marketing', 'Product A'" },
          value1: { type: SchemaType.NUMBER, description: "The primary numerical value, e.g., Revenue, user count, or quantity" },
          value2: { type: SchemaType.NUMBER, description: "An optional secondary numerical value for comparison, e.g., expenses, previous year target, or churn count" }
        },
        required: ["name", "value1"]
      }
    }
  },
  required: ["title", "summary", "kpis", "chartData"]
};

export async function POST(req: Request) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    // 2. Validate Gemini API Key
    if (!geminiApiKey || geminiApiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return NextResponse.json({ 
        message: 'Gemini API key is not configured. Please add GEMINI_API_KEY in your .env file.' 
      }, { status: 500 });
    }

    // 3. Parse input data
    const { text, type, rawData } = await req.json();
    
    if (!text && !rawData) {
      return NextResponse.json({ message: 'No data provided for analysis.' }, { status: 400 });
    }

    // 4. Construct prompt based on data type
    let dataContext = '';
    if (type === 'csv') {
      dataContext = `The user has uploaded a CSV dataset. Here is the structured row data:\n\n${JSON.stringify(rawData, null, 2)}`;
    } else {
      dataContext = `The user has provided the following business report/text:\n\n${text}`;
    }

    const prompt = `You are a world-class Business Intelligence and Financial Analyst.
Analyze the following business dataset or text report and extract key metrics, trends, and performance insights.

Input Data:
${dataContext}

Your response MUST adhere strictly to the requested schema. Ensure:
- The summary is engaging, professional, and provides concrete, executive-level takeaways.
- The KPIs reflect genuine business drivers inside the data. Make sure they represent real metrics from the report/data.
- The chartData is clean and contains logical labels for x-axis (e.g. months, quarters, departments) and clear numerical values for graphing.
- Ensure 'value1' and 'value2' represent actual metrics found in the dataset, such as 'Sales' and 'Costs', or 'Current Year' and 'Target'.`;

    // 5. Query Gemini API
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.1, // low temperature for precise, data-grounded metrics
      },
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    if (!responseText) {
      throw new Error('Gemini API returned an empty response.');
    }

    // 6. Parse structured JSON response
    const parsedData = JSON.parse(responseText);

    // 7. Save to MongoDB
    await dbConnect();
    const newAnalysis = await Analysis.create({
      userId: session.user.id,
      title: parsedData.title,
      summary: parsedData.summary,
      kpis: parsedData.kpis,
      chartData: parsedData.chartData,
    });

    return NextResponse.json({
      message: 'Analysis completed successfully',
      data: newAnalysis,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Gemini Analysis Error:', error);
    
    // Check for MongoDB connection/network issues
    if (error.name === 'MongoServerSelectionError' || error.message?.includes('ECONNREFUSED') || error.message?.includes('topology')) {
      return NextResponse.json({ 
        message: 'Database connection failed. Please ensure your MongoDB service is running (locally or via MongoDB Atlas in .env).' 
      }, { status: 503 });
    }

    // Check for Gemini API rate limits, exhaustion, or temporary overloads (429/503)
    if (error.status === 429 || error.status === 503 || error.message?.includes('429') || error.message?.includes('503') || error.message?.includes('overloaded') || error.message?.includes('exhausted') || error.message?.includes('ResourceExhausted')) {
      return NextResponse.json({ 
        message: 'The Gemini AI engine is temporarily busy or rate-limited (free tier: 15 requests per minute). Please wait 5-10 seconds and click analyze again.' 
      }, { status: 503 });
    }

    return NextResponse.json({ 
      message: 'Failed to process AI analysis.', 
      error: error.message 
    }, { status: 500 });
  }
}
