// app/api/inquiries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, inquiries } from '@/lib/db';
import { eq, desc, and, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'edge';

// Schema for creating inquiries
const createInquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  message: z.string().optional(),
  subject: z.string().optional(), // For general inquiries
  entityType: z.enum(['property', 'car', 'land', 'general']).optional(),
  entityId: z.string().optional(),
});

// GET - Fetch inquiries (admin)
export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    
    const page = parseInt(searchParams.page || '1');
    const limit = parseInt(searchParams.limit || '20');
    const status = searchParams.status || 'all';
    const entityType = searchParams.entityType;
    
    const conditions = [];
    
    if (status && status !== 'all') {
      conditions.push(eq(inquiries.status, status));
    }
    
    if (entityType) {
      conditions.push(eq(inquiries.entityType, entityType));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(inquiries)
      .where(whereClause);
    
    // Get inquiries
    const offset = (page - 1) * limit;
    const results = await db
      .select()
      .from(inquiries)
      .where(whereClause)
      .orderBy(desc(inquiries.createdAt))
      .limit(limit)
      .offset(offset);
    
    return NextResponse.json({
      data: {
        items: results,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit),
        },
      }
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

// POST - Create new inquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createInquirySchema.parse(body);
    
    // Handle general inquiries (from contact page)
    const entityType = data.entityType || 'general';
    const entityId = data.entityId || 'contact-form';
    
    // Combine subject into message for general inquiries
    let fullMessage = data.message || '';
    if (data.subject && entityType === 'general') {
      fullMessage = `Subject: ${data.subject}\n\n${fullMessage}`;
    }
    
    const inquiryId = uuidv4();
    
    const [inquiry] = await db.insert(inquiries).values({
      id: inquiryId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: fullMessage,
      entityType,
      entityId,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    
    // Send notification email if configured
    // You can add email notification logic here
    
    return NextResponse.json({
      data: inquiry,
      success: true,
      inquiryId: inquiry.id,
    }, { status: 201 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to create inquiry' },
      { status: 500 }
    );
  }
}