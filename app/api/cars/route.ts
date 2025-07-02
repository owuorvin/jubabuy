// app/api/cars/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, cars, images, agents } from '@/lib/db';
import { eq, and, gte, lte, like, desc, sql } from 'drizzle-orm';
import { z } from 'zod';

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
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = querySchema.parse(searchParams);
    
    // Build where conditions
    const conditions = [eq(cars.status, 'active')];
    
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
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(cars)
      .where(and(...conditions));

    // Get cars with agent info
    const offset = (query.page - 1) * query.limit;
    const results = await db
      .select({
        car: cars,
        agent: agents,
      })
      .from(cars)
      .leftJoin(agents, eq(cars.agentId, agents.id))
      .where(and(...conditions))
      .orderBy(desc(cars.createdAt))
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
              sql`${images.entityId} IN ${carIds}`
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

    return NextResponse.json({
      cars: formattedResults,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: count,
        pages: Math.ceil(count / query.limit),
      },
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cars' },
      { status: 500 }
    );
  }
}

// Create car schema
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
    const data = createCarSchema.parse(body);
    
    // Generate slug
    const slug = `${data.make}-${data.model}-${data.year}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') +
      '-' + Date.now();

    // Insert car
    const [car] = await db.insert(cars).values({
      ...data,
      slug,
      title: data.title || `${data.year} ${data.make} ${data.model}`,
      features: data.features ? JSON.stringify(data.features) : null,
    }).returning();

    // Insert images if provided
    if (data.images && data.images.length > 0) {
      await db.insert(images).values(
        data.images.map((img, index) => ({
          url: img.url,
          alt: img.alt || `${data.make} ${data.model}`,
          isMain: img.isMain || index === 0,
          order: index,
          entityType: 'car' as const,
          entityId: car.id,
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
      ...completeCar.car,
      features: completeCar.car.features ? JSON.parse(completeCar.car.features) : [],
      agent: completeCar.agent,
      images: carImages,
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
      { error: 'Failed to create car' },
      { status: 500 }
    );
  }
}