import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function POST() {
  try {
    // Create analytics table
    await db.query(`
      CREATE TABLE IF NOT EXISTS analytics (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('page_view', 'video_view', 'photo_view', 'contact_form_view', 'booking_form_view')),
          page_path VARCHAR(255) NOT NULL,
          user_agent TEXT,
          ip_address INET,
          session_id VARCHAR(255),
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_analytics_page_path ON analytics(page_path);
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics(session_id);
    `);
    
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_analytics_event_date ON analytics(event_type, created_at);
    `);

    return NextResponse.json({
      success: true,
      message: 'Analytics table created successfully'
    });
  } catch (error) {
    console.error('Setup analytics table error:', error);
    return NextResponse.json(
      { error: 'Failed to setup analytics table' },
      { status: 500 }
    );
  }
}