import { NextRequest, NextResponse } from 'next/server';
import { db, favorites, images, agents } from '@/lib/db';
import { eq, and, gte, lte, like, desc, sql } from 'drizzle-orm';
import { z } from 'zod';

// Use Edge Runtime for better performance
export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
      // Get user ID from session or cookie
      const userId = request.headers.get('x-user-id') || 'anonymous';
      
      const userFavorites = await db
        .select()
        .from(favorites)
        .where(eq(favorites.userId, userId))
        .orderBy(desc(favorites.createdAt));
  
      return NextResponse.json({ favorites: userFavorites });
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch favorites' },
        { status: 500 }
      );
    }
  }
  
  export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      const userId = request.headers.get('x-user-id') || 'anonymous';
      
      const data = z.object({
        entityType: z.enum(['property', 'car']),
        entityId: z.string().uuid(),
      }).parse(body);
      
      // Check if already favorited
      const existing = await db
        .select()
        .from(favorites)
        .where(
          and(
            eq(favorites.userId, userId),
            eq(favorites.entityType, data.entityType),
            eq(favorites.entityId, data.entityId)
          )
        );
  
      if (existing.length > 0) {
        // Remove favorite
        await db
          .delete(favorites)
          .where(eq(favorites.id, existing[0].id));
        
        return NextResponse.json({ favorited: false });
      } else {
        // Add favorite
        await db.insert(favorites).values({
          userId,
          ...data,
        });
        
        return NextResponse.json({ favorited: true });
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to update favorite' },
        { status: 500 }
      );
    }
  }