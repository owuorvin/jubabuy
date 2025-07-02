import { NextRequest, NextResponse } from 'next/server';
import { db, properties,cars, images, agents } from '@/lib/db';
import { eq, and, gte, lte, like, desc, sql } from 'drizzle-orm';
import { z } from 'zod';

// Use Edge Runtime for better performance
export const runtime = 'edge';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = params;
      
      // Get property with agent
      const [result] = await db
        .select({
          property: properties,
          agent: agents,
        })
        .from(properties)
        .leftJoin(agents, eq(properties.agentId, agents.id))
        .where(eq(properties.id, id));
  
      if (!result) {
        return NextResponse.json(
          { error: 'Property not found' },
          { status: 404 }
        );
      }
  
      // Get images
      const propertyImages = await db
        .select()
        .from(images)
        .where(
          and(
            eq(images.entityType, 'property'),
            eq(images.entityId, id)
          )
        )
        .orderBy(images.order);
  
      // Increment views
      await db
        .update(properties)
        .set({ views: sql`${properties.views} + 1` })
        .where(eq(properties.id, id));
  
      return NextResponse.json({
        ...result.property,
        features: result.property.features ? JSON.parse(result.property.features) : [],
        amenities: result.property.amenities ? JSON.parse(result.property.amenities) : [],
        agent: result.agent,
        images: propertyImages,
      });
    } catch (error) {
      console.error('Error fetching property:', error);
      return NextResponse.json(
        { error: 'Failed to fetch property' },
        { status: 500 }
      );
    }
  }
  