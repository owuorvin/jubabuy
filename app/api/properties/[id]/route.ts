// app/api/properties/[id]/route.ts - Updated to handle both ID and slug
import { NextRequest, NextResponse } from 'next/server';
import { db, properties, images, agents } from '@/lib/db';
import { eq, and, or } from 'drizzle-orm';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'edge';

// GET handler for single property
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const identifier = params.id;
      
      // Get property by ID or slug
      const [result] = await db
        .select({
          property: properties,
          agent: agents,
        })
        .from(properties)
        .leftJoin(agents, eq(properties.agentId, agents.id))
        .where(
          or(
            eq(properties.id, identifier),
            eq(properties.slug, identifier)
          )
        )
        .limit(1);
      
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
            eq(images.entityId, result.property.id)
          )
        )
        .orderBy(images.order);
      
      // Update view count
      await db
        .update(properties)
        .set({ views: (result.property.views || 0) + 1 })
        .where(eq(properties.id, result.property.id));
      
      return NextResponse.json({
        data: {
          ...result.property,
          features: result.property.features ? JSON.parse(result.property.features) : [],
          amenities: result.property.amenities ? JSON.parse(result.property.amenities) : [],
          agent: result.agent,
          images: propertyImages,
        }
      });
    } catch (error) {
      console.error('Error fetching property:', error);
      return NextResponse.json(
        { error: 'Failed to fetch property', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  }

// DELETE handler
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id;
    
    // Check if property exists
    const [existingProperty] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);
    
    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }
    
    // Delete associated images first
    await db
      .delete(images)
      .where(
        and(
          eq(images.entityType, 'property'),
          eq(images.entityId, propertyId)
        )
      );
    
    // Delete the property
    await db
      .delete(properties)
      .where(eq(properties.id, propertyId));
    
    return NextResponse.json({
      message: 'Property deleted successfully',
      data: { id: propertyId }
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PATCH handler for updating featured status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id;
    const body = await request.json();
    
    // Simple schema for featured update
    if ('featured' in body && typeof body.featured === 'boolean') {
      const [updatedProperty] = await db
        .update(properties)
        .set({
          featured: body.featured,
          updatedAt: new Date(),
        })
        .where(eq(properties.id, propertyId))
        .returning();
      
      if (!updatedProperty) {
        return NextResponse.json(
          { error: 'Property not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        message: `Property ${body.featured ? 'featured' : 'unfeatured'} successfully`,
        data: updatedProperty
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Failed to update property', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Update schema - all fields optional
const updatePropertySchema = z.object({
  title: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  location: z.string().min(1).optional(),
  category: z.enum(['sale', 'rent', 'short-stay']).optional(),
  propertyType: z.enum(['house', 'apartment', 'villa', 'land']).optional(),
  bedrooms: z.number().optional().nullable(),
  bathrooms: z.number().optional().nullable(),
  area: z.number().optional().nullable(),
  furnished: z.boolean().optional(),
  description: z.string().optional().nullable(),
  features: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  status: z.enum(['active', 'pending', 'sold', 'rented']).optional(),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string().optional(),
    isMain: z.boolean().optional(),
  })).optional(),
});

// PUT handler for full updates
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id;
    const body = await request.json();
    const data = updatePropertySchema.parse(body);
    
    // Check if property exists
    const [existingProperty] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);
    
    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }
    
    // Prepare update data
    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    };
    
    // Handle features and amenities arrays
    if (data.features) {
      updateData.features = JSON.stringify(data.features);
    }
    if (data.amenities) {
      updateData.amenities = JSON.stringify(data.amenities);
    }
    
    // Update slug if title changed
    if (data.title) {
      updateData.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
        '-' + Date.now();
    }
    
    // Remove images from update data (handle separately)
    const { images: newImages, ...propertyUpdateData } = updateData;
    
    // Update property
    const [updatedProperty] = await db
      .update(properties)
      .set(propertyUpdateData)
      .where(eq(properties.id, propertyId))
      .returning();
    
    // Handle images if provided
    if (newImages && newImages.length > 0) {
      // Delete existing images
      await db
        .delete(images)
        .where(
          and(
            eq(images.entityType, 'property'),
            eq(images.entityId, propertyId)
          )
        );
      
      // Insert new images
      const imageIds = newImages.map(() => uuidv4());
      await db.insert(images).values(
        newImages.map((img: any, index: number) => ({
          id: imageIds[index],
          url: img.url,
          alt: img.alt || updatedProperty.title,
          isMain: img.isMain || index === 0,
          order: index,
          entityType: 'property' as const,
          entityId: propertyId,
          createdAt: new Date(),
        }))
      );
    }
    
    // Fetch complete updated property with relations
    const [completeProperty] = await db
      .select({
        property: properties,
        agent: agents,
      })
      .from(properties)
      .leftJoin(agents, eq(properties.agentId, agents.id))
      .where(eq(properties.id, propertyId));
    
    const propertyImages = await db
      .select()
      .from(images)
      .where(
        and(
          eq(images.entityType, 'property'),
          eq(images.entityId, propertyId)
        )
      )
      .orderBy(images.order);
    
    return NextResponse.json({
      message: 'Property updated successfully',
      data: {
        ...completeProperty.property,
        features: completeProperty.property.features ? JSON.parse(completeProperty.property.features) : [],
        amenities: completeProperty.property.amenities ? JSON.parse(completeProperty.property.amenities) : [],
        agent: completeProperty.agent,
        images: propertyImages,
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Failed to update property', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}