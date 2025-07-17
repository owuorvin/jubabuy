// app/api/land/featured/route.ts
import { db, land, agents, images } from '@/lib/db';
import { eq, and, desc, inArray, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '6');

    // First try to get featured land
    let results = await db
      .select({
        land: land,
        agent: agents,
      })
      .from(land)
      .leftJoin(agents, eq(land.agentId, agents.id))
      .where(
        and(
          eq(land.status, 'active'),
          eq(land.featured, true)
        )
      )
      .orderBy(desc(land.createdAt))
      .limit(limit);

    // If no featured land, get recent active land
    if (results.length === 0) {
      console.log('No featured land found, fetching recent land instead');
      results = await db
        .select({
          land: land,
          agent: agents,
        })
        .from(land)
        .leftJoin(agents, eq(land.agentId, agents.id))
        .where(eq(land.status, 'active'))
        .orderBy(desc(land.createdAt))
        .limit(limit);
    }

    // Get images
    const landIds = results.map(r => r.land.id);
    const landImages = landIds.length > 0
      ? await db
          .select()
          .from(images)
          .where(
            and(
              eq(images.entityType, 'land'),
              inArray(images.entityId, landIds)
            )
          )
          .orderBy(images.order)
      : [];

    const imagesByLand = landImages.reduce((acc, img) => {
      if (!acc[img.entityId]) acc[img.entityId] = [];
      acc[img.entityId].push(img);
      return acc;
    }, {} as Record<string, typeof landImages>);

    const data = results.map(({ land: landItem, agent }) => ({
      ...landItem,
      features: landItem.features ? JSON.parse(landItem.features) : [],
      agent,
      images: imagesByLand[landItem.id] || [],
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Failed to fetch featured land:', error);
    // Return empty array instead of error for better UX
    return NextResponse.json({ data: [] });
  }
}