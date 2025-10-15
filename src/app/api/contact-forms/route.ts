import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const result = await db.query('SELECT * FROM contact_forms ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching contact forms:', error);
    return NextResponse.json({ error: 'Failed to fetch contact forms' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, wedding_date, venue, message } = await request.json();
    
    const result = await db.query(
      'INSERT INTO contact_forms (name, phone, email, wedding_date, venue, message, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *',
      [name, phone, email, wedding_date, venue, message, 'new']
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    
    await db.query('UPDATE contact_forms SET status = $1 WHERE id = $2', [status, id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating contact form status:', error);
    return NextResponse.json({ error: 'Failed to update contact form status' }, { status: 500 });
  }
}