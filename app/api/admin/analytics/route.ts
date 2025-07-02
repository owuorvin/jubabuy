// app/api/admin/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, properties, cars } from '@/lib/db';
import { sql, gte, and, eq } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get('range') || '7d';
    const type = searchParams.get('type') || 'revenue';
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    let interval: string;
    switch (range) {
      case '24h':
        startDate.setHours(endDate.getHours() - 24);
        interval = 'hour';
        break;
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        interval = 'day';
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        interval = 'day';
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        interval = 'week';
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
        interval = 'day';
    }

    // Generate data points based on the interval
    const data = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const point = {
        date: interval === 'hour' 
          ? current.toLocaleTimeString('en-US', { hour: '2-digit' })
          : current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: 0,
        views: 0,
        listings: 0,
      };

      // In a real implementation, you would query the database for each time period
      // For now, we'll use mock data
      point.revenue = Math.floor(Math.random() * 50000) + 20000;
      point.views = Math.floor(Math.random() * 1000) + 500;
      point.listings = Math.floor(Math.random() * 20) + 5;

      data.push(point);

      // Increment based on interval
      if (interval === 'hour') {
        current.setHours(current.getHours() + 1);
      } else if (interval === 'day') {
        current.setDate(current.getDate() + 1);
      } else if (interval === 'week') {
        current.setDate(current.getDate() + 7);
      }
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

