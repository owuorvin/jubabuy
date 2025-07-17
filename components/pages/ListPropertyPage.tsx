// components/pages/ListPropertyPage.tsx
'use client';

import { useState } from 'react';
import { 
  Home, Car, MapPin, Upload, X, CheckCircle, 
  Camera, Info, Shield, Clock, DollarSign, 
  FileText, User, Mail, Phone, Loader2 
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';

type ListingType = 'property' | 'vehicle' | 'land';

export default function ListPropertyPage() {
  const [activeTab, setActiveTab] = useState<ListingType>('property');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  // Add uploadedImages state at the component level
  const [uploadedImages, setUploadedImages] = useState<{ url: string; filename: string }[]>([]);
  // Add error states
  const [errors, setErrors] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Form states
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    category: 'sale',
    propertyType: 'house',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    furnished: false,
    description: '',
    features: [] as string[],
    amenities: [] as string[],
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    isPaid: false,
  });

  const [vehicleForm, setVehicleForm] = useState({
    title: '',
    category: 'sale',
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    fuel: 'Petrol',
    transmission: 'Manual',
    condition: 'Used',
    color: '',
    engineSize: '',
    description: '',
    features: [] as string[], 
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    isPaid: false,
  });

  const [landForm, setLandForm] = useState({
    title: '',
    category: 'sale',
    price: '',
    location: '',
    area: '',
    unit: 'sqm',
    zoning: 'Residential',
    description: '',
    features: [] as string[], 
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    isPaid: false,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.slice(0, 10 - images.length); // Max 10 images
    
    setImages([...images, ...newImages]);
    
    // Create preview URLs
    const urls = newImages.map(file => URL.createObjectURL(file));
    setImageUrls([...imageUrls, ...urls]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImages(newImages);
    setImageUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors([]); // Clear previous errors
    setUploadError('');
  
    try {
      // For now, we'll use placeholder image URLs since actual upload requires backend setup
      // In production, you would upload images first and get their URLs
      const tempUploadedImages = images.map((image, index) => ({
        url: imageUrls[index] || `/placeholder-${index}.jpg`,
        filename: image.name
      }));
      
      let response;
      if (activeTab === 'property') {
        const data = {
          ...propertyForm,
          price: parseInt(propertyForm.price),
          bedrooms: parseInt(propertyForm.bedrooms) || null,
          bathrooms: parseInt(propertyForm.bathrooms) || null,
          area: parseInt(propertyForm.area) || null,
          features: propertyForm.features,
          amenities: propertyForm.amenities,
          images: tempUploadedImages.map((img, index) => ({
            url: img.url,
            alt: img.filename || propertyForm.title || 'Property Image',
            isMain: index === 0
          })),
          status: 'pending',
          slug: propertyForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          isPaidListing: propertyForm.isPaid || false,
          displayOwnContact: true,
          featured: false,
          views: 0,
          agentId: '43ac7afd-f4f0-40ce-93c4-00ab1a361720', // Add agent ID if available
        } as any;
        
        response = await apiClient.createProperty(data);
      } else if (activeTab === 'vehicle') {
        const data = {
          ...vehicleForm,
          price: parseInt(vehicleForm.price),
          year: parseInt(vehicleForm.year),
          mileage: parseInt(vehicleForm.mileage),
          features: vehicleForm.features,
          images: tempUploadedImages.map((img, index) => ({
            url: img.url,
            alt: img.filename || vehicleForm.title || 'Vehicle Image',
            isMain: index === 0
          })),
          status: 'pending',
          slug: vehicleForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          isPaidListing: vehicleForm.isPaid || false,
          displayOwnContact: true, 
          featured: false,
          views: 0,
          agentId: '43ac7afd-f4f0-40ce-93c4-00ab1a361720',
          bodyType: 'sedan', 
          condition: vehicleForm.condition || 'used', 
          rentalPeriod: null,
        } as any;
        response = await apiClient.createCar(data);
      } else if (activeTab === 'land') {
        const data = {
          ...landForm,
          price: parseInt(landForm.price),
          area: parseInt(landForm.area),
          features: landForm.features,
          images: tempUploadedImages.map((img, index) => ({
            url: img.url,
            alt: img.filename || landForm.title || 'Land Image',
            isMain: index === 0
          })),
          status: 'pending',
          slug: landForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          isPaidListing: landForm.isPaid || false,
          displayOwnContact: true,
          featured: false,
          views: 0,
          agentId: '43ac7afd-f4f0-40ce-93c4-00ab1a361720',
          topography: null,
          soilType: null,
          leasePeriod: null,
        } as any;
        response = await apiClient.createLand(data);
      }
  
      if (response?.data) {
        setSubmitted(true);
        // Reset form after 5 seconds
        setTimeout(() => {
          setUploadedImages([]);
          window.location.href = '/';
        }, 5000);
      } else if (response?.error) {
        setErrors([response.error]);
      }
    } catch (error: any) {
      console.error('Failed to submit listing:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to submit listing. Please check your information and try again.';
      setErrors([errorMessage]);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Listing Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your listing has been submitted for review. Our team will verify the details and 
            approve it within 24-48 hours. You'll receive a notification once it's live.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            A confirmation email has been sent to your registered email address.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">List Your Property</h1>
          <p className="text-xl max-w-3xl">
            Reach thousands of potential buyers and renters. List your property, vehicle, or land with us today.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Verified Listings</h3>
              <p className="text-sm text-gray-600">All listings are verified for authenticity</p>
            </div>
            <div className="text-center">
              <Clock className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Quick Approval</h3>
              <p className="text-sm text-gray-600">Get approved within 24-48 hours</p>
            </div>
            <div className="text-center">
              <DollarSign className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Best Value</h3>
              <p className="text-sm text-gray-600">Competitive pricing plans available</p>
            </div>
            <div className="text-center">
              <User className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-sm text-gray-600">Dedicated support team to help you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex space-x-2 mb-8 bg-white rounded-xl p-2 shadow-md">
              <button
                onClick={() => setActiveTab('property')}
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-semibold transition-colors ${
                  activeTab === 'property'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5 mr-2" />
                Property
              </button>
              <button
                onClick={() => setActiveTab('vehicle')}
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-semibold transition-colors ${
                  activeTab === 'vehicle'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Car className="w-5 h-5 mr-2" />
                Vehicle
              </button>
              <button
                onClick={() => setActiveTab('land')}
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-semibold transition-colors ${
                  activeTab === 'land'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MapPin className="w-5 h-5 mr-2" />
                Land
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
              {/* Property Form */}
              {activeTab === 'property' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Property Title *
                      </label>
                      <input
                        type="text"
                        value={propertyForm.title}
                        onChange={(e) => setPropertyForm({ ...propertyForm, title: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="e.g., Modern 3 Bedroom House"
                      />
                    </div>
                    
                    <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Category *
                      </label>
                      <select
                        value={propertyForm.category}
                        onChange={(e) => setPropertyForm({ ...propertyForm, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      >
                        <option value="sale">For Sale</option>
                        <option value="rent">For Rent</option>
                        <option value="short-stay">Short Stay / Airbnb</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Property Type *
                      </label>
                      <select
                        value={propertyForm.propertyType}
                        onChange={(e) => setPropertyForm({ ...propertyForm, propertyType: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      >
                        <option value="house">House</option>
                        <option value="apartment">Apartment</option>
                        <option value="villa">Villa</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Price (USD) *
                      </label>
                      <input
                        type="number"
                        value={propertyForm.price}
                        onChange={(e) => setPropertyForm({ ...propertyForm, price: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="50000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        value={propertyForm.location}
                        onChange={(e) => setPropertyForm({ ...propertyForm, location: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="e.g., Hai Cinema, Juba"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        value={propertyForm.bedrooms}
                        onChange={(e) => setPropertyForm({ ...propertyForm, bedrooms: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        value={propertyForm.bathrooms}
                        onChange={(e) => setPropertyForm({ ...propertyForm, bathrooms: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Area (sqm)
                      </label>
                      <input
                        type="number"
                        value={propertyForm.area}
                        onChange={(e) => setPropertyForm({ ...propertyForm, area: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={propertyForm.description}
                      onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-500"
                      placeholder="Describe your property in detail..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Features (comma-separated)
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Parking, Security, Garden"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        value={propertyForm.features.join(', ')}
                        onChange={(e) => {
                        const features = e.target.value
                            .split(',')
                            .map(f => f.trim())
                            .filter(f => f);
                        setPropertyForm({ ...propertyForm, features });
                        }}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="furnished"
                      checked={propertyForm.furnished}
                      onChange={(e) => setPropertyForm({ ...propertyForm, furnished: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="furnished" className="ml-2 text-sm font-semibold text-gray-900">
                      Property is furnished
                    </label>
                  </div>
                </div>
              )}

              {/* Vehicle Form */}
              {activeTab === 'vehicle' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Details</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Vehicle Title *
                      </label>
                      <input
                        type="text"
                        value={vehicleForm.title}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, title: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="e.g., 2020 Toyota Land Cruiser"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Category *
                      </label>
                      <select
                        value={vehicleForm.category}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      >
                        <option value="sale">For Sale</option>
                        <option value="rent">For Rent / Car Hire</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Make *
                      </label>
                      <input
                        type="text"
                        value={vehicleForm.make}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="e.g., Toyota"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Model *
                      </label>
                      <input
                        type="text"
                        value={vehicleForm.model}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="e.g., Land Cruiser"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Year *
                      </label>
                      <input
                        type="number"
                        value={vehicleForm.year}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="2020"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Price (USD) *
                      </label>
                      <input
                        type="number"
                        value={vehicleForm.price}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, price: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="25000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Mileage (km) *
                      </label>
                      <input
                        type="number"
                        value={vehicleForm.mileage}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, mileage: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="50000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Fuel Type *
                      </label>
                      <select
                        value={vehicleForm.fuel}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, fuel: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Electric">Electric</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Transmission *
                      </label>
                      <select
                        value={vehicleForm.transmission}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, transmission: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      >
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automatic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Condition *
                      </label>
                      <select
                        value={vehicleForm.condition}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, condition: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      >
                        <option value="New">New</option>
                        <option value="Used">Used</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={vehicleForm.description}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, description: e.target.value })}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-500"
                      placeholder="Describe your vehicle in detail..."
                    />
                  </div>
                </div>
              )}

              {/* Land Form */}
              {activeTab === 'land' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Land Details</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Land Title *
                      </label>
                      <input
                        type="text"
                        value={landForm.title}
                        onChange={(e) => setLandForm({ ...landForm, title: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Prime Residential Plot"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={landForm.category}
                        onChange={(e) => setLandForm({ ...landForm, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="sale">For Sale</option>
                        <option value="lease">For Lease</option>
                        <option value="rent">For Rent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (USD) *
                      </label>
                      <input
                        type="number"
                        value={landForm.price}
                        onChange={(e) => setLandForm({ ...landForm, price: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="100000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        value={landForm.location}
                        onChange={(e) => setLandForm({ ...landForm, location: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., New Site, Juba"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Area *
                      </label>
                      <input
                        type="number"
                        value={landForm.area}
                        onChange={(e) => setLandForm({ ...landForm, area: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit *
                      </label>
                      <select
                        value={landForm.unit}
                        onChange={(e) => setLandForm({ ...landForm, unit: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="sqm">Square Meters</option>
                        <option value="acres">Acres</option>
                        <option value="hectares">Hectares</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zoning *
                      </label>
                      <select
                        value={landForm.zoning}
                        onChange={(e) => setLandForm({ ...landForm, zoning: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Mixed">Mixed Use</option>
                        <option value="Agricultural">Agricultural</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={landForm.description}
                      onChange={(e) => setLandForm({ ...landForm, description: e.target.value })}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="Describe your land in detail..."
                    />
                  </div>
                </div>
              )}

              {/* Image Upload Section */}
              <div className="mt-8 border-t pt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Images</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <label
                    htmlFor="images"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Camera className="w-12 h-12 text-gray-400 mb-3" />
                    <span className="text-gray-600 font-medium">Click to upload images</span>
                    <span className="text-sm text-gray-500 mt-1">Maximum 10 images (JPG, PNG)</span>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Image Preview */}
                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Information Section */}
              <div className="mt-8 border-t pt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Important:</p>
                      <p>If you have a paid subscription, your personal contact details will be displayed. 
                      Otherwise, our admin contact will be shown to potential buyers.</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={
                        activeTab === 'property' ? propertyForm.contactName :
                        activeTab === 'vehicle' ? vehicleForm.contactName :
                        landForm.contactName
                      }
                      onChange={(e) => {
                        if (activeTab === 'property') {
                          setPropertyForm({ ...propertyForm, contactName: e.target.value });
                        } else if (activeTab === 'vehicle') {
                          setVehicleForm({ ...vehicleForm, contactName: e.target.value });
                        } else {
                          setLandForm({ ...landForm, contactName: e.target.value });
                        }
                      }}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      value={
                        activeTab === 'property' ? propertyForm.contactEmail :
                        activeTab === 'vehicle' ? vehicleForm.contactEmail :
                        landForm.contactEmail
                      }
                      onChange={(e) => {
                        if (activeTab === 'property') {
                          setPropertyForm({ ...propertyForm, contactEmail: e.target.value });
                        } else if (activeTab === 'vehicle') {
                          setVehicleForm({ ...vehicleForm, contactEmail: e.target.value });
                        } else {
                          setLandForm({ ...landForm, contactEmail: e.target.value });
                        }
                      }}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Phone *
                    </label>
                    <input
                      type="tel"
                      value={
                        activeTab === 'property' ? propertyForm.contactPhone :
                        activeTab === 'vehicle' ? vehicleForm.contactPhone :
                        landForm.contactPhone
                      }
                      onChange={(e) => {
                        if (activeTab === 'property') {
                          setPropertyForm({ ...propertyForm, contactPhone: e.target.value });
                        } else if (activeTab === 'vehicle') {
                          setVehicleForm({ ...vehicleForm, contactPhone: e.target.value });
                        } else {
                          setLandForm({ ...landForm, contactPhone: e.target.value });
                        }
                      }}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+211 XXX XXX XXX"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPaid"
                      checked={
                        activeTab === 'property' ? propertyForm.isPaid :
                        activeTab === 'vehicle' ? vehicleForm.isPaid :
                        landForm.isPaid
                      }
                      onChange={(e) => {
                        if (activeTab === 'property') {
                          setPropertyForm({ ...propertyForm, isPaid: e.target.checked });
                        } else if (activeTab === 'vehicle') {
                          setVehicleForm({ ...vehicleForm, isPaid: e.target.checked });
                        } else {
                          setLandForm({ ...landForm, isPaid: e.target.checked });
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPaid" className="ml-2 text-sm text-gray-700">
                      I have a paid subscription
                    </label>
                  </div>
                </div>
              </div>

              {/* Error Messages */}
              {errors.length > 0 && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                  {errors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Submit for Review
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Listing Packages</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Basic</h3>
              <p className="text-3xl font-bold text-gray-900 mb-6">Free</p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Admin contact displayed</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Basic listing features</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Up to 5 images</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-600 text-white rounded-xl p-8 shadow-xl transform scale-105">
              <h3 className="text-xl font-bold mb-4">Professional</h3>
              <p className="text-3xl font-bold mb-6">$29/month</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-white mr-2 flex-shrink-0" />
                  <span>Your contact displayed</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-white mr-2 flex-shrink-0" />
                  <span>Featured listing badge</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-white mr-2 flex-shrink-0" />
                  <span>Up to 20 images</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-white mr-2 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Enterprise</h3>
              <p className="text-3xl font-bold text-gray-900 mb-6">$99/month</p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Everything in Professional</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Unlimited listings</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Analytics dashboard</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Dedicated account manager</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}