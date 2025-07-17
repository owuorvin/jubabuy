// app/api/cars/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, cars, images, agents } from '@/lib/db';
import { eq, and, gte, lte, like, desc, sql, asc,inArray  } from 'drizzle-orm';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { emptyToNull, createTimestamp, stringifyArray } from '@/lib/db/helpers';

export const runtime = 'edge';

// Validation schema for query parameters
const querySchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  yearMin: z.string().transform(Number).optional(),
  yearMax: z.string().transform(Number).optional(),
  priceMin: z.string().transform(Number).optional(),
  priceMax: z.string().transform(Number).optional(),
  mileageMax: z.string().transform(Number).optional(),
  fuel: z.enum(['Petrol', 'Diesel', 'Hybrid', 'Electric']).optional(),
  transmission: z.enum(['Manual', 'Automatic']).optional(),
  condition: z.enum(['New', 'Used']).optional(),
  featured: z.string().transform(val => val === 'true').optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('12'),
  search: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// GET handler - MAKE SURE THIS IS EXPORTED
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
    
    // Always filter by status if provided, otherwise default to active
    if (query.status && query.status !== 'all') {
      conditions.push(eq(cars.status, query.status));
    } else {
      conditions.push(eq(cars.status, 'active'));
    }
    
    // Search functionality
    if (query.search) {
      conditions.push(
        sql`(
          ${cars.title} LIKE ${'%' + query.search + '%'} OR
          ${cars.make} LIKE ${'%' + query.search + '%'} OR
          ${cars.model} LIKE ${'%' + query.search + '%'} OR
          ${cars.description} LIKE ${'%' + query.search + '%'}
        )`
      );
    }
    
    if (query.make) {
      conditions.push(eq(cars.make, query.make));
    }
    if (query.model) {
      conditions.push(eq(cars.model, query.model));
    }
    if (query.yearMin) {
      conditions.push(gte(cars.year, query.yearMin));
    }
    if (query.yearMax) {
      conditions.push(lte(cars.year, query.yearMax));
    }
    if (query.priceMin) {
      conditions.push(gte(cars.price, query.priceMin));
    }
    if (query.priceMax) {
      conditions.push(lte(cars.price, query.priceMax));
    }
    if (query.mileageMax) {
      conditions.push(lte(cars.mileage, query.mileageMax));
    }
    if (query.fuel) {
      conditions.push(eq(cars.fuel, query.fuel));
    }
    if (query.transmission) {
      conditions.push(eq(cars.transmission, query.transmission));
    }
    if (query.condition) {
      conditions.push(eq(cars.condition, query.condition));
    }
    if (query.featured !== undefined) {
      conditions.push(eq(cars.featured, query.featured));
    }

    // Get total count
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(cars)
      .where(whereClause);

    // Determine sort order
    let orderByClause;
    switch (query.sortBy) {
      case 'price':
        orderByClause = query.sortOrder === 'asc' ? asc(cars.price) : desc(cars.price);
        break;
      case 'year':
        orderByClause = query.sortOrder === 'asc' ? asc(cars.year) : desc(cars.year);
        break;
      case 'mileage':
        orderByClause = query.sortOrder === 'asc' ? asc(cars.mileage) : desc(cars.mileage);
        break;
      case 'createdAt':
      default:
        orderByClause = query.sortOrder === 'asc' ? asc(cars.createdAt) : desc(cars.createdAt);
        break;
    }

    // Get cars with agent info
    const offset = (query.page - 1) * query.limit;
    const results = await db
      .select({
        car: cars,
        agent: agents,
      })
      .from(cars)
      .leftJoin(agents, eq(cars.agentId, agents.id))
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(query.limit)
      .offset(offset);

    // Get images for each car
    const carIds = results.map(r => r.car.id);
    const carImages = carIds.length > 0
      ? await db
          .select()
          .from(images)
          .where(
            and(
              eq(images.entityType, 'car'),
              inArray(images.entityId, carIds)
            //   sql`${images.entityId} IN (${carIds.map(id => `'${id}'`).join(', ')})`
            )
          )
          .orderBy(images.order)
      : [];

    // Group images by car
    const imagesByCar = carImages.reduce((acc, img) => {
      if (!acc[img.entityId]) acc[img.entityId] = [];
      acc[img.entityId].push(img);
      return acc;
    }, {} as Record<string, typeof carImages>);

    // Format response
    const formattedResults = results.map(({ car, agent }) => ({
      ...car,
      features: car.features ? JSON.parse(car.features) : [],
      agent,
      images: imagesByCar[car.id] || [],
    }));

    // Return proper response structure
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
    console.error('Error fetching cars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cars', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST handler for creating cars

const createCarSchema = z.object({
    title: z.string().min(1),
    price: z.number().positive(),
    year: z.number().min(1900).max(new Date().getFullYear() + 1),
    make: z.string().min(1),
    model: z.string().min(1),
    mileage: z.number().min(0),
    fuel: z.enum(['Petrol', 'Diesel', 'Hybrid', 'Electric']),
    transmission: z.enum(['Manual', 'Automatic']),
    condition: z.enum(['New', 'Used']),
    color: z.string().optional(),
    engineSize: z.string().optional(),
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
    agentId: z.string().optional(), // Make it optional
  });

export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      const data = createCarSchema.parse(body);
      
      // Handle agent - either use provided ID or create default agent
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
      
      // Generate car ID and slug
      const carId = uuidv4();
      const slug = `${data.make}-${data.model}-${data.year}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
        '-' + Date.now();
  
      // Insert car with the verified agent ID
      const [car] = await db.insert(cars).values({
        id: carId,
        ...data,
        agentId, // Use the verified/created agent ID
        slug,
        title: data.title || `${data.year} ${data.make} ${data.model}`,
        features: data.features ? JSON.stringify(data.features) : null,
        contactName: data.contactName || null,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        isPaidListing: data.isPaidListing || false,
        displayOwnContact: data.displayOwnContact || false,
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
            alt: img.alt || `${data.make} ${data.model}`,
            isMain: img.isMain || index === 0,
            order: index,
            entityType: 'car' as const,
            entityId: car.id,
            createdAt: new Date(),
          }))
        );
      }
  
      // Fetch complete car with relations
      const [completeCar] = await db
        .select({
          car: cars,
          agent: agents,
        })
        .from(cars)
        .leftJoin(agents, eq(cars.agentId, agents.id))
        .where(eq(cars.id, car.id));
  
      const carImages = await db
        .select()
        .from(images)
        .where(
          and(
            eq(images.entityType, 'car'),
            eq(images.entityId, car.id)
          )
        )
        .orderBy(images.order);
  
      return NextResponse.json({
        data: {
          ...completeCar.car,
          features: completeCar.car.features ? JSON.parse(completeCar.car.features) : [],
          agent: completeCar.agent,
          images: carImages,
        }
      }, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        );
      }
      console.error('Error creating car:', error);
      return NextResponse.json(
        { error: 'Failed to create car', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  }