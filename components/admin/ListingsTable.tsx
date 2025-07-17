// components/admin/ListingsTable.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Edit2, Trash2, Eye, MoreVertical, Star, 
  TrendingUp, TrendingDown, AlertCircle,
  CheckCircle, Clock, XCircle
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import EditListingModal from './EditListingModal';
import ConfirmModal from './ConfirmModal';
import { formatPrice } from '@/lib/utils';

interface ListingsTableProps {
  category: string;
  searchQuery?: string;
  filterStatus?: string;
}

export default function ListingsTable({ category, searchQuery = '', filterStatus = 'all' }: ListingsTableProps) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchListings();
  }, [category, page, searchQuery, filterStatus, sortBy, sortOrder]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        search: searchQuery,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        sortBy,
        sortOrder,
      };

      let response: any;
      if (category === 'properties' || category === 'rentals' || category === 'airbnb') {
        response = await apiClient.getProperties({
          ...params,
          category: category === 'properties' ? 'sale' : category === 'rentals' ? 'rent' : 'short-stay',
        });
      } else if (category === 'cars') {
        response = await apiClient.getCars(params);
      } else if (category === 'land') {
        response = await apiClient.getLand(params);
      }

      if (response?.data) {
        // Safely extract the listings based on the response structure
        let items: any[] = [];
        const responseData = response.data;
        
        // Check each possible property and extract if it exists
        if ('properties' in responseData && Array.isArray(responseData.properties)) {
          items = responseData.properties;
        } else if ('cars' in responseData && Array.isArray(responseData.cars)) {
          items = responseData.cars;
        } else if ('land' in responseData && Array.isArray(responseData.land)) {
          items = responseData.land;
        } 
        if ('items' in responseData && Array.isArray(responseData.items)) {
          items = responseData.items;
        }else if (Array.isArray(responseData)) {
          items = responseData;
        }
        
        setListings(items);
        
        // Set pagination if it exists
        if (responseData.pagination) {
          setTotalPages(responseData.pagination.pages || 1);
          //setTotalCount(responseData.pagination.total || 0);
        }
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      // Use mock data if API fails
      setListings(generateMockListings(category));
    } finally {
      setLoading(false);
    }
  };

  const generateMockListings = (category: string) => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: `${category}-${i}`,
      title: `Sample ${category} Listing ${i + 1}`,
      price: Math.floor(Math.random() * 500000) + 50000,
      location: ['HAI CINEMA', 'NEW SITE', 'MUNUKI', 'JEBEL'][Math.floor(Math.random() * 4)],
      status: ['active', 'pending', 'sold'][Math.floor(Math.random() * 3)],
      featured: Math.random() > 0.7,
      views: Math.floor(Math.random() * 1000),
      inquiries: Math.floor(Math.random() * 50),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      images: [`https://via.placeholder.com/150`],
      agent: {
        name: 'John Doe',
        avatar: `https://ui-avatars.com/api/?name=John+Doe`,
      },
    }));
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedListings.length === listings.length) {
      setSelectedListings([]);
    } else {
      setSelectedListings(listings.map(item => item.id));
    }
  };

  const handleSelect = (id: string) => {
    if (selectedListings.includes(id)) {
      setSelectedListings(selectedListings.filter(item => item !== id));
    } else {
      setSelectedListings([...selectedListings, id]);
    }
  };

  const handleDelete = async (item: any) => {
    try {
      if (category === 'cars') {
        await apiClient.deleteCar(item.id);
      } else {
        await apiClient.deleteProperty(item.id);
      }
      fetchListings();
      setDeletingItem(null);
    } catch (error) {
      console.error('Failed to delete listing:', error);
    }
  };

  const handleBulkAction = async (action: string) => {
    // Implement bulk actions
    console.log('Bulk action:', action, selectedListings);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'sold':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sold':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Bulk Actions */}
      {selectedListings.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
          <span className="text-blue-700">
            {selectedListings.length} items selected
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              Delete Selected
            </button>
            <button
              onClick={() => handleBulkAction('deactivate')}
              className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
            >
              Deactivate
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedListings.length === listings.length && listings.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('title')}
              >
                Listing
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('price')}
              >
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {listings.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedListings.includes(item.id)}
                    onChange={() => handleSelect(item.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img 
                      src={item.images?.[0] || '/images/placeholder.jpg'} 
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover mr-4"
                    />
                    <div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                        {item.featured && (
                          <Star className="w-4 h-4 text-yellow-500 ml-2 fill-current" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">ID: {item.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-900">{formatPrice(item.price)}</p>
                  <p className="text-xs text-gray-500">
                    {item.priceChange > 0 ? (
                      <span className="text-green-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +{item.priceChange}%
                      </span>
                    ) : item.priceChange < 0 ? (
                      <span className="text-red-600 flex items-center">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        {item.priceChange}%
                      </span>
                    ) : (
                      'No change'
                    )}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900">{item.location || 'N/A'}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                    <span className="ml-1">{item.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="text-gray-900">
                      <span className="font-medium">{item.views || 0}</span> views
                    </p>
                    <p className="text-gray-500">
                      <span className="font-medium">{item.inquiries || 0}</span> inquiries
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.open(`/details?id=${item.id}`, '_blank')}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingItem(item)}
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingItem(item)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-700">
          Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, listings.length)} of {listings.length} results
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {[...Array(Math.min(5, totalPages))].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-lg ${
                page === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <EditListingModal
          item={editingItem}
          category={category}
          onClose={() => setEditingItem(null)}
          onSuccess={() => {
            setEditingItem(null);
            fetchListings();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <ConfirmModal
          title="Delete Listing"
          message={`Are you sure you want to delete "${deletingItem.title}"? This action cannot be undone.`}
          onConfirm={() => handleDelete(deletingItem)}
          onCancel={() => setDeletingItem(null)}
        />
      )}
    </>
  );
}