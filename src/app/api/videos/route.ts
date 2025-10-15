import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoType = searchParams.get('type');
    
    let query = 'SELECT * FROM videos';
    const params: string[] = [];
    
    if (videoType) {
      query += ' WHERE video_type = $1';
      params.push(videoType);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await db.query(query, params);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, filePath, videoType } = await request.json();
    
    const result = await db.query(
      'INSERT INTO videos (name, file_path, video_type, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
      [name, filePath, videoType]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name } = await request.json();
    
    await db.query(
      'UPDATE videos SET name = $1, updated_at = NOW() WHERE id = $2',
      [name, id]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    await db.query('DELETE FROM videos WHERE id = $1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}