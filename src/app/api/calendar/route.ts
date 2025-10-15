import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const result = await db.query('SELECT * FROM calendar ORDER BY date');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { date, status, notes } = await request.json();
    
    const result = await db.query(
      `INSERT INTO calendar (date, status, notes, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW()) 
       ON CONFLICT (date) 
       DO UPDATE SET status = $2, notes = $3, updated_at = NOW() 
       RETURNING *`,
      [date, status, notes]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating calendar:', error);
    return NextResponse.json({ error: 'Failed to update calendar' }, { status: 500 });
  }
}