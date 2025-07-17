// app/api/land/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, land, images, agents } from '@/lib/db';
import { eq, and, gte, lte, like, desc, sql, asc,inArray } from 'drizzle-orm';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'edge';

// Validation schema for query parameters
const querySchema = z.object({
  location: z.string().optional(),
  priceMin: z.string().transform(Number).optional(),
  priceMax: z.string().transform(Number).optional(),
  areaMin: z.string().transform(Number).optional(),
  areaMax: z.string().transform(Number).optional(),
  unit: z.enum(['sqm', 'acres', 'hectares']).optional(),
  zoning: z.enum(['Residential', 'Commercial', 'Mixed', 'Agricultural']).optional(),
  featured: z.string().transform(val => val === 'true').optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('12'),
  search: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    
    // Filter out undefined values
    const cleanedParams = Object.entries(searchParams).reduce((acc, [key, value]) => {
      if (value !== 'undefined' && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);
    
    const query = querySchema.parse(cleanedParams);
    
    // Build where conditions
    const conditions = [];
    
    // Status filter
    if (query.status && query.status !== 'all') {
      conditions.push(eq(land.status, query.status));
    } else {
      conditions.push(eq(land.status, 'active'));
    }
    
    // Search functionality
    if (query.search) {
      conditions.push(
        sql`(
          ${land.title} LIKE ${'%' + query.search + '%'} OR
          ${land.location} LIKE ${'%' + query.search + '%'} OR
          ${land.description} LIKE ${'%' + query.search + '%'}
        )`
      );
    }
    
    // Other filters
    if (query.location) {
      conditions.push(eq(land.location, query.location));
    }
    if (query.priceMin) {
      conditions.push(gte(land.price, query.priceMin));
    }
    if (query.priceMax) {
      conditions.push(lte(land.price, query.priceMax));
    }
    if (query.areaMin) {
      conditions.push(gte(land.area, query.areaMin));
    }
    if (query.areaMax) {
      conditions.push(lte(land.area, query.areaMax));
    }
    if (query.unit) {
      conditions.push(eq(land.unit, query.unit));
    }
    if (query.zoning) {
      conditions.push(eq(land.zoning, query.zoning));
    }
    if (query.featured !== undefined) {
      conditions.push(eq(land.featured, query.featured));
    }

    // Get total count
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(land)
      .where(whereClause);

    // Determine sort order
    let orderByClause;
    switch (query.sortBy) {
      case 'price':
        orderByClause = query.sortOrder === 'asc' ? asc(land.price) : desc(land.price);
        break;
      case 'area':
        orderByClause = query.sortOrder === 'asc' ? asc(land.area) : desc(land.area);
        break;
      case 'createdAt':
      default:
        orderByClause = query.sortOrder === 'asc' ? asc(land.createdAt) : desc(land.createdAt);
        break;
    }

    // Get land with agent info
    const offset = (query.page - 1) * query.limit;
    const results = await db
      .select({
        land: land,
        agent: agents,
      })
      .from(land)
      .leftJoin(agents, eq(land.agentId, agents.id))
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(query.limit)
      .offset(offset);

    // Get images for each land
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

    // Group images by land
    const imagesByLand = landImages.reduce((acc, img) => {
      if (!acc[img.entityId]) acc[img.entityId] = [];
      acc[img.entityId].push(img);
      return acc;
    }, {} as Record<string, typeof landImages>);

    // Format response
    const formattedResults = results.map(({ land: landItem, agent }) => ({
      ...landItem,
      features: landItem.features ? JSON.parse(landItem.features) : [],
      agent,
      images: imagesByLand[landItem.id] || [],
    }));

    // Return consistent response structure
    return NextResponse.json({
      data: {
        items: formattedResults,
        pagination: {
          page: query.page,
          limit: query.limit,
          total: count,
          pages: Math.ceil(count / query.limit),
        },
      }
    });
  } catch (error) {
    console.error('Error fetching land:', error);
    return NextResponse.json(
      { error: 'Failed to fetch land', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Create land schema
const createLandSchema = z.object({
  title: z.string().min(1),
  price: z.number().positive(),
  location: z.string().min(1),
  area: z.number().positive(),
  unit: z.enum(['sqm', 'acres', 'hectares']),
  zoning: z.enum(['Residential', 'Commercial', 'Mixed', 'Agricultural']),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
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
    const data = createLandSchema.parse(body);
    
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
    
    // Generate land ID and slug
    const landId = uuidv4();
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') +
      '-' + Date.now();

    // Insert land with verified agent ID
    const [landItem] = await db.insert(land).values({
      id: landId,
      ...data,
      agentId,
      slug,
      features: data.features ? JSON.stringify(data.features) : null,
      contactName: data.contactName || null,
      contactEmail: data.contactEmail || null,
      contactPhone: data.contactPhone || null,
      isPaidListing: data.isPaidListing || false,
      displayOwnContact: data.displayOwnContact || false,
      status: 'pending',
      featured: false,
      views: 0,
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
          entityType: 'land' as const,
          entityId: landItem.id,
          createdAt: new Date(),
        }))
      );
    }

    // Fetch complete land with relations
    const [completeLand] = await db
      .select({
        land: land,
        agent: agents,
      })
      .from(land)
      .leftJoin(agents, eq(land.agentId, agents.id))
      .where(eq(land.id, landItem.id));

    const landImages = await db
      .select()
      .from(images)
      .where(
        and(
          eq(images.entityType, 'land'),
          eq(images.entityId, landItem.id)
        )
      )
      .orderBy(images.order);

    return NextResponse.json({
      data: {
        ...completeLand.land,
        features: completeLand.land.features ? JSON.parse(completeLand.land.features) : [],
        agent: completeLand.agent,
        images: landImages,
      }
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating land:', error);
    return NextResponse.json(
      { error: 'Failed to create land', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}