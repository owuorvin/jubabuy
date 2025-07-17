// app/api/inquiries/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, inquiries } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const runtime = 'edge';

const updateStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'closed']),
  notes: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const data = updateStatusSchema.parse(body);
    
    // Update the inquiry status
    const [updated] = await db
      .update(inquiries)
      .set({
        status: data.status,
        notes: data.notes,
        updatedAt: new Date(),
      })
      .where(eq(inquiries.id, params.id))
      .returning();
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updated,
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error updating inquiry status:', error);
    return NextResponse.json(
      { error: 'Failed to update inquiry status' },
      { status: 500 }
    );
  }
}