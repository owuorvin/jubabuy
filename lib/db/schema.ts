// lib/db/schema-updates.ts
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

// Updated schema with contact information and categories

// Use the Web Crypto API which is available in both Node.js and Edge Runtime
const generateId = () => crypto.randomUUID();

// Updated Properties table with contact info
export const properties = sqliteTable('properties', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
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
  
  // Contact information
  contactName: text('contact_name'),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  isPaidListing: integer('is_paid_listing', { mode: 'boolean' }).default(false),
  displayOwnContact: integer('display_own_contact', { mode: 'boolean' }).default(false),
  
  // Status - updated to include more states
  status: text('status').notNull().default('pending'), // 'pending', 'active', 'sold', 'rented', 'rejected'
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

// Updated Cars table with rental category and contact info
export const cars = sqliteTable('cars', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
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
  
  // Category for cars
  category: text('category').notNull().default('sale'), // 'sale', 'rent'
  rentalPeriod: text('rental_period'), // 'daily', 'weekly', 'monthly' for rentals
  
  // Content
  description: text('description'),
  features: text('features'), // JSON array
  
  // Contact information
  contactName: text('contact_name'),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  isPaidListing: integer('is_paid_listing', { mode: 'boolean' }).default(false),
  displayOwnContact: integer('display_own_contact', { mode: 'boolean' }).default(false),
  
  // Status
  status: text('status').notNull().default('pending'), // 'pending', 'active', 'sold', 'rented', 'rejected'
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
  categoryIdx: index('car_category_idx').on(table.category),
}));

// Updated Land table with lease/rent categories and contact info
export const land = sqliteTable('land', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  price: integer('price').notNull(),
  location: text('location').notNull(),
  
  // Land details
  area: integer('area').notNull(),
  unit: text('unit').notNull(), // 'sqm', 'acres', 'hectares'
  zoning: text('zoning').notNull(), // 'Residential', 'Commercial', 'Mixed', 'Agricultural'
  
  // Category for land
  category: text('category').notNull().default('sale'), // 'sale', 'lease', 'rent'
  leasePeriod: text('lease_period'), // 'yearly', '5years', '10years', etc. for leases
  
  // Content
  description: text('description'),
  features: text('features'), // JSON array
  
  // Contact information
  contactName: text('contact_name'),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  isPaidListing: integer('is_paid_listing', { mode: 'boolean' }).default(false),
  displayOwnContact: integer('display_own_contact', { mode: 'boolean' }).default(false),
  
  // Status
  status: text('status').notNull().default('pending'), // 'pending', 'active', 'sold', 'leased', 'rented', 'rejected'
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
  categoryIdx: index('land_category_idx').on(table.category),
}));

// Agents table (unchanged)
export const agents = sqliteTable('agents', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  avatar: text('avatar'),
  isDefault: integer('is_default', { mode: 'boolean' }).default(false), // Mark default admin agents
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Listing approvals tracking table (new)
export const listingApprovals = sqliteTable('listing_approvals', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  listingId: text('listing_id').notNull(),
  listingType: text('listing_type').notNull(), // 'property', 'car', 'land'
  action: text('action').notNull(), // 'approved', 'rejected'
  reason: text('reason'), // Reason for rejection
  approvedBy: text('approved_by'), // Admin user ID
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => ({
  listingIdx: index('approval_listing_idx').on(table.listingId, table.listingType),
}));

// Images table (unchanged)
export const images = sqliteTable('images', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  url: text('url').notNull(),
  alt: text('alt'),
  isMain: integer('is_main', { mode: 'boolean' }).default(false),
  order: integer('order').default(0),
  
  // Polymorphic relations
  entityType: text('entity_type').notNull(), // 'property', 'car', 'land'
  entityId: text('entity_id').notNull(),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => ({
  entityIdx: index('entity_idx').on(table.entityType, table.entityId),
}));

// Favorites table (unchanged)
export const favorites = sqliteTable('favorites', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  userId: text('user_id').notNull(),
  entityType: text('entity_type').notNull(), // 'property', 'car', 'land'
  entityId: text('entity_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => ({
  userIdx: index('user_idx').on(table.userId),
  entityIdx: index('fav_entity_idx').on(table.entityType, table.entityId),
}));

// Inquiries table with additional fields
export const inquiries = sqliteTable('inquiries', {
  id: text('id').primaryKey().$defaultFn(() => generateId()),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  message: text('message'),
  
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  
  status: text('status').notNull().default('new'), // 'new', 'contacted', 'closed'
  notes: text('notes'), // Admin notes
  
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Type exports
export type Agent = typeof agents.$inferSelect;
export type NewAgent = typeof agents.$inferInsert;
export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type Car = typeof cars.$inferSelect;
export type NewCar = typeof cars.$inferInsert;
export type Land = typeof land.$inferSelect;
export type NewLand = typeof land.$inferInsert;
export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
export type ListingApproval = typeof listingApprovals.$inferSelect;
export type NewListingApproval = typeof listingApprovals.$inferInsert;