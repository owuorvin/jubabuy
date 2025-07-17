// app/api/cars/featured/route.ts
import { db, cars, agents, images } from '@/lib/db';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '6');

    const results = await db
      .select({
        car: cars,
        agent: agents,
      })
      .from(cars)
      .leftJoin(agents, eq(cars.agentId, agents.id))
      .where(
        and(
          eq(cars.status, 'active'),
          eq(cars.featured, true)
        )
      )
      .orderBy(desc(cars.createdAt))
      .limit(limit);
console.log("results",results);
    // Get images
    const carIds = results.map(r => r.car.id);
    const carImages = carIds.length > 0
      ? await db
          .select()
          .from(images)
          .where(
            and(
              eq(images.entityType, 'car'),
              inArray(images.entityId, carIds)
            )
          )
          .orderBy(images.order)
      : [];

    const imagesByCar = carImages.reduce((acc, img) => {
      if (!acc[img.entityId]) acc[img.entityId] = [];
      acc[img.entityId].push(img);
      return acc;
    }, {} as Record<string, typeof carImages>);

    const data = results.map(({ car, agent }) => ({
      ...car,
      features: car.features ? JSON.parse(car.features) : [],
      agent,
      images: imagesByCar[car.id] || [],
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Failed to fetch featured cars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured cars' },
      { status: 500 }
    );
  }
}