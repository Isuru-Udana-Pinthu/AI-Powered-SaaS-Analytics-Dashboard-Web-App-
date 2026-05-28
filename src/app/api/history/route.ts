import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/db';
import Analysis from '@/models/Analysis';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    await dbConnect();

    // Fetch reports for the logged-in user, sorted by newest first
    const history = await Analysis.find({ userId: session.user.id })
      .select('title summary kpis createdAt') // omit detailed chartData to keep list response lightweight
      .sort({ createdAt: -1 });

    return NextResponse.json({ history }, { status: 200 });

  } catch (error: any) {
    console.error('History Fetch Error:', error);
    
    // Check for MongoDB connection/network issues
    if (error.name === 'MongoServerSelectionError' || error.message?.includes('ECONNREFUSED') || error.message?.includes('topology')) {
      return NextResponse.json({ 
        message: 'Database connection failed. Please ensure your MongoDB service is running (locally or via MongoDB Atlas in .env).' 
      }, { status: 503 });
    }

    return NextResponse.json({ 
      message: 'Failed to retrieve analysis history.', 
      error: error.message 
    }, { status: 500 });
  }
}
