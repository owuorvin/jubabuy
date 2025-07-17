import { Property, Car, Land } from './types';
import { JUBA_AREAS } from './constants';

// Real Subaru car data based on your images
const SUBARU_LISTINGS = [
  {
    title: 'Subaru Forester Sport',
    price: 3000,
    year: 2006,
    make: 'Subaru',
    model: 'Forester',
    mileage: 120000,
    fuel: 'Petrol' as const,
    transmission: 'Automatic' as const,
    condition: 'Used' as const,
    images: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800', // Placeholder - replace with actual images
      'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800'
    ],
    licensePlate: 'SSD 761 BT',
    color: 'White',
    features: ['Sport Package', 'Alloy Wheels', 'Fog Lights']
  },
  {
    title: 'Subaru Legacy Sport',
    price: 3000,
    year: 2008,
    make: 'Subaru',
    model: 'Legacy',
    mileage: 95000,
    fuel: 'Petrol' as const,
    transmission: 'Automatic' as const,
    condition: 'Used' as const,
    images: [
      'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=800'
    ],
    licensePlate: 'SSD 098 CB',
    color: 'White',
    interiorColor: 'Red/Black',
    features: ['Sport Interior', 'Custom Wheels', 'Side Decals']
  },
  {
    title: 'Subaru Legacy',
    price: 3000,
    year: 2010,
    make: 'Subaru',
    model: 'Legacy',
    mileage: 110000,
    fuel: 'Petrol' as const,
    transmission: 'Automatic' as const,
    condition: 'Used' as const,
    images: [
      'https://images.unsplash.com/photo-1606611013016-969c19ba1be0?w=800'
    ],
    licensePlate: 'SSD 710 BK',
    color: 'Silver',
    features: ['Alloy Wheels', 'Leather Seats']
  }
];

export function generateMockData(type: string, count: number): any[] {
  const data = [];
  
  // Add real Subaru data for cars
  if (type === 'cars') {
    SUBARU_LISTINGS.forEach((subaru, index) => {
      data.push({
        id: `car-subaru-${index}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active' as const,
        featured: index < 2,
        views: Math.floor(Math.random() * 500) + 100,
        agent: {
          id: 'agent-1',
          name: 'Aries Ltd Sales',
          phone: '+211 704 049 044',
          email: 'sales@ariesltd.com'
        },
        ...subaru
      });
    });
    
    // Add remaining mock cars if needed
    for (let i = data.length; i < count; i++) {
      data.push(generateMockItem(type, i));
    }
  } else {
    // Generate other types normally
    for (let i = 0; i < count; i++) {
      data.push(generateMockItem(type, i));
    }
  }
  
  return data;
}


function generateMockItem(type: string, index: number): any {
  const baseItem = {
    id: `${type}-${index}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: ['active', 'pending', 'sold'][Math.floor(Math.random() * 3)] as 'active' | 'pending' | 'sold',
    featured: Math.random() > 0.7,
    views: Math.floor(Math.random() * 1000),
    agent: {
      id: `agent-${Math.floor(Math.random() * 5)}`,
      name: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'][Math.floor(Math.random() * 4)],
      phone: '+211981779330',
      email: 'agent@ariesltd.com'
    }
  };

  switch (type) {
    case 'properties':
    case 'rentals':
    case 'airbnb':
      return {
        ...baseItem,
        title: `Modern ${Math.floor(Math.random() * 4) + 1}BR ${type === 'airbnb' ? 'Apartment' : 'House'}`,
        price: Math.floor(Math.random() * 400000) + 100000,
        location: JUBA_AREAS[Math.floor(Math.random() * JUBA_AREAS.length)],
        bedrooms: Math.floor(Math.random() * 4) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        area: Math.floor(Math.random() * 3000) + 800,
        furnished: Math.random() > 0.5,
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
        ],
        amenities: ['Parking', 'Security', 'Garden', 'Pool'],
        description: 'Beautiful property in prime location with modern amenities.'
      };
    
    case 'cars':
      return {
        ...baseItem,
        title: ['Toyota Land Cruiser', 'Mercedes-Benz GLE', 'BMW X5', 'Honda CR-V'][Math.floor(Math.random() * 4)],
        price: Math.floor(Math.random() * 80000) + 20000,
        year: 2020 + Math.floor(Math.random() * 5),
        make: ['Toyota', 'Mercedes', 'BMW', 'Honda'][Math.floor(Math.random() * 4)],
        model: ['Land Cruiser', 'GLE', 'X5', 'CR-V'][Math.floor(Math.random() * 4)],
        mileage: Math.floor(Math.random() * 50000),
        fuel: ['Petrol', 'Diesel', 'Hybrid'][Math.floor(Math.random() * 3)] as 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric',
        transmission: ['Manual', 'Automatic'][Math.floor(Math.random() * 2)] as 'Manual' | 'Automatic',
        condition: ['New', 'Used'][Math.floor(Math.random() * 2)] as 'New' | 'Used',
        images: [
          'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=800'
        ]
      };
    
    case 'land':
      return {
        ...baseItem,
        title: 'Prime Land for Development',
        price: Math.floor(Math.random() * 200000) + 50000,
        location: JUBA_AREAS[Math.floor(Math.random() * JUBA_AREAS.length)],
        area: Math.floor(Math.random() * 10000) + 1000,
        unit: 'sqm',
        zoning: ['Residential', 'Commercial', 'Mixed'][Math.floor(Math.random() * 3)] as 'Residential' | 'Commercial' | 'Mixed' | 'Agricultural',
        images: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'
        ]
      };
    
    default:
      return baseItem;
  }
}