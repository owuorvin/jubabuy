// lib/db/seed.ts
import { db, agents, properties, cars, images } from './index';
import { JUBA_AREAS } from '../constants';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create default agent
  const [agent] = await db.insert(agents).values({
    name: 'JUBABUY LTD Sales Team',
    email: 'sales@jubabuy.com',
    phone: '+211 704 049 044',
  }).returning();

  console.log('✅ Created agent:', agent.name);

  // Sample properties
  const propertyData = [
    {
      title: 'Modern 3BR House in Hai Cinema',
      slug: 'modern-3br-house-hai-cinema',
      price: 150000,
      location: 'HAI CINEMA',
      category: 'sale',
      propertyType: 'house',
      bedrooms: 3,
      bathrooms: 2,
      area: 2500,
      furnished: false,
      description: 'Beautiful modern house in prime location',
      features: JSON.stringify(['Garden', 'Parking', 'Security']),
      amenities: JSON.stringify(['Water Tank', 'Generator', 'Solar Power']),
      agentId: agent.id,
    },
    // Add more sample data...
  ];

  const insertedProperties = await db.insert(properties).values(propertyData).returning();
  console.log(`✅ Created ${insertedProperties.length} properties`);

  // Add images for properties
  for (const property of insertedProperties) {
    await db.insert(images).values([
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        alt: property.title,
        isMain: true,
        order: 0,
        entityType: 'property',
        entityId: property.id,
      },
    ]);
  }

  console.log('✅ Seeding complete!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});