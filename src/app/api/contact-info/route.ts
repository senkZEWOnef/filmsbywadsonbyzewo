import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const result = await db.query('SELECT * FROM contact_info ORDER BY created_at DESC LIMIT 1');
    
    if (result.rows.length === 0) {
      // Return default contact info if none exists
      return NextResponse.json({
        email: 'hello@filmsbywadson.com',
        phone: '(555) 123-FILM',
        instagram_url: 'https://instagram.com/filmsbywadson',
        facebook_url: 'https://facebook.com/filmsbywadson',
        address: 'Serving weddings worldwide'
      });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json({ error: 'Failed to fetch contact info' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, phone, instagram_url, facebook_url, address } = await request.json();
    
    // First, check if contact info already exists
    const existing = await db.query('SELECT id FROM contact_info ORDER BY created_at DESC LIMIT 1');
    
    if (existing.rows.length > 0) {
      // Update existing record
      const result = await db.query(
        `UPDATE contact_info 
         SET email = $1, phone = $2, instagram_url = $3, facebook_url = $4, address = $5, updated_at = NOW() 
         WHERE id = $6 
         RETURNING *`,
        [email, phone, instagram_url, facebook_url, address, existing.rows[0].id]
      );
      return NextResponse.json(result.rows[0]);
    } else {
      // Create new record
      const result = await db.query(
        `INSERT INTO contact_info (email, phone, instagram_url, facebook_url, address, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
        [email, phone, instagram_url, facebook_url, address]
      );
      return NextResponse.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json({ error: 'Failed to update contact info' }, { status: 500 });
  }
}