import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const result = await db.query('SELECT * FROM callback_requests ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching callback requests:', error);
    return NextResponse.json({ error: 'Failed to fetch callback requests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, phone, best_time } = await request.json();
    
    const result = await db.query(
      'INSERT INTO callback_requests (name, phone, best_time, status, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [name, phone, best_time, 'pending']
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error submitting callback request:', error);
    return NextResponse.json({ error: 'Failed to submit callback request' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    
    await db.query('UPDATE callback_requests SET status = $1 WHERE id = $2', [status, id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating callback status:', error);
    return NextResponse.json({ error: 'Failed to update callback status' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    await db.query('DELETE FROM callback_requests WHERE id = $1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting callback request:', error);
    return NextResponse.json({ error: 'Failed to delete callback request' }, { status: 500 });
  }
}