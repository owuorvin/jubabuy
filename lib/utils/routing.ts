// lib/utils/routing.ts

export type ListingType = 'property' | 'car' | 'land';

interface BaseItem {
  id: string;
  slug: string;
  [key: string]: any;
}

/**
 * Determine the type of listing from the item properties
 */
export function getItemType(item: BaseItem): ListingType {
  // Check for car-specific fields
  if ('make' in item && 'model' in item && 'year' in item) {
    return 'car';
  }
  
  // Check for land-specific fields
  if ('zoning' in item && !('bedrooms' in item)) {
    return 'land';
  }
  
  // Check if ID starts with type prefix (legacy support)
  if (item.id.startsWith('car-')) {
    return 'car';
  }
  
  if (item.id.startsWith('land-')) {
    return 'land';
  }
  
  // Default to property
  return 'property';
}

/**
 * Get the detail page URL for a listing
 */
export function getListingDetailUrl(item: BaseItem, type?: ListingType): string {
  const itemType = type || getItemType(item);
  const slug = item.slug;
  
  switch (itemType) {
    case 'car':
      return `/cars/${slug}`;
    case 'land':
      return `/land/${slug}`;
    case 'property':
    default:
      return `/properties/${slug}`;
  }
}

/**
 * Get the listing page URL for a type
 */
export function getListingPageUrl(type: ListingType): string {
  switch (type) {
    case 'car':
      return '/cars';
    case 'land':
      return '/land';
    case 'property':
    default:
      return '/properties';
  }
}

/**
 * Get the API endpoint for a listing type
 */
export function getListingApiEndpoint(type: ListingType, id?: string): string {
  const base = `/api/${type === 'property' ? 'properties' : type}`;
  return id ? `${base}/${id}` : base;
}