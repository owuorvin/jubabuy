// components/admin/PendingListings.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle, XCircle, Eye, AlertCircle, 
  Home, Car, MapPin, Phone, Mail, User, DollarSign, X 
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { formatPrice } from '@/lib/utils';

interface PendingListing {
  id: string;
  type: 'property' | 'car' | 'land';
  title: string;
  price: number;
  location?: string;
  status: string;
  createdAt: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  isPaidListing?: boolean;
  displayOwnContact?: boolean;
  images?: any[];
  // Type-specific fields
  category?: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  make?: string;
  model?: string;
  year?: number;
  area?: number;
  unit?: string;
  zoning?: string;
}

export default function PendingListings() {
  const [listings, setListings] = useState<PendingListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<PendingListing | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'property' | 'car' | 'land'>('all');

  useEffect(() => {
    fetchPendingListings();
  }, []);

  const fetchPendingListings = async () => {
    setLoading(true);
    try {
      const [propertiesRes, carsRes, landRes] = await Promise.all([
        apiClient.getProperties({ status: 'pending', limit: 100 }),
        apiClient.getCars({ status: 'pending', limit: 100 }),
        apiClient.getLand({ status: 'pending', limit: 100 })
      ]);
  
      // Combine all pending listings
      const pendingListings: PendingListing[] = [
        ...(propertiesRes.data?.items || []).map(p => ({
          ...p,
          type: 'property' as const,
          createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
        } as PendingListing)),
        ...(carsRes.data?.items || []).map(c => ({
          ...c,
          type: 'car' as const,
          createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
        } as PendingListing)),
        ...(landRes.data?.items || []).map(l => ({
          ...l,
          type: 'land' as const,
          createdAt: l.createdAt ? new Date(l.createdAt).toISOString() : new Date().toISOString(),
        } as PendingListing))
      ];
  
      setListings(pendingListings);
    } catch (error) {
      console.error('Failed to fetch pending listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (listing: PendingListing) => {
    setProcessingId(listing.id);
    try {
      const response = await fetch('/api/admin/listings/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jubabuy_token')}`,
        },
        body: JSON.stringify({
          listingId: listing.id,
          listingType: listing.type,
          action: 'approve',
        }),
      });

      if (response.ok) {
        // Send notification
        await fetch('/api/notifications/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'listing_approved',
            listingType: listing.type,
            data: {
              title: listing.title,
              price: listing.price,
              location: listing.location || '',
              submitterName: listing.contactName || 'User',
              submitterEmail: listing.contactEmail || 'user@example.com',
              submitterPhone: listing.contactPhone || '',
              listingId: listing.id,
            },
          }),
        });

        // Refresh listings
        await fetchPendingListings();
        setSelectedListing(null);
      }
    } catch (error) {
      console.error('Failed to approve listing:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedListing) return;
    
    setProcessingId(selectedListing.id);
    try {
      const response = await fetch('/api/admin/listings/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jubabuy_token')}`,
        },
        body: JSON.stringify({
          listingId: selectedListing.id,
          listingType: selectedListing.type,
          action: 'reject',
          reason: rejectReason,
        }),
      });

      if (response.ok) {
        // Send notification
        await fetch('/api/notifications/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'listing_rejected',
            listingType: selectedListing.type,
            data: {
              title: selectedListing.title,
              price: selectedListing.price,
              location: selectedListing.location || '',
              submitterName: selectedListing.contactName || 'User',
              submitterEmail: selectedListing.contactEmail || 'user@example.com',
              submitterPhone: selectedListing.contactPhone || '',
              listingId: selectedListing.id,
              reason: rejectReason,
            },
          }),
        });

        // Refresh listings
        await fetchPendingListings();
        setSelectedListing(null);
        setShowRejectModal(false);
        setRejectReason('');
      }
    } catch (error) {
      console.error('Failed to reject listing:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'property':
        return <Home className="w-5 h-5" />;
      case 'car':
        return <Car className="w-5 h-5" />;
      case 'land':
        return <MapPin className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'property':
        return 'bg-blue-100 text-blue-600';
      case 'car':
        return 'bg-red-100 text-red-600';
      case 'land':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredListings = filter === 'all' 
    ? listings 
    : listings.filter(l => l.type === filter);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 mb-4">
            <div className="h-6 bg-gray-200 rounded mb-3 w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pending Listings</h2>
          <p className="text-gray-600 mt-1">Review and approve new listings</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex space-x-2">
          {['all', 'property', 'car', 'land'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
              {type === 'all' && ` (${listings.length})`}
              {type !== 'all' && ` (${listings.filter(l => l.type === type).length})`}
            </button>
          ))}
        </div>
      </div>

      {filteredListings.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pending Listings</h3>
          <p className="text-gray-600">All listings have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(listing.type)} mr-3`}>
                        {getTypeIcon(listing.type)}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{listing.title}</h3>
                        <p className="text-sm text-gray-500">
                          Submitted {new Date(listing.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="font-semibold text-gray-900">{formatPrice(listing.price)}</p>
                      </div>
                      {listing.location && (
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-semibold text-gray-900">{listing.location}</p>
                        </div>
                      )}
                      {listing.type === 'property' && (
                        <>
                          <div>
                            <p className="text-sm text-gray-600">Type</p>
                            <p className="font-semibold text-gray-900">
                              {listing.propertyType} - {listing.category}
                            </p>
                          </div>
                          {listing.bedrooms && (
                            <div>
                              <p className="text-sm text-gray-600">Bedrooms/Bathrooms</p>
                              <p className="font-semibold text-gray-900">
                                {listing.bedrooms} / {listing.bathrooms}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                      {listing.type === 'car' && (
                        <>
                          <div>
                            <p className="text-sm text-gray-600">Vehicle</p>
                            <p className="font-semibold text-gray-900">
                              {listing.year} {listing.make} {listing.model}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Category</p>
                            <p className="font-semibold text-gray-900">{listing.category}</p>
                          </div>
                        </>
                      )}
                      {listing.type === 'land' && (
                        <>
                          <div>
                            <p className="text-sm text-gray-600">Area</p>
                            <p className="font-semibold text-gray-900">
                              {listing.area} {listing.unit}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Zoning</p>
                            <p className="font-semibold text-gray-900">{listing.zoning}</p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Submitter Information</h4>
                      <div className="grid md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span>{listing.contactName || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span>{listing.contactEmail || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span>{listing.contactPhone || 'N/A'}</span>
                        </div>
                      </div>
                      {listing.isPaidListing && (
                        <div className="mt-2 flex items-center text-green-600">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">Paid Listing</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => setSelectedListing(listing)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </button>
                    <button
                      onClick={() => handleApprove(listing)}
                      disabled={processingId === listing.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedListing(listing);
                        setShowRejectModal(true);
                      }}
                      disabled={processingId === listing.id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Details Modal */}
      {selectedListing && !showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Listing Details</h3>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Images */}
              {selectedListing.images && selectedListing.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {selectedListing.images.map((img, index) => (
                    <img
                      key={index}
                      src={img.url}
                      alt={img.alt || `Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Full listing details would go here */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">
                    {/* Description content */}
                    [Full description would be displayed here]
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedListing(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleApprove(selectedListing)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Approve Listing
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject Listing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex items-center">
                <AlertCircle className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Reject Listing</h3>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to reject "{selectedListing.title}"?
              </p>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Rejection
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                placeholder="Please provide a reason for rejection..."
                required
              />
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || processingId === selectedListing.id}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Reject Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}