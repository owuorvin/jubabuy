// app/api/properties/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, properties, images, agents } from '@/lib/db';
import { eq, and, gte, lte, like, desc, sql } from 'drizzle-orm';
import { z } from 'zod';

// Use Edge Runtime for better performance
export const runtime = 'edge';

// Validation schemas
const querySchema = z.object({
  location: z.string().optional(),
  priceMin: z.string().transform(Number).optional(),
  priceMax: z.string().transform(Number).optional(),
  bedrooms: z.string().transform(Number).optional(),
  category: z.enum(['sale', 'rent', 'short-stay']).optional(),
  propertyType: z.enum(['house', 'apartment', 'villa', 'land']).optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('12'),
  featured: z.string().transform(val => val === 'true').optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = querySchema.parse(searchParams);
    
    // Build where conditions
    const conditions = [eq(properties.status, 'active')];
    
    if (query.location) {
      conditions.push(eq(properties.location, query.location));
    }
    if (query.priceMin) {
      conditions.push(gte(properties.price, query.priceMin));
    }
    if (query.priceMax) {
      conditions.push(lte(properties.price, query.priceMax));
    }
    if (query.bedrooms) {
      conditions.push(gte(properties.bedrooms, query.bedrooms));
    }
    if (query.category) {
      conditions.push(eq(properties.category, query.category));
    }
    if (query.propertyType) {
      conditions.push(eq(properties.propertyType, query.propertyType));
    }
    if (query.featured !== undefined) {
      conditions.push(eq(properties.featured, query.featured));
    }

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(properties)
      .where(and(...conditions));

    // Get properties with agent info
    const offset = (query.page - 1) * query.limit;
    const results = await db
      .select({
        property: properties,
        agent: agents,
      })
      .from(properties)
      .leftJoin(agents, eq(properties.agentId, agents.id))
      .where(and(...conditions))
      .orderBy(desc(properties.createdAt))
      .limit(query.limit)
      .offset(offset);

    // Get images for each property
    const propertyIds = results.map(r => r.property.id);
    const propertyImages = propertyIds.length > 0
      ? await db
          .select()
          .from(images)
          .where(
            and(
              eq(images.entityType, 'property'),
              sql`${images.entityId} IN ${propertyIds}`
            )
          )
          .orderBy(images.order)
      : [];

    // Group images by property
    const imagesByProperty = propertyImages.reduce((acc, img) => {
      if (!acc[img.entityId]) acc[img.entityId] = [];
      acc[img.entityId].push(img);
      return acc;
    }, {} as Record<string, typeof propertyImages>);

    // Format response
    const formattedResults = results.map(({ property, agent }) => ({
      ...property,
      features: property.features ? JSON.parse(property.features) : [],
      amenities: property.amenities ? JSON.parse(property.amenities) : [],
      agent,
      images: imagesByProperty[property.id] || [],
    }));

    return NextResponse.json({
      properties: formattedResults,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: count,
        pages: Math.ceil(count / query.limit),
      },
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// Create property schema
const createPropertySchema = z.object({
  title: z.string().min(1),
  price: z.number().positive(),
  location: z.string().min(1),
  category: z.enum(['sale', 'rent', 'short-stay']),
  propertyType: z.enum(['house', 'apartment', 'villa', 'land']).optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  area: z.number().optional(),
  furnished: z.boolean().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
    isMain: z.boolean().optional(),
  })).optional(),
  agentId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createPropertySchema.parse(body);
    
    // Generate slug
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') +
      '-' + Date.now();

    // Insert property
    const [property] = await db.insert(properties).values({
      ...data,
      slug,
      features: data.features ? JSON.stringify(data.features) : null,
      amenities: data.amenities ? JSON.stringify(data.amenities) : null,
    }).returning();

    // Insert images if provided
    if (data.images && data.images.length > 0) {
      await db.insert(images).values(
        data.images.map((img, index) => ({
          url: img.url,
          alt: img.alt,
          isMain: img.isMain || index === 0,
          order: index,
          entityType: 'property' as const,
          entityId: property.id,
        }))
      );
    }

    // Fetch complete property with relations
    const [completeProperty] = await db
      .select({
        property: properties,
        agent: agents,
      })
      .from(properties)
      .leftJoin(agents, eq(properties.agentId, agents.id))
      .where(eq(properties.id, property.id));

    const propertyImages = await db
      .select()
      .from(images)
      .where(
        and(
          eq(images.entityType, 'property'),
          eq(images.entityId, property.id)
        )
      )
      .orderBy(images.order);

    return NextResponse.json({
      ...completeProperty.property,
      features: completeProperty.property.features ? JSON.parse(completeProperty.property.features) : [],
      amenities: completeProperty.property.amenities ? JSON.parse(completeProperty.property.amenities) : [],
      agent: completeProperty.agent,
      images: propertyImages,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}