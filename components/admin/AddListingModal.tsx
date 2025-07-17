'use client';

import { useState } from 'react';
import { X, Save, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ImageUpload from '@/components/ImageUpload';
import { apiClient } from '@/lib/api/client';
import { JUBA_AREAS, FUEL_TYPES, TRANSMISSION_TYPES } from '@/lib/constants';

interface AddListingModalProps {
  category: string;
  onClose: () => void;
  editItem?: any;
  onSuccess?: () => void;
}

export default function AddListingModal({ category, onClose, editItem, onSuccess }: AddListingModalProps) {
  const [formData, setFormData] = useState<any>(editItem || {});
  const [uploadedImages, setUploadedImages] = useState<any[]>(editItem?.images || []);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const agentId = formData.agentId || uuidv4();

      const data = {
        ...formData,
        images: uploadedImages.map((img, index) => ({
          url: img.url,
          alt: formData.title || '',
          isMain: index === 0,
        })),
        agentId: agentId,
      };

      if (category === 'properties' || category === 'rentals' || category === 'airbnb') {
        await apiClient.createProperty({
          ...data,
          category: category === 'properties' ? 'sale' : category === 'rentals' ? 'rent' : 'short-stay',
        });
      } else if (category === 'cars') {
        await apiClient.createCar(data);
      } else if (category === 'land') {
        await apiClient.createLand(data);
      }

      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full my-8">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {editItem ? 'Edit' : 'Add New'} {category.slice(0, -1)}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                />
              </div>

              {/* Location for properties and land */}
              {category !== 'cars' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  >
                    <option value="">Select Location</option>
                    {JUBA_AREAS.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Property specific fields */}
              {(category === 'properties' || category === 'rentals' || category === 'airbnb') && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bedrooms *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.bedrooms || ''}
                        onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bathrooms *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.bathrooms || ''}
                        onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area (sqft) *
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.area || ''}
                      onChange={(e) => setFormData({ ...formData, area: parseInt(e.target.value) })}
                    />
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={formData.furnished || false}
                        onChange={(e) => setFormData({ ...formData, furnished: e.target.checked })}
                      />
                      <span className="text-sm font-medium text-gray-700">Furnished</span>
                    </label>
                  </div>
                </>
              )}

              {/* Land specific fields */}
              {category === 'land' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Area *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.area || ''}
                        onChange={(e) => setFormData({ ...formData, area: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit *
                      </label>
                      <select
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.unit || ''}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      >
                        <option value="">Select Unit</option>
                        <option value="sqm">Square Meters</option>
                        <option value="acres">Acres</option>
                        <option value="hectares">Hectares</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zoning *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.zoning || ''}
                      onChange={(e) => setFormData({ ...formData, zoning: e.target.value })}
                    >
                      <option value="">Select Zoning</option>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Mixed">Mixed</option>
                      <option value="Agricultural">Agricultural</option>
                    </select>
                  </div>
                </>
              )}

              {/* Car specific fields */}
              {category === 'cars' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Make *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.make || ''}
                        onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.model || ''}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year *
                      </label>
                      <input
                        type="number"
                        required
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.year || ''}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mileage (km) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.mileage || ''}
                        onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fuel Type *
                      </label>
                      <select
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.fuel || ''}
                        onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                      >
                        <option value="">Select Fuel Type</option>
                        {FUEL_TYPES.map(fuel => (
                          <option key={fuel} value={fuel}>{fuel}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transmission *
                      </label>
                      <select
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.transmission || ''}
                        onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                      >
                        <option value="">Select Transmission</option>
                        {TRANSMISSION_TYPES.map(trans => (
                          <option key={trans} value={trans}>{trans}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.condition || ''}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    >
                      <option value="">Select Condition</option>
                      <option value="New">New</option>
                      <option value="Used">Used</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide a detailed description..."
                />
              </div>

              {/* Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images
                </label>
                <ImageUpload
                  onUpload={setUploadedImages}
                  maxFiles={20}
                  maxSizeMB={10}
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Parking, Security, Garden"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.features?.join(', ') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    features: e.target.value.split(',').map(f => f.trim()).filter(f => f) 
                  })}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                  {category === 'airbnb' && <option value="booked">Booked</option>}
                </select>
              </div>

              {/* Featured Toggle */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <span className="text-sm font-medium text-gray-700">Mark as Featured</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center disabled:opacity-50"
            >
              <Save className="w-5 h-5 mr-2" />
              {submitting ? 'Saving...' : (editItem ? 'Update' : 'Save')} Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}