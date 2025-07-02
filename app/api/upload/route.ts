// app/api/upload/route.ts
// Simple upload route that stores images as base64 (for development)
// In production, you should use Vercel Blob Storage or another cloud storage solution

import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export const runtime = 'edge';

// Max file size: 5MB (Edge Runtime has limits)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`File ${file.name} is too large. Max size is 5MB`);
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} is not an image`);
        }

        // Convert to base64
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;

        return {
          url: dataUrl,
          filename: `${nanoid()}-${file.name}`,
          size: file.size,
          type: file.type,
        };
      })
    );

    return NextResponse.json({ files: uploadedFiles });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}

// Alternative: Store images temporarily and return URLs
// This is a more production-ready approach but requires server-side storage

/*
// app/api/upload/route.ts (Production version with Vercel Blob)
import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      const filename = `${nanoid()}-${file.name}`;
      const blob = await put(filename, file, {
        access: 'public',
        addRandomSuffix: false,
      });
      
      return {
        url: blob.url,
        filename: blob.pathname,
        size: file.size,
      };
    });

    const uploaded = await Promise.all(uploadPromises);

    return NextResponse.json({ files: uploaded });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
*/