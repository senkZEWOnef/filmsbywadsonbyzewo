import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Get overall analytics summary
    const summaryQuery = `
      SELECT 
        event_type,
        COUNT(*) as total_count,
        COUNT(DISTINCT session_id) as unique_sessions,
        COUNT(DISTINCT ip_address) as unique_visitors
      FROM analytics 
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY event_type
      ORDER BY total_count DESC
    `;

    // Get portfolio views specifically
    const portfolioViewsQuery = `
      SELECT COUNT(*) as portfolio_views
      FROM analytics 
      WHERE event_type = 'page_view' 
        AND page_path = '/portfolio'
        AND created_at >= NOW() - INTERVAL '${days} days'
    `;

    // Get daily breakdown for the last 7 days
    const dailyBreakdownQuery = `
      SELECT 
        DATE(created_at) as date,
        event_type,
        COUNT(*) as count
      FROM analytics 
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at), event_type
      ORDER BY date DESC, event_type
    `;

    // Get most popular pages
    const popularPagesQuery = `
      SELECT 
        page_path,
        COUNT(*) as views,
        COUNT(DISTINCT session_id) as unique_visitors
      FROM analytics 
      WHERE event_type = 'page_view'
        AND created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY page_path
      ORDER BY views DESC
      LIMIT 10
    `;

    const [summaryResult, portfolioResult, dailyResult, popularPagesResult] = await Promise.all([
      db.query(summaryQuery),
      db.query(portfolioViewsQuery),
      db.query(dailyBreakdownQuery),
      db.query(popularPagesQuery)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        summary: summaryResult.rows,
        portfolioViews: portfolioResult.rows[0]?.portfolio_views || 0,
        dailyBreakdown: dailyResult.rows,
        popularPages: popularPagesResult.rows
      }
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics summary' },
      { status: 500 }
    );
  }
}