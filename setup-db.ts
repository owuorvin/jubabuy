import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function setupDatabase() {
  console.log('Creating tables...');
  
  // Create agents table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      avatar TEXT,
      created_at INTEGER,
      updated_at INTEGER
    )
  `);
  
  // Create properties table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      price INTEGER NOT NULL,
      location TEXT NOT NULL,
      category TEXT NOT NULL,
      property_type TEXT,
      bedrooms INTEGER,
      bathrooms INTEGER,
      area INTEGER,
      furnished INTEGER DEFAULT 0,
      description TEXT,
      features TEXT,
      amenities TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      featured INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      agent_id TEXT NOT NULL REFERENCES agents(id),
      created_at INTEGER,
      updated_at INTEGER
    )
  `);
  
  // Create indexes
  await client.execute(`CREATE INDEX IF NOT EXISTS location_idx ON properties(location)`);
  await client.execute(`CREATE INDEX IF NOT EXISTS price_idx ON properties(price)`);
  await client.execute(`CREATE INDEX IF NOT EXISTS category_idx ON properties(category)`);
  await client.execute(`CREATE INDEX IF NOT EXISTS status_idx ON properties(status)`);
  
  // Create cars table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS cars (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      price INTEGER NOT NULL,
      year INTEGER NOT NULL,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      mileage INTEGER NOT NULL,
      fuel TEXT NOT NULL,
      transmission TEXT NOT NULL,
      condition TEXT NOT NULL,
      color TEXT,
      engine_size TEXT,
      description TEXT,
      features TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      featured INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      agent_id TEXT NOT NULL REFERENCES agents(id),
      created_at INTEGER,
      updated_at INTEGER
    )
  `);
  
  // Create images table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS images (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      alt TEXT,
      is_main INTEGER DEFAULT 0,
      "order" INTEGER DEFAULT 0,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      created_at INTEGER
    )
  `);
  
  // Create favorites table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      created_at INTEGER
    )
  `);
  
  // Create inquiries table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      message TEXT,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      created_at INTEGER,
      updated_at INTEGER
    )
  `);
  
  console.log('✅ All tables created successfully!');
}

setupDatabase().catch(console.error);