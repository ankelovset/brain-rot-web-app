import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const videosDirectory = join(process.cwd(), 'public', 'videos');
    const files = await readdir(videosDirectory);
    
    // Filter for video files (common video extensions)
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    const videoFiles = files.filter(file => 
      videoExtensions.some(ext => file.toLowerCase().endsWith(ext))
    );

    return NextResponse.json({ videos: videoFiles });
  } catch (error) {
    console.error('Error reading videos directory:', error);
    return NextResponse.json(
      { error: 'Failed to read videos directory' },
      { status: 500 }
    );
  }
}

