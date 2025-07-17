// app/api/properties/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, properties, images, agents } from '@/lib/db';
import { eq, and, gte, lte, like, desc, sql, asc,inArray } from 'drizzle-orm';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'edge';

// Validation schema for query parameters
function setCacheHeaders(response: NextResponse, maxAge: number = 60) {
  response.headers.set(
    'Cache-Control',
    `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`
  );
  return response;
}

// Optimized query schema with defaults
const querySchema = z.object({
  location: z.string().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  category: z.enum(['sale', 'rent', 'short-stay']).optional(),
  propertyType: z.enum(['house', 'apartment', 'villa', 'land']).optional(),
  furnished: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(50).default(12),
  search: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.enum(['createdAt', 'price', 'bedrooms', 'area']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  cursor: z.string().optional(), // For cursor-based pagination
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = querySchema.parse(searchParams);
    
    // Build optimized where conditions
    const conditions = [];
    
    // Status filter with index usage
    conditions.push(eq(properties.status, query.status || 'active'));
    
    // Optimized search with full-text search if available
    if (query.search && query.search.length >= 2) {
      const searchTerm = `%${query.search}%`;
      conditions.push(
        sql`(
          ${properties.title} LIKE ${searchTerm} OR
          ${properties.location} LIKE ${searchTerm}
        )`
      );
    }
    
    // Apply other filters
    if (query.location) conditions.push(eq(properties.location, query.location));
    if (query.priceMin !== undefined) conditions.push(gte(properties.price, query.priceMin));
    if (query.priceMax !== undefined) conditions.push(lte(properties.price, query.priceMax));
    if (query.bedrooms !== undefined) conditions.push(gte(properties.bedrooms, query.bedrooms));
    if (query.bathrooms !== undefined) conditions.push(gte(properties.bathrooms, query.bathrooms));
    if (query.category) conditions.push(eq(properties.category, query.category));
    if (query.propertyType) conditions.push(eq(properties.propertyType, query.propertyType));
    if (query.furnished !== undefined) conditions.push(eq(properties.furnished, query.furnished));
    if (query.featured !== undefined) conditions.push(eq(properties.featured, query.featured));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Parallel execution of count and data queries
    const [countResult, dataResults] = await Promise.all([
      // Count query
      db.select({ count: sql<number>`count(*)` })
        .from(properties)
        .where(whereClause),
      
      // Data query with optimized joins
      db.select({
        property: properties,
        agent: agents,
      })
      .from(properties)
      .leftJoin(agents, eq(properties.agentId, agents.id))
      .where(whereClause)
      .orderBy(
        query.sortOrder === 'asc' 
          ? asc(properties[query.sortBy]) 
          : desc(properties[query.sortBy])
      )
      .limit(query.limit)
      .offset((query.page - 1) * query.limit)
    ]);

    const count = countResult[0].count;

    // Batch load images for all properties
    const propertyIds = dataResults.map(r => r.property.id);
    const propertyImages = propertyIds.length > 0
      ? await db
          .select({
            id: images.id,
            url: images.url,
            alt: images.alt,
            isMain: images.isMain,
            order: images.order,
            entityId: images.entityId,
          })
          .from(images)
          .where(
            and(
              eq(images.entityType, 'property'),
              inArray(images.entityId, propertyIds)
            )
          )
          .orderBy(asc(images.order))
      : [];

    // Efficient image grouping
    const imagesByProperty = propertyImages.reduce((acc, img) => {
      (acc[img.entityId] ||= []).push(img);
      return acc;
    }, {} as Record<string, typeof propertyImages>);

    // Format response with parsed JSON fields
    const formattedResults = dataResults.map(({ property, agent }) => ({
      ...property,
      features: property.features ? JSON.parse(property.features) : [],
      amenities: property.amenities ? JSON.parse(property.amenities) : [],
      agent,
      images: imagesByProperty[property.id] || [],
    }));

    // Create response with caching
    const response = NextResponse.json({
      data: {
        items: formattedResults,
        pagination: {
          page: query.page,
          limit: query.limit,
          total: count,
          pages: Math.ceil(count / query.limit),
          hasNext: query.page < Math.ceil(count / query.limit),
          hasPrev: query.page > 1,
        },
      }
    });

    // Set cache headers based on content type
    const cacheTime = query.featured ? 300 : 60; // 5 min for featured, 1 min for regular
    return setCacheHeaders(response, cacheTime);
    
  } catch (error) {
    console.error('Error fetching properties:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }
    
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
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  isPaidListing: z.boolean().optional(),
  displayOwnContact: z.boolean().optional(),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string().optional(),
    isMain: z.boolean().optional(),
  })).optional(),
  agentId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createPropertySchema.parse(body);
    
    // Handle agent - same pattern as cars
    let agentId = data.agentId;
    
    if (!agentId) {
      // Check if default agent exists
      const defaultEmail = 'sales@jubabuy.com';
      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(eq(agents.email, defaultEmail))
        .limit(1);
      
      if (existingAgent) {
        agentId = existingAgent.id;
      } else {
        // Create default agent
        const newAgentId = uuidv4();
        const [newAgent] = await db.insert(agents).values({
          id: newAgentId,
          name: 'JubaBuy Default Agent',
          email: defaultEmail,
          phone: '+211981779330',
          avatar: 'https://ui-avatars.com/api/?name=JubaBuy+Agent',
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();
        
        agentId = newAgent.id;
      }
    } else {
      // Verify the provided agent ID exists
      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, agentId))
        .limit(1);
      
      if (!existingAgent) {
        // If agent doesn't exist, create one with the provided ID
        await db.insert(agents).values({
          id: agentId,
          name: 'JubaBuy Agent',
          email: `agent-${agentId}@jubabuy.com`,
          phone: '+211981779330',
          avatar: 'https://ui-avatars.com/api/?name=JubaBuy+Agent',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
    
    // Generate property ID and slug
    const propertyId = uuidv4();
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') +
      '-' + Date.now();

    // Insert property with verified agent ID
    const [property] = await db.insert(properties).values({
      id: propertyId,
      ...data,
      agentId,
      slug,
      features: data.features ? JSON.stringify(data.features) : null,
      amenities: data.amenities ? JSON.stringify(data.amenities) : null,
      contactName: data.contactName || null,
      contactEmail: data.contactEmail || null,
      contactPhone: data.contactPhone || null,
      isPaidListing: data.isPaidListing || false,
      displayOwnContact: data.displayOwnContact || false,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    // Insert images if provided
    if (data.images && data.images.length > 0) {
      const imageIds = data.images.map(() => uuidv4());
      await db.insert(images).values(
        data.images.map((img, index) => ({
          id: imageIds[index],
          url: img.url,
          alt: img.alt || data.title,
          isMain: img.isMain || index === 0,
          order: index,
          entityType: 'property' as const,
          entityId: property.id,
          createdAt: new Date(),
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
      data: {
        ...completeProperty.property,
        features: completeProperty.property.features ? JSON.parse(completeProperty.property.features) : [],
        amenities: completeProperty.property.amenities ? JSON.parse(completeProperty.property.amenities) : [],
        agent: completeProperty.agent,
        images: propertyImages,
      }
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
      { error: 'Failed to create property', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}