// components/pages/DetailsPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Share2, Heart, Phone, MessageCircle, 
  MapPin, Calendar, Eye, ChevronLeft, ChevronRight,
  Copy, Check, Car, Fuel, Settings, Users, AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { formatPrice } from '@/lib/utils';
import { apiClient } from '@/lib/api/client';

interface DetailsPageProps {
  itemId: string;
  type: 'property' | 'car' | 'land';
}

export default function DetailsPage({ itemId, type }: DetailsPageProps) {
  const router = useRouter();
  const { state, actions } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<any>(null);
  
  useEffect(() => {
    fetchItemDetails();
  }, [itemId, type]);

  const fetchItemDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (type === 'car') {
        response = await apiClient.getCar(itemId);
      } else if (type === 'land') {
        response = await apiClient.getLandById(itemId);
      } else {
        response = await apiClient.getProperty(itemId);
      }

      if (response.data) {
        setItem(response.data);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      console.error('Failed to fetch item details:', err);
      setError('Failed to load details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const isFavorite = state.favorites.includes(itemId);
  const images = item?.images || [];
  
  const handleShare = async (method: 'copy' | 'whatsapp') => {
    const url = `${window.location.origin}/details/${itemId}`;
    
    if (method === 'copy') {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      const text = `Check out this ${item?.title} on JUBABUY: ${url}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };
  
  const handleContact = (method: 'call' | 'whatsapp') => {
    const phone = '+211981779330';
    
    if (method === 'call') {
      window.location.href = `tel:+${phone}`;
    } else {
      const message = `Hi, I'm interested in ${item?.title} (ID: ${itemId})`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Item not found'}
          </h1>
          <p className="text-gray-600 mb-6">
            The listing you're looking for might have been removed or doesn't exist.
          </p>
          <button 
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-20 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to listings
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => actions.toggleFavorite(itemId)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => handleShare('copy')}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5 text-gray-600" />}
                </button>
                {copied && (
                  <div className="absolute top-full right-0 mt-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg">
                    Link copied!
                  </div>
                )}
              </div>
              
              <button
                onClick={() => handleShare('whatsapp')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="relative h-96 lg:h-[500px]">
                <img 
                  src={images[currentImageIndex]?.url || '/images/placeholder.jpg'}
                  alt={images[currentImageIndex]?.alt || item.title}
                  className="w-full h-full object-cover"
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {images.map((_: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="p-4 grid grid-cols-4 md:grid-cols-6 gap-2">
                  {images.map((img: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden ${
                        index === currentImageIndex ? 'ring-2 ring-blue-600' : ''
                      }`}
                    >
                      <img 
                        src={img.url}
                        alt={img.alt || `${item.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h1>
              
              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{item.location || 'Juba, South Sudan'}</span>
              </div>
              
              {/* Property Specific Details */}
              {type === 'property' && 'bedrooms' in item && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="font-semibold">{item.bedrooms}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="font-semibold">{item.bathrooms}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Area</p>
                    <p className="font-semibold">{item.area} sqm</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Furnished</p>
                    <p className="font-semibold">{item.furnished ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              )}

              {/* Car Specific Details */}
              {type === 'car' && 'make' in item && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Car className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Make & Model</p>
                    <p className="font-semibold">{item.make} {item.model}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Calendar className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-semibold">{item.year}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Settings className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Mileage</p>
                    <p className="font-semibold">{item.mileage?.toLocaleString()} km</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Fuel className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="font-semibold">{item.fuel}</p>
                  </div>
                </div>
              )}

              {/* Land Specific Details */}
              {type === 'land' && 'area' in item && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Area</p>
                    <p className="font-semibold">{item.area} {item.unit}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Zoning</p>
                    <p className="font-semibold">{item.zoning}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{item.location}</p>
                  </div>
                </div>
              )}
              
              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {item.description || `This ${item.title} is available for immediate purchase. Contact us for more details and to schedule a viewing.`}
                </p>
              </div>
              
              {/* Features */}
              {item.features && item.features.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Features</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {item.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center text-gray-600">
                        <Check className="w-5 h-5 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities (for properties) */}
              {item.amenities && item.amenities.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {item.amenities.map((amenity: string, index: number) => (
                      <div key={index} className="flex items-center text-gray-600">
                        <Check className="w-5 h-5 text-blue-500 mr-2" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 sticky top-32">
              <div className="mb-6">
                <p className="text-gray-500 text-sm mb-1">Price</p>
                <p className="text-4xl font-bold text-gray-900">{formatPrice(item.price)}</p>
              </div>
              
              {/* Contact Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowPhoneNumber(!showPhoneNumber)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {showPhoneNumber ? '+211 981 779 330' : 'Show Phone Number'}
                </button>
                
                <button
                  onClick={() => handleContact('whatsapp')}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </button>
                
                <button
                  onClick={() => handleContact('call')}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </button>
              </div>
              
              {/* Agent Info */}
              {item.agent && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-500 mb-2">Listed by</p>
                  <div className="flex items-center">
                    <img 
                      src={item.agent.avatar || `https://ui-avatars.com/api/?name=${item.agent.name}&background=e5e7eb&color=374151&bold=true`}
                      alt={item.agent.name}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold">{item.agent.name}</p>
                      <p className="text-sm text-gray-500">Verified Agent</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Stats */}
              <div className="mt-6 pt-6 border-t flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {item.views || 0} views
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Listed {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}