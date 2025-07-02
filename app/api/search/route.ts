import { NextRequest, NextResponse } from 'next/server';
import { db, properties, cars } from '@/lib/db';
import { eq, and, or, like, sql } from 'drizzle-orm'; // ADD 'or' to imports

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { q } = Object.fromEntries(request.nextUrl.searchParams);
    
    if (!q || q.length < 3) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = `%${q}%`;

    // Search properties
    const propertyResults = await db
      .select({
        id: properties.id,
        title: properties.title,
        type: sql<string>`'property'`,
        price: properties.price,
        location: properties.location,
      })
      .from(properties)
      .where(
        and(
          eq(properties.status, 'active'),
          or(
            like(properties.title, searchTerm),
            like(properties.location, searchTerm),
            like(properties.description, searchTerm)
          )
        )
      )
      .limit(5);

    // Search cars
    const carResults = await db
      .select({
        id: cars.id,
        title: cars.title,
        type: sql<string>`'car'`,
        price: cars.price,
        location: sql<string>`${cars.make} || ' ' || ${cars.model}`,
      })
      .from(cars)
      .where(
        and(
          eq(cars.status, 'active'),
          or(
            like(cars.title, searchTerm),
            like(cars.make, searchTerm),
            like(cars.model, searchTerm)
          )
        )
      )
      .limit(5);

    const results = [...propertyResults, ...carResults];

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}