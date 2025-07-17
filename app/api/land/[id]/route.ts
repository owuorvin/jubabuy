// app/api/land/[id]/route.ts - Updated to handle both ID and slug
import { NextRequest, NextResponse } from 'next/server';
import { db, land, images, agents } from '@/lib/db';
import { eq, and, or } from 'drizzle-orm';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';


export const runtime = 'edge';

// GET handler for single land (by ID or slug)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const identifier = params.id;
    
    // Get land by ID or slug
    const [result] = await db
      .select({
        land: land,
        agent: agents,
      })
      .from(land)
      .leftJoin(agents, eq(land.agentId, agents.id))
      .where(
        or(
          eq(land.id, identifier),
          eq(land.slug, identifier)
        )
      )
      .limit(1);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Land not found' },
        { status: 404 }
      );
    }
    
    // Get images
    const landImages = await db
      .select()
      .from(images)
      .where(
        and(
          eq(images.entityType, 'land'),
          eq(images.entityId, result.land.id)
        )
      )
      .orderBy(images.order);
    
    // Update view count
    await db
      .update(land)
      .set({ views: (result.land.views || 0) + 1 })
      .where(eq(land.id, result.land.id));
    
    return NextResponse.json({
      data: {
        ...result.land,
        features: result.land.features ? JSON.parse(result.land.features) : [],
        agent: result.agent,
        images: landImages,
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

// DELETE handler
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const landId = params.id;
    
    // Check if land exists
    const [existingLand] = await db
      .select()
      .from(land)
      .where(eq(land.id, landId))
      .limit(1);
    
    if (!existingLand) {
      return NextResponse.json(
        { error: 'Land not found' },
        { status: 404 }
      );
    }
    
    // Delete associated images first
    await db
      .delete(images)
      .where(
        and(
          eq(images.entityType, 'land'),
          eq(images.entityId, landId)
        )
      );
    
    // Delete the land
    await db
      .delete(land)
      .where(eq(land.id, landId));
    
    return NextResponse.json({
      message: 'Land deleted successfully',
      data: { id: landId }
    });
  } catch (error) {
    console.error('Error deleting land:', error);
    return NextResponse.json(
      { error: 'Failed to delete land', details: error instanceof Error ? error.message : 'Unknown error' },
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
    const landId = params.id;
    const body = await request.json();
    
    // Simple schema for featured update
    if ('featured' in body && typeof body.featured === 'boolean') {
      const [updatedLand] = await db
        .update(land)
        .set({
          featured: body.featured,
          updatedAt: new Date(),
        })
        .where(eq(land.id, landId))
        .returning();
      
      if (!updatedLand) {
        return NextResponse.json(
          { error: 'Land not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        message: `Land ${body.featured ? 'featured' : 'unfeatured'} successfully`,
        data: updatedLand
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating land:', error);
    return NextResponse.json(
      { error: 'Failed to update land', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Update schema - all fields optional
const updateLandSchema = z.object({
  title: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  location: z.string().min(1).optional(),
  area: z.number().positive().optional(),
  unit: z.enum(['sqm', 'acres', 'hectares']).optional(),
  zoning: z.enum(['Residential', 'Commercial', 'Mixed', 'Agricultural']).optional(),
  description: z.string().optional().nullable(),
  features: z.array(z.string()).optional(),
  status: z.enum(['active', 'pending', 'sold']).optional(),
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
    const landId = params.id;
    const body = await request.json();
    const data = updateLandSchema.parse(body);
    
    // Check if land exists
    const [existingLand] = await db
      .select()
      .from(land)
      .where(eq(land.id, landId))
      .limit(1);
    
    if (!existingLand) {
      return NextResponse.json(
        { error: 'Land not found' },
        { status: 404 }
      );
    }
    
    // Prepare update data
    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    };
    
    // Handle features array
    if (data.features) {
      updateData.features = JSON.stringify(data.features);
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
    const { images: newImages, ...landUpdateData } = updateData;
    
    // Update land
    const [updatedLand] = await db
      .update(land)
      .set(landUpdateData)
      .where(eq(land.id, landId))
      .returning();
    
    // Handle images if provided
    if (newImages && newImages.length > 0) {
      // Delete existing images
      await db
        .delete(images)
        .where(
          and(
            eq(images.entityType, 'land'),
            eq(images.entityId, landId)
          )
        );
      
      // Insert new images
      const imageIds = newImages.map(() => uuidv4());
      await db.insert(images).values(
        newImages.map((img: any, index: number) => ({
          id: imageIds[index],
          url: img.url,
          alt: img.alt || updatedLand.title,
          isMain: img.isMain || index === 0,
          order: index,
          entityType: 'land' as const,
          entityId: landId,
          createdAt: new Date(),
        }))
      );
    }
    
    // Fetch complete updated land with relations
    const [completeLand] = await db
      .select({
        land: land,
        agent: agents,
      })
      .from(land)
      .leftJoin(agents, eq(land.agentId, agents.id))
      .where(eq(land.id, landId));
    
    const landImages = await db
      .select()
      .from(images)
      .where(
        and(
          eq(images.entityType, 'land'),
          eq(images.entityId, landId)
        )
      )
      .orderBy(images.order);
    
    return NextResponse.json({
      message: 'Land updated successfully',
      data: {
        ...completeLand.land,
        features: completeLand.land.features ? JSON.parse(completeLand.land.features) : [],
        agent: completeLand.agent,
        images: landImages,
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating land:', error);
    return NextResponse.json(
      { error: 'Failed to update land', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}