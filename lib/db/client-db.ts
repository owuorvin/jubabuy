// lib/db/client-db.ts
'use client';

import { createClient } from '@libsql/client/web';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

// Create a client-side safe database connection
export function getClientDb() {
  // Only use read-only token in client
  const client = createClient({
    url: process.env.NEXT_PUBLIC_TURSO_DATABASE_URL!,
    authToken: process.env.NEXT_PUBLIC_TURSO_READ_TOKEN!, // Read-only token
  });

  return drizzle(client, { schema });
}