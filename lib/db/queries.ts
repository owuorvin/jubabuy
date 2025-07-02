import { db, properties, cars, images, agents } from '@/lib/db';
import { eq, and, desc, sql } from 'drizzle-orm';

export async function getFeaturedProperties(limit = 6) {
  const results = await db
    .select({
      property: properties,
      agent: agents,
    })
    .from(properties)
    .leftJoin(agents, eq(properties.agentId, agents.id))
    .where(
      and(
        eq(properties.status, 'active'),
        eq(properties.featured, true)
      )
    )
    .orderBy(desc(properties.createdAt))
    .limit(limit);

  // Get images
  const propertyIds = results.map(r => r.property.id);
  const propertyImages = await getImagesForEntities('property', propertyIds);

  return results.map(({ property, agent }) => ({
    ...property,
    features: property.features ? JSON.parse(property.features) : [],
    amenities: property.amenities ? JSON.parse(property.amenities) : [],
    agent,
    images: propertyImages[property.id] || [],
  }));
}

export async function getFeaturedCars(limit = 6) {
  const results = await db
    .select({
      car: cars,
      agent: agents,
    })
    .from(cars)
    .leftJoin(agents, eq(cars.agentId, agents.id))
    .where(
      and(
        eq(cars.status, 'active'),
        eq(cars.featured, true)
      )
    )
    .orderBy(desc(cars.createdAt))
    .limit(limit);

  const carIds = results.map(r => r.car.id);
  const carImages = await getImagesForEntities('car', carIds);

  return results.map(({ car, agent }) => ({
    ...car,
    features: car.features ? JSON.parse(car.features) : [],
    agent,
    images: carImages[car.id] || [],
  }));
}

async function getImagesForEntities(
  entityType: 'property' | 'car',
  entityIds: string[]
) {
  if (entityIds.length === 0) return {};

  const allImages = await db
    .select()
    .from(images)
    .where(
      and(
        eq(images.entityType, entityType),
        sql`${images.entityId} IN ${entityIds}`
      )
    )
    .orderBy(images.order);

  return allImages.reduce((acc, img) => {
    if (!acc[img.entityId]) acc[img.entityId] = [];
    acc[img.entityId].push(img);
    return acc;
  }, {} as Record<string, typeof allImages>);
}

export async function getPropertyBySlug(slug: string) {
  const [result] = await db
    .select({
      property: properties,
      agent: agents,
    })
    .from(properties)
    .leftJoin(agents, eq(properties.agentId, agents.id))
    .where(eq(properties.slug, slug));

  if (!result) return null;

  const propertyImages = await db
    .select()
    .from(images)
    .where(
      and(
        eq(images.entityType, 'property'),
        eq(images.entityId, result.property.id)
      )
    )
    .orderBy(images.order);

  return {
    ...result.property,
    features: result.property.features ? JSON.parse(result.property.features) : [],
    amenities: result.property.amenities ? JSON.parse(result.property.amenities) : [],
    agent: result.agent,
    images: propertyImages,
  };
}

export async function getStats() {
  const [propertyCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(properties)
    .where(eq(properties.status, 'active'));

  const [carCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(cars)
    .where(eq(cars.status, 'active'));

  const [landCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(land)
    .where(eq(land.status, 'active'));

  const [rentalCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(properties)
    .where(
      and(
        eq(properties.status, 'active'),
        eq(properties.category, 'rent')
      )
    );

  const [totalViews] = await db
    .select({ 
      views: sql<number>`
        (SELECT COALESCE(SUM(views), 0) FROM properties) + 
        (SELECT COALESCE(SUM(views), 0) FROM cars) +
        (SELECT COALESCE(SUM(views), 0) FROM land)
      ` 
    })
    .from(properties)
    .limit(1);

  // Calculate total revenue from sold items
  const [propertyRevenue] = await db
    .select({ total: sql<number>`COALESCE(SUM(price), 0)` })
    .from(properties)
    .where(eq(properties.status, 'sold'));

  const [carRevenue] = await db
    .select({ total: sql<number>`COALESCE(SUM(price), 0)` })
    .from(cars)
    .where(eq(cars.status, 'sold'));

  return {
    properties: propertyCount.count,
    cars: carCount.count,
    land: landCount.count,
    rentals: rentalCount.count,
    totalViews: totalViews.views,
    activeListings: propertyCount.count + carCount.count + landCount.count,
    totalRevenue: (propertyRevenue.total || 0) + (carRevenue.total || 0),
    newUsers: Math.floor(Math.random() * 100), // Mock - implement user tracking
    conversionRate: 3.5, // Mock - calculate from actual data
  };
}

export async function getRecentListings(limit = 10) {
  // Get recent properties
  const recentProperties = await db
    .select({
      id: properties.id,
      title: properties.title,
      price: properties.price,
      location: properties.location,
      status: properties.status,
      views: properties.views,
      createdAt: properties.createdAt,
      type: sql<string>`'property'`,
    })
    .from(properties)
    .orderBy(desc(properties.createdAt))
    .limit(Math.floor(limit / 2));

  // Get recent cars
  const recentCars = await db
    .select({
      id: cars.id,
      title: cars.title,
      price: cars.price,
      location: sql<string>`${cars.make} || ' ' || ${cars.model}`,
      status: cars.status,
      views: cars.views,
      createdAt: cars.createdAt,
      type: sql<string>`'car'`,
    })
    .from(cars)
    .orderBy(desc(cars.createdAt))
    .limit(Math.floor(limit / 2));

  // Combine and sort by date
  const combined = [...recentProperties, ...recentCars]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  // Get images for each listing
  const listingIds = combined.map(item => item.id);
  const allImages = await db
    .select()
    .from(images)
    .where(
      and(
        sql`${images.entityId} IN ${listingIds}`,
        sql`${images.isMain} = true`
      )
    );

  // Map images to listings
  const imageMap = allImages.reduce((acc, img) => {
    acc[img.entityId] = img.url;
    return acc;
  }, {} as Record<string, string>);

  return combined.map(item => ({
    ...item,
    images: [imageMap[item.id] || '/images/placeholder.jpg'],
  }));
}

