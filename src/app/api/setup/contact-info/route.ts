import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function POST() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS contact_info (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        instagram_url TEXT NOT NULL,
        facebook_url TEXT NOT NULL,
        address TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Insert default contact info if table is empty
    const existing = await db.query('SELECT COUNT(*) FROM contact_info');
    if (parseInt(existing.rows[0].count) === 0) {
      await db.query(`
        INSERT INTO contact_info (email, phone, instagram_url, facebook_url, address, created_at, updated_at)
        VALUES (
          'hello@filmsbywadson.com',
          '(555) 123-FILM',
          'https://instagram.com/filmsbywadson',
          'https://facebook.com/filmsbywadson',
          'Serving weddings worldwide',
          NOW(),
          NOW()
        );
      `);
    }

    return NextResponse.json({
      success: true,
      message: 'Contact info table setup successfully'
    });
  } catch (error) {
    console.error('Setup contact info table error:', error);
    return NextResponse.json(
      { error: 'Failed to setup contact info table' },
      { status: 500 }
    );
  }
}