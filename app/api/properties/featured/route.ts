// app/api/properties/featured/route.ts
import { db, properties, agents, images } from '@/lib/db';
import { eq, and, desc, inArray, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Add response caching
function setCacheHeaders(response: NextResponse, maxAge: number = 60) {
  response.headers.set(
    'Cache-Control',
    `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`
  );
  return response;
}

export async function GET(request: NextRequest) {
  try {
    const limit = Math.min(
      parseInt(request.nextUrl.searchParams.get('limit') || '6'),
      20
    );

    // Single query with all necessary data
    const results = await db
      .select({
        property: {
          id: properties.id,
          title: properties.title,
          slug: properties.slug,
          price: properties.price,
          location: properties.location,
          category: properties.category,
          propertyType: properties.propertyType,
          bedrooms: properties.bedrooms,
          bathrooms: properties.bathrooms,
          area: properties.area,
          features: properties.features,
        },
        agent: {
          id: agents.id,
          name: agents.name,
          phone: agents.phone,
          avatar: agents.avatar,
        },
        mainImage: sql<string>`(
          SELECT url FROM ${images} 
          WHERE entity_type = 'property' 
          AND entity_id = ${properties.id} 
          AND is_main = true 
          LIMIT 1
        )`.as('mainImage'),
      })
      .from(properties)
      .leftJoin(agents, eq(properties.agentId, agents.id))
      .where(
        and(
          eq(properties.status, 'active'),
          eq(properties.featured, true)
        )
      )
      .orderBy(desc(properties.createdAt))
      .limit(limit);

    // Format data
    const data = results.map(({ property, agent, mainImage }) => ({
      ...property,
      features: property.features ? JSON.parse(property.features) : [],
      agent,
      mainImage,
    }));

    // Cache featured properties for 5 minutes
    const response = NextResponse.json({ data });
    return setCacheHeaders(response, 300);
    
  } catch (error) {
    console.error('Failed to fetch featured properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured properties' },
      { status: 500 }
    );
  }
}