import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_type, page_path, metadata } = body;

    // Validate required fields
    if (!event_type || !page_path) {
      return NextResponse.json(
        { error: 'event_type and page_path are required' },
        { status: 400 }
      );
    }

    // Get client information
    const user_agent = request.headers.get('user-agent') || undefined;
    const forwarded = request.headers.get('x-forwarded-for');
    const ip_address = forwarded ? forwarded.split(',')[0] : undefined;
    
    // Generate or get session ID from headers
    const session_id = request.headers.get('x-session-id') || undefined;

    // Insert analytics record
    const result = await db.query(
      `INSERT INTO analytics (event_type, page_path, user_agent, ip_address, session_id, metadata)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, created_at`,
      [
        event_type,
        page_path,
        user_agent,
        ip_address,
        session_id,
        metadata ? JSON.stringify(metadata) : null
      ]
    );

    return NextResponse.json(
      { 
        success: true, 
        id: result.rows[0].id,
        created_at: result.rows[0].created_at 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics event' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const event_type = searchParams.get('event_type');
    const page_path = searchParams.get('page_path');
    const days = parseInt(searchParams.get('days') || '30');

    let query = `
      SELECT 
        event_type,
        page_path,
        COUNT(*) as count,
        DATE(created_at) as date
      FROM analytics 
      WHERE created_at >= NOW() - INTERVAL '${days} days'
    `;
    
    const params: string[] = [];
    let paramIndex = 1;

    if (event_type) {
      query += ` AND event_type = $${paramIndex}`;
      params.push(event_type);
      paramIndex++;
    }

    if (page_path) {
      query += ` AND page_path = $${paramIndex}`;
      params.push(page_path);
    }

    query += ` GROUP BY event_type, page_path, DATE(created_at) ORDER BY date DESC`;

    const result = await db.query(query, params);

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}