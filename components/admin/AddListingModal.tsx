'use client';

import { useState } from 'react';
import { X, Upload, Save, Trash2, Plus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { JUBA_AREAS, FUEL_TYPES, TRANSMISSION_TYPES, ZONING_TYPES } from '@/lib/constants';

interface AddListingModalProps {
  category: string;
  onClose: () => void;
  editItem?: any;
}

export default function AddListingModal({ category, onClose, editItem }: AddListingModalProps) {
  const { state, actions } = useApp();
  const [formData, setFormData] = useState<any>(editItem || {});
  const [uploadedImages, setUploadedImages] = useState<string[]>(editItem?.images || []);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Simulate upload - in production, upload to server
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const listing = {
      ...formData,
      images: uploadedImages,
      agent: state.user.profile || {
        name: 'Aries Ltd Sales',
        phone: '+211 704 049 044',
        email: 'sales@ariesltd.com'
      },
      status: formData.status || 'active'
    };

    if (editItem) {
      actions.updateListing(category, editItem.id, listing);
    } else {
      actions.addListing(category, listing);
    }
    
    onClose();
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

              {/* Location */}
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

              {/* Car Specific Fields */}
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
                      Features (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Alloy Wheels, Leather Seats, Sunroof"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.features?.join(', ') || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        features: e.target.value.split(',').map(f => f.trim()).filter(f => f) 
                      })}
                    />
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
                  Images (Upload multiple)
                </label>
                
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload images</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                  </label>
                </div>

                {/* Image Preview Grid */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Upload ${index + 1}`} 
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                    
                    {/* Add More Button */}
                    <label
                      htmlFor="image-upload"
                      className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-24 cursor-pointer hover:border-gray-400"
                    >
                      <Plus className="w-8 h-8 text-gray-400" />
                    </label>
                  </div>
                )}
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
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
            >
              <Save className="w-5 h-5 mr-2" />
              {editItem ? 'Update' : 'Save'} Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}