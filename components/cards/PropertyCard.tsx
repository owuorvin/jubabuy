'use client';

import { Heart, MapPin, Bed, Bath, Square, Camera, Car, Fuel, Calendar, Trees } from 'lucide-react';
import { Land, Car as CarType, Property } from '@/lib/db/schema';
import { useFavorites } from '@/hooks/use-favorites';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { getListingDetailUrl, getItemType } from '@/lib/utils/routing';

interface PropertyCardProps {
  property: Property | CarType | Land | any; // Make it more flexible
  type?: 'property' | 'car' | 'land';
  viewMode?: 'grid' | 'list';
}

export default function PropertyCard({ property, type, viewMode = 'grid' }: PropertyCardProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Handle different image formats
  const getMainImageUrl = () => {
    // Case 1: Direct mainImage property (from featured endpoint)
    if (property.mainImage) {
      return property.mainImage;
    }
    
    // Case 2: Images array
    if (property.images && property.images.length > 0) {
      const mainImg = property.images.find((img: any) => img.isMain) || property.images[0];
      return mainImg?.url || mainImg; // Handle both object with url and direct url string
    }
    
    // Default placeholder
    return '/images/placeholder.jpg';
  };
  
  const mainImageUrl = getMainImageUrl();
  const imageCount = property.images?.length || (property.mainImage ? 1 : 0);
  
  // Determine the actual type
  const actualType = type || getItemType(property);

  const handleClick = () => {
    // Use the routing utility to get the correct URL
    const detailUrl = getListingDetailUrl(property, actualType);
    router.push(detailUrl);
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(actualType, property.id);
  };

  // Determine the status label based on type
  const getStatusLabel = () => {
    if (actualType === 'car') {
      return property.status === 'active' ? 'Available' : 'Sold';
    } else if (actualType === 'land') {
      return property.status === 'active' ? 'For Sale' : 'Sold';
    }
    return property.status === 'active' ? 'Available' : 
           property.status === 'sold' ? 'Sold' : 'Rented';
  };

  // Get the type badge label
  const getTypeBadge = () => {
    switch (actualType) {
      case 'car':
        return 'Vehicle';
      case 'land':
        return 'Land';
      default:
        return property.category === 'rent' ? 'For Rent' : 
               property.category === 'sale' ? 'For Sale' : 'Short Stay';
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
    >
      <div className="relative overflow-hidden h-64">
        <img 
          src={mainImageUrl} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
          }}
        />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {/* Type badge */}
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
            {getTypeBadge()}
          </span>
          
          {/* Status badge - Only show if not active */}
          {property.status !== 'active' && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              property.status === 'sold' ? 'bg-red-500 text-white' :
              'bg-yellow-500 text-white'
            }`}>
              {getStatusLabel()}
            </span>
          )}
        </div>

        <div className="absolute top-4 right-4">
          <button 
            onClick={handleFavorite}
            className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:shadow-lg transition-all hover:bg-white"
          >
            <Heart className={`w-5 h-5 ${
              isFavorite(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-700'
            }`} />
          </button>
        </div>

        {imageCount > 0 && (
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm flex items-center">
            <Camera className="w-4 h-4 mr-1.5" />
            {imageCount} {imageCount === 1 ? 'Photo' : 'Photos'}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-3">
          <p className="text-3xl font-bold text-gray-900">
            {formatPrice(property.price)}
          </p>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
          {property.title}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
          <span className="text-sm">{property.location}</span>
        </div>

        {/* Property-specific details */}
        {actualType === 'property' && property.bedrooms && (
          <div className="grid grid-cols-3 gap-3 py-4 border-y border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-400 mb-1">
                <Bed className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{property.bedrooms}</p>
              <p className="text-xs text-gray-500">Bedrooms</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-400 mb-1">
                <Bath className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{property.bathrooms}</p>
              <p className="text-xs text-gray-500">Bathrooms</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-400 mb-1">
                <Square className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{property.area}</p>
              <p className="text-xs text-gray-500">Sqm</p>
            </div>
          </div>
        )}

        {/* Car-specific details */}
        {actualType === 'car' && (
          <div className="grid grid-cols-3 gap-3 py-4 border-y border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-400 mb-1">
                <Calendar className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{property.year}</p>
              <p className="text-xs text-gray-500">Year</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-400 mb-1">
                <Car className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{property.mileage?.toLocaleString()}</p>
              <p className="text-xs text-gray-500">km</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-400 mb-1">
                <Fuel className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{property.fuel || 'Petrol'}</p>
              <p className="text-xs text-gray-500">Fuel</p>
            </div>
          </div>
        )}

        {/* Land-specific details */}
        {actualType === 'land' && (
          <div className="grid grid-cols-2 gap-3 py-4 border-y border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-400 mb-1">
                <Trees className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{property.area}</p>
              <p className="text-xs text-gray-500">{property.unit || 'sqm'}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-400 mb-1">
                <Square className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{property.zoning || 'Mixed'}</p>
              <p className="text-xs text-gray-500">Zoning</p>
            </div>
          </div>
        )}

        {property.agent && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <img 
                src={property.agent.avatar || `https://ui-avatars.com/api/?name=${property.agent.name}&background=e5e7eb&color=374151&bold=true`}
                alt={property.agent.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">{property.agent.name}</p>
                <p className="text-xs text-gray-500">Verified Agent</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}