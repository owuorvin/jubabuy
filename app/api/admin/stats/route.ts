// app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, properties, cars, land, inquiries } from '@/lib/db';
import { eq, and, gte, sql, desc } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Get date range from query params
    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get('range') || '7d';
    
    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    
    switch (range) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
    }

    // Fetch statistics from database
    const [
      propertyStats,
      carStats,
      landStats,
      recentInquiries,
      totalRevenue,
    ] = await Promise.all([
      // Properties stats
      db.select({
        total: sql<number>`count(*)`,
        active: sql<number>`count(case when status = 'active' then 1 end)`,
        totalViews: sql<number>`sum(views)`,
      }).from(properties),
      
      // Cars stats
      db.select({
        total: sql<number>`count(*)`,
        active: sql<number>`count(case when status = 'active' then 1 end)`,
        totalViews: sql<number>`sum(views)`,
      }).from(cars),
      
      // Land stats
      db.select({
        total: sql<number>`count(*)`,
        active: sql<number>`count(case when status = 'active' then 1 end)`,
        totalViews: sql<number>`sum(views)`,
      }).from(land),
      
      // Recent inquiries count
      db.select({
        count: sql<number>`count(*)`,
      }).from(inquiries)
        .where(gte(inquiries.createdAt, startDate)),
      
      // Total revenue (sum of sold items)
      db.select({
        properties: sql<number>`sum(price)`,
      }).from(properties)
        .where(eq(properties.status, 'sold')),
    ]);

    // Get recent listings
    const recentListings = await db
      .select()
      .from(properties)
      .orderBy(desc(properties.createdAt))
      .limit(10);

    const stats = {
      properties: propertyStats[0]?.total || 0,
      cars: carStats[0]?.total || 0,
      land: landStats[0]?.total || 0,
      rentals: 12, // You can add a separate query for rentals
      totalViews: 
        (propertyStats[0]?.totalViews || 0) + 
        (carStats[0]?.totalViews || 0) + 
        (landStats[0]?.totalViews || 0),
      activeListings: 
        (propertyStats[0]?.active || 0) + 
        (carStats[0]?.active || 0) + 
        (landStats[0]?.active || 0),
      totalRevenue: totalRevenue[0]?.properties || 0,
      newUsers: Math.floor(Math.random() * 100), // Mock data - implement user tracking
      conversionRate: 3.5, // Mock data - calculate from actual conversions
      newInquiries: recentInquiries[0]?.count || 0,
    };

    return NextResponse.json({
      stats,
      recentListings,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

