// app/api/admin/listings/approve/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, properties, cars, land } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const runtime = 'edge';

// Validation schema
const approvalSchema = z.object({
  listingId: z.string(),
  listingType: z.enum(['property', 'car', 'land']),
  action: z.enum(['approve', 'reject']),
  reason: z.string().optional(),
  displayContact: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = approvalSchema.parse(body);
    
    let result;
    
    if (data.action === 'approve') {
      // Update listing status to active
      const updateData = {
        status: 'active',
        updatedAt: new Date(),
      };
      
      if (data.listingType === 'property') {
        [result] = await db
          .update(properties)
          .set(updateData)
          .where(eq(properties.id, data.listingId))
          .returning();
      } else if (data.listingType === 'car') {
        [result] = await db
          .update(cars)
          .set(updateData)
          .where(eq(cars.id, data.listingId))
          .returning();
      } else if (data.listingType === 'land') {
        [result] = await db
          .update(land)
          .set(updateData)
          .where(eq(land.id, data.listingId))
          .returning();
      }
      
      // Send approval notification
      await sendApprovalNotification(data.listingId, data.listingType, result);
      
    } else if (data.action === 'reject') {
      // Update listing status to rejected
      const updateData = {
        status: 'rejected',
        updatedAt: new Date(),
      };
      
      if (data.listingType === 'property') {
        [result] = await db
          .update(properties)
          .set(updateData)
          .where(eq(properties.id, data.listingId))
          .returning();
      } else if (data.listingType === 'car') {
        [result] = await db
          .update(cars)
          .set(updateData)
          .where(eq(cars.id, data.listingId))
          .returning();
      } else if (data.listingType === 'land') {
        [result] = await db
          .update(land)
          .set(updateData)
          .where(eq(land.id, data.listingId))
          .returning();
      }
      
      // Send rejection notification
      await sendRejectionNotification(data.listingId, data.listingType, result, data.reason);
    }

    return NextResponse.json({
      success: true,
      listing: result,
    });
  } catch (error) {
    console.error('Approval error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid approval data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to process approval' },
      { status: 500 }
    );
  }
}

// Get pending listings for approval
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'pending';
    const type = searchParams.get('type') || 'all';
    
    const results: any = {
      properties: [],
      cars: [],
      land: [],
    };
    
    // Fetch pending listings
    if (type === 'all' || type === 'property') {
      results.properties = await db
        .select()
        .from(properties)
        .where(eq(properties.status, status))
        .orderBy(properties.createdAt);
    }
    
    if (type === 'all' || type === 'car') {
      results.cars = await db
        .select()
        .from(cars)
        .where(eq(cars.status, status))
        .orderBy(cars.createdAt);
    }
    
    if (type === 'all' || type === 'land') {
      results.land = await db
        .select()
        .from(land)
        .where(eq(land.status, status))
        .orderBy(land.createdAt);
    }
    
    // Combine all listings with type information
    const allListings = [
      ...results.properties.map((p: any) => ({ ...p, type: 'property' })),
      ...results.cars.map((c: any) => ({ ...c, type: 'car' })),
      ...results.land.map((l: any) => ({ ...l, type: 'land' })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json({
      listings: allListings,
      counts: {
        properties: results.properties.length,
        cars: results.cars.length,
        land: results.land.length,
        total: allListings.length,
      },
    });
  } catch (error) {
    console.error('Error fetching pending listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending listings' },
      { status: 500 }
    );
  }
}

// Helper functions for notifications
async function sendApprovalNotification(listingId: string, type: string, listing: any) {
  // Send email notification to the listing owner
  const notificationData = {
    type: 'listing_approved',
    listingType: type,
    data: {
      title: listing.title,
      price: listing.price,
      location: listing.location || '',
      submitterName: listing.contactName || 'User',
      submitterEmail: listing.contactEmail || 'user@example.com',
      submitterPhone: listing.contactPhone || '',
      listingId,
    },
  };
  
  try {
    await fetch('/api/notifications/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationData),
    });
  } catch (error) {
    console.error('Failed to send approval notification:', error);
  }
}

async function sendRejectionNotification(listingId: string, type: string, listing: any, reason?: string) {
  // Send email notification to the listing owner
  const notificationData = {
    type: 'listing_rejected',
    listingType: type,
    data: {
      title: listing.title,
      price: listing.price,
      location: listing.location || '',
      submitterName: listing.contactName || 'User',
      submitterEmail: listing.contactEmail || 'user@example.com',
      submitterPhone: listing.contactPhone || '',
      listingId,
      reason,
    },
  };
  
  try {
    await fetch('/api/notifications/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationData),
    });
  } catch (error) {
    console.error('Failed to send rejection notification:', error);
  }
}

// Bulk approval endpoint
export async function PUT(this: any, request: NextRequest) {
  try {
    // Check admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { listingIds, listingType, action } = body;
    
    if (!Array.isArray(listingIds) || listingIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid listing IDs' },
        { status: 400 }
      );
    }
    
    let updatedCount = 0;
    
    for (const listingId of listingIds) {
      try {
        await this.POST(new NextRequest(request.url, {
          method: 'POST',
          headers: request.headers,
          body: JSON.stringify({
            listingId,
            listingType,
            action,
          }),
        }));
        updatedCount++;
      } catch (error) {
        console.error(`Failed to process listing ${listingId}:`, error);
      }
    }
    
    return NextResponse.json({
      success: true,
      processed: updatedCount,
      total: listingIds.length,
    });
  } catch (error) {
    console.error('Bulk approval error:', error);
    return NextResponse.json(
      { error: 'Failed to process bulk approval' },
      { status: 500 }
    );
  }
}