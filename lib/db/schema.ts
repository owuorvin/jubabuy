// lib/db/schema.ts
import { 
    sqliteTable, 
    text, 
    integer, 
    real,
    blob,
    primaryKey,
    index
  } from 'drizzle-orm/sqlite-core';
  import { sql } from 'drizzle-orm';
  import { randomUUID } from 'crypto';
  
  // Agents table
  export const agents = sqliteTable('agents', {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    phone: text('phone').notNull(),
    avatar: text('avatar'),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  });
  
  // Properties table
  export const properties = sqliteTable('properties', {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    price: integer('price').notNull(),
    location: text('location').notNull(),
    category: text('category').notNull(), // 'sale', 'rent', 'short-stay'
    propertyType: text('property_type'), // 'house', 'apartment', 'villa', 'land'
    
    // Property details
    bedrooms: integer('bedrooms'),
    bathrooms: integer('bathrooms'),
    area: integer('area'),
    furnished: integer('furnished', { mode: 'boolean' }).default(false),
    
    // Content
    description: text('description'),
    features: text('features'), // JSON array
    amenities: text('amenities'), // JSON array
    
    // Status
    status: text('status').notNull().default('active'), // 'active', 'pending', 'sold', 'rented'
    featured: integer('featured', { mode: 'boolean' }).default(false),
    views: integer('views').default(0),
    
    // Relations
    agentId: text('agent_id').notNull().references(() => agents.id),
    
    // Timestamps
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  }, (table) => ({
    locationIdx: index('location_idx').on(table.location),
    priceIdx: index('price_idx').on(table.price),
    categoryIdx: index('category_idx').on(table.category),
    statusIdx: index('status_idx').on(table.status),
  }));
  
  // Cars table
  export const cars = sqliteTable('cars', {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    price: integer('price').notNull(),
    
    // Car details
    year: integer('year').notNull(),
    make: text('make').notNull(),
    model: text('model').notNull(),
    mileage: integer('mileage').notNull(),
    fuel: text('fuel').notNull(), // 'Petrol', 'Diesel', 'Hybrid', 'Electric'
    transmission: text('transmission').notNull(), // 'Manual', 'Automatic'
    condition: text('condition').notNull(), // 'New', 'Used'
    color: text('color'),
    engineSize: text('engine_size'),
    
    // Content
    description: text('description'),
    features: text('features'), // JSON array
    
    // Status
    status: text('status').notNull().default('active'),
    featured: integer('featured', { mode: 'boolean' }).default(false),
    views: integer('views').default(0),
    
    // Relations
    agentId: text('agent_id').notNull().references(() => agents.id),
    
    // Timestamps
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  }, (table) => ({
    makeIdx: index('make_idx').on(table.make),
    modelIdx: index('model_idx').on(table.model),
    priceIdx: index('car_price_idx').on(table.price),
    yearIdx: index('year_idx').on(table.year),
  }));
  
  // Images table
  export const images = sqliteTable('images', {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    url: text('url').notNull(),
    alt: text('alt'),
    isMain: integer('is_main', { mode: 'boolean' }).default(false),
    order: integer('order').default(0),
    
    // Polymorphic relations
    entityType: text('entity_type').notNull(), // 'property', 'car'
    entityId: text('entity_id').notNull(),
    
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  }, (table) => ({
    entityIdx: index('entity_idx').on(table.entityType, table.entityId),
  }));
  
  // Favorites table
  export const favorites = sqliteTable('favorites', {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    userId: text('user_id').notNull(),
    entityType: text('entity_type').notNull(), // 'property', 'car'
    entityId: text('entity_id').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  }, (table) => ({
    userIdx: index('user_idx').on(table.userId),
    entityIdx: index('fav_entity_idx').on(table.entityType, table.entityId),
  }));
  
  // Inquiries table
  export const inquiries = sqliteTable('inquiries', {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    message: text('message'),
    
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    
    status: text('status').notNull().default('new'), // 'new', 'contacted', 'closed'
    
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  });

  export const land = sqliteTable('land', {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    price: integer('price').notNull(),
    location: text('location').notNull(),
    
    // Land details
    area: integer('area').notNull(),
    unit: text('unit').notNull(), // 'sqm', 'acres', 'hectares'
    zoning: text('zoning').notNull(), // 'Residential', 'Commercial', 'Mixed', 'Agricultural'
    
    // Content
    description: text('description'),
    features: text('features'), // JSON array
    
    // Status
    status: text('status').notNull().default('active'),
    featured: integer('featured', { mode: 'boolean' }).default(false),
    views: integer('views').default(0),
    
    // Relations
    agentId: text('agent_id').notNull().references(() => agents.id),
    
    // Timestamps
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  }, (table) => ({
    locationIdx: index('land_location_idx').on(table.location),
    priceIdx: index('land_price_idx').on(table.price),
  }));
  
  // Type exports
  export type Agent = typeof agents.$inferSelect;
  export type NewAgent = typeof agents.$inferInsert;
  export type Property = typeof properties.$inferSelect;
  export type NewProperty = typeof properties.$inferInsert;
  export type Car = typeof cars.$inferSelect;
  export type NewCar = typeof cars.$inferInsert;
  export type Image = typeof images.$inferSelect;
  export type NewImage = typeof images.$inferInsert;
  export type Land = typeof land.$inferSelect;
  export type NewLand = typeof land.$inferInsert;