import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/db';
import Analysis from '@/models/Analysis';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    await dbConnect();

    const analysis = await Analysis.findOne({ _id: id, userId: session.user.id });

    if (!analysis) {
      return NextResponse.json({ message: 'Analysis report not found.' }, { status: 404 });
    }

    return NextResponse.json({ data: analysis }, { status: 200 });

  } catch (error: any) {
    console.error('Single History Fetch Error:', error);
    return NextResponse.json({ 
      message: 'Failed to retrieve analysis details.', 
      error: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    await dbConnect();

    const result = await Analysis.deleteOne({ _id: id, userId: session.user.id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Analysis report not found or already deleted.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Analysis report deleted successfully.' }, { status: 200 });

  } catch (error: any) {
    console.error('Delete History Error:', error);
    return NextResponse.json({ 
      message: 'Failed to delete analysis report.', 
      error: error.message 
    }, { status: 500 });
  }
}
