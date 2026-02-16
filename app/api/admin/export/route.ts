import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongodb';

const SESSION_TOKEN = 'admin_session_token_2024';

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === SESSION_TOKEN;
}

function escapeCSV(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function flattenObject(obj: any, prefix = ''): Record<string, any> {
  const flattened: Record<string, any> = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key]) && !(obj[key] instanceof Date)) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else if (Array.isArray(obj[key])) {
        flattened[newKey] = obj[key].join('; ');
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }
  
  return flattened;
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

    // Fetch all surveys
    const surveys = await collection.find({}).sort({ completedAt: -1 }).toArray();

    if (surveys.length === 0) {
      return NextResponse.json({ error: 'No surveys found' }, { status: 404 });
    }

    // Flatten all survey objects
    const flattenedSurveys = surveys.map((survey) => {
      const flat = flattenObject(survey);
      // Convert dates to ISO strings
      if (flat.startedAt instanceof Date) flat.startedAt = flat.startedAt.toISOString();
      if (flat.completedAt instanceof Date) flat.completedAt = flat.completedAt.toISOString();
      if (flat._id) flat._id = flat._id.toString();
      return flat;
    });

    // Get all unique keys from all surveys
    const allKeys = new Set<string>();
    flattenedSurveys.forEach((survey) => {
      Object.keys(survey).forEach((key) => allKeys.add(key));
    });

    const headers = Array.from(allKeys).sort();

    // Generate CSV
    const csvRows: string[] = [];
    
    // Header row
    csvRows.push(headers.map(escapeCSV).join(','));

    // Data rows
    flattenedSurveys.forEach((survey) => {
      const row = headers.map((header) => escapeCSV(survey[header]));
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="survey-results-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting surveys:', error);
    return NextResponse.json(
      { error: 'Failed to export surveys' },
      { status: 500 }
    );
  }
}

