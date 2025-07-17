// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, properties, cars, land } from '@/lib/db';
import { eq, and, or, like, sql } from 'drizzle-orm';
import { z } from 'zod';

export const runtime = 'edge';

// Validation schema for search parameters
const searchSchema = z.object({
  q: z.string().min(1).optional(),
  type: z.enum(['all', 'property', 'car', 'land']).default('all'),
  limit: z.string().transform(Number).default('10'),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = searchSchema.parse(searchParams);
    
    if (!query.q || query.q.length < 2) {
      return NextResponse.json({
        data: {
          results: [],
          total: 0,
        }
      });
    }

    const searchTerm = `%${query.q}%`;
    const results: any[] = [];

    // Search properties if type is 'all' or 'property'
    if (query.type === 'all' || query.type === 'property') {
      const propertyResults = await db
        .select({
          id: properties.id,
          title: properties.title,
          type: sql<string>`'property'`,
          entityType: sql<string>`'property'`,
          price: properties.price,
          location: properties.location,
          category: properties.category,
          slug: properties.slug,
          image: sql<string>`null`,
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
        .limit(query.limit);
      
      results.push(...propertyResults);
    }

    // Search cars if type is 'all' or 'car'
    if (query.type === 'all' || query.type === 'car') {
      const carResults = await db
        .select({
          id: cars.id,
          title: cars.title,
          type: sql<string>`'car'`,
          entityType: sql<string>`'car'`,
          price: cars.price,
          location: sql<string>`${cars.make} || ' ' || ${cars.model} || ' (' || ${cars.year} || ')'`,
          category: sql<string>`null`,
          slug: cars.slug,
          image: sql<string>`null`,
        })
        .from(cars)
        .where(
          and(
            eq(cars.status, 'active'),
            or(
              like(cars.title, searchTerm),
              like(cars.make, searchTerm),
              like(cars.model, searchTerm),
              like(cars.description, searchTerm)
            )
          )
        )
        .limit(query.limit);
      
      results.push(...carResults);
    }

    // Search land if type is 'all' or 'land'
    if (query.type === 'all' || query.type === 'land') {
      const landResults = await db
        .select({
          id: land.id,
          title: land.title,
          type: sql<string>`'land'`,
          entityType: sql<string>`'land'`,
          price: land.price,
          location: land.location,
          category: sql<string>`null`,
          slug: land.slug,
          image: sql<string>`null`,
        })
        .from(land)
        .where(
          and(
            eq(land.status, 'active'),
            or(
              like(land.title, searchTerm),
              like(land.location, searchTerm),
              like(land.description, searchTerm)
            )
          )
        )
        .limit(query.limit);
      
      results.push(...landResults);
    }

    // If searching all types, limit total results
    const limitedResults = query.type === 'all' 
      ? results.slice(0, query.limit)
      : results;

    return NextResponse.json({
      data: {
        results: limitedResults,
        total: limitedResults.length,
        query: query.q,
        type: query.type,
      }
    });
  } catch (error) {
    console.error('Search failed:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}