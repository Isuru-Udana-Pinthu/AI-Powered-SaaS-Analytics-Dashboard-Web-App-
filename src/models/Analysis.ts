import mongoose, { Schema, Document } from 'mongoose';

export interface IKPI {
  label: string;
  value: string;
  change?: string;
  status?: 'up' | 'down' | 'neutral';
}

export interface IChartDataPoint {
  name: string;
  value1: number;
  value2?: number;
  [key: string]: string | number | undefined;
}

export interface IAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  summary: string;
  kpis: IKPI[];
  chartData: IChartDataPoint[];
  createdAt: Date;
}

const AnalysisSchema = new Schema<IAnalysis>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  kpis: [{
    label: { type: String, required: true },
    value: { type: String, required: true },
    change: { type: String },
    status: { type: String, enum: ['up', 'down', 'neutral'], default: 'neutral' },
  }],
  chartData: [{
    name: { type: String, required: true },
    value1: { type: Number, required: true },
    value2: { type: Number },
  }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Analysis || mongoose.model<IAnalysis>('Analysis', AnalysisSchema);
