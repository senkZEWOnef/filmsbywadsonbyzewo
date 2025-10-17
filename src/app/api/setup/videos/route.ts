import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function POST() {
  try {
    // Add new columns to videos table for YouTube support
    await db.query(`
      ALTER TABLE videos 
      ADD COLUMN IF NOT EXISTS source_type VARCHAR(20) DEFAULT 'upload' CHECK (source_type IN ('upload', 'youtube')),
      ADD COLUMN IF NOT EXISTS youtube_url TEXT,
      ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
    `);

    // Update existing records to have source_type = 'upload'
    await db.query(`
      UPDATE videos 
      SET source_type = 'upload' 
      WHERE source_type IS NULL;
    `);

    return NextResponse.json({
      success: true,
      message: 'Videos table updated successfully for YouTube support'
    });
  } catch (error) {
    console.error('Setup videos table error:', error);
    return NextResponse.json(
      { error: 'Failed to setup videos table' },
      { status: 500 }
    );
  }
}