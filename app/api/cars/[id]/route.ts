// app/api/cars/[id]/route.ts - Updated to handle both ID and slug
import { NextRequest, NextResponse } from 'next/server';
import { db, cars, images, agents } from '@/lib/db';
import { eq, and, or, sql } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const identifier = params.id;
    
    // Get car by ID or slug
    const [result] = await db
      .select({
        car: cars,
        agent: agents,
      })
      .from(cars)
      .leftJoin(agents, eq(cars.agentId, agents.id))
      .where(
        or(
          eq(cars.id, identifier),
          eq(cars.slug, identifier)
        )
      );

    if (!result) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }

    // Get images
    const carImages = await db
      .select()
      .from(images)
      .where(
        and(
          eq(images.entityType, 'car'),
          eq(images.entityId, result.car.id)
        )
      )
      .orderBy(images.order);

    // Increment views
    await db
      .update(cars)
      .set({ views: sql`${cars.views} + 1` })
      .where(eq(cars.id, result.car.id));

    return NextResponse.json({
      data: {
        ...result.car,
        features: result.car.features ? JSON.parse(result.car.features) : [],
        agent: result.agent,
        images: carImages,
      }
    });
  } catch (error) {
    console.error('Error fetching car:', error);
    return NextResponse.json(
      { error: 'Failed to fetch car' },
      { status: 500 }
    );
  }
}
  
  export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = params;
      const body = await request.json();
      
      // Update car
      const [updatedCar] = await db
        .update(cars)
        .set({
          ...body,
          features: body.features ? JSON.stringify(body.features) : undefined,
          updatedAt: new Date(),
        })
        .where(eq(cars.id, id))
        .returning();
  
      if (!updatedCar) {
        return NextResponse.json(
          { error: 'Car not found' },
          { status: 404 }
        );
      }
  
      // Handle image updates if provided
      if (body.images) {
        // Delete existing images
        await db
          .delete(images)
          .where(
            and(
              eq(images.entityType, 'car'),
              eq(images.entityId, id)
            )
          );
  
        // Insert new images
        if (body.images.length > 0) {
          await db.insert(images).values(
            body.images.map((img: any, index: number) => ({
              url: img.url,
              alt: img.alt,
              isMain: img.isMain || index === 0,
              order: index,
              entityType: 'car' as const,
              entityId: id,
            }))
          );
        }
      }
  
      // Fetch updated car with relations
      const [result] = await db
        .select({
          car: cars,
          agent: agents,
        })
        .from(cars)
        .leftJoin(agents, eq(cars.agentId, agents.id))
        .where(eq(cars.id, id));
  
      const carImages = await db
        .select()
        .from(images)
        .where(
          and(
            eq(images.entityType, 'car'),
            eq(images.entityId, id)
          )
        )
        .orderBy(images.order);
  
      return NextResponse.json({
        ...result.car,
        features: result.car.features ? JSON.parse(result.car.features) : [],
        agent: result.agent,
        images: carImages,
      });
    } catch (error) {
      console.error('Error updating car:', error);
      return NextResponse.json(
        { error: 'Failed to update car' },
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = params;
      
      // Delete associated images first (cascade delete)
      await db
        .delete(images)
        .where(
          and(
            eq(images.entityType, 'car'),
            eq(images.entityId, id)
          )
        );
  
      // Delete the car
      await db
        .delete(cars)
        .where(eq(cars.id, id));
  
      return NextResponse.json({ 
        message: 'Car deleted successfully' 
      });
    } catch (error) {
      console.error('Error deleting car:', error);
      return NextResponse.json(
        { error: 'Failed to delete car' },
        { status: 500 }
      );
    }
  }