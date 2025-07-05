export interface UnifiedListing {
    id: string;
    title: string;
    price: number;
    location: string;
    images?: any[];
    featured?: boolean;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    views?: number;
    [key: string]: any; // Allow additional properties
  }
  
  // Then update PropertyCard to use this:
  interface PropertyCardProps {
    property: UnifiedListing;
    type?: 'property' | 'car' | 'land';
    viewMode?: 'grid' | 'list';
  }