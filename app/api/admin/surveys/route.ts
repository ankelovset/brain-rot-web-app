import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongodb';

const SESSION_TOKEN = 'admin_session_token_2024';

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === SESSION_TOKEN;
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'brain-rot-study');
    const collection = db.collection('surveys');

    // Fetch all surveys, sorted by completedAt (newest first)
    const surveys = await collection
      .find({})
      .sort({ completedAt: -1 })
      .toArray();

    // Convert MongoDB ObjectId to string for JSON serialization
    const surveysWithIds = surveys.map((survey) => ({
      ...survey,
      _id: survey._id.toString(),
      startedAt: survey.startedAt?.toISOString(),
      completedAt: survey.completedAt?.toISOString(),
    }));

    return NextResponse.json({ surveys: surveysWithIds });
  } catch (error) {
    console.error('Error fetching surveys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surveys' },
      { status: 500 }
    );
  }
}

