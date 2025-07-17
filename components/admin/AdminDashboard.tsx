// components/admin/AdminDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, Package, Users, DollarSign, 
  TrendingUp, Calendar, Plus, Search, Filter,
  Home, Car, MapPin, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import StatsCard from './StatsCard';
import RevenueChart from './RevenueChart';
import ListingsTable from './ListingsTable';
import AddListingModal from './AddListingModal';
import PendingListings from './PendingListings';
import { apiClient } from '@/lib/api/client';

export default function AdminDashboard() {
  const { state, actions } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('properties');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeListings: 0,
    totalViews: 0,
    newUsers: 0,
    conversionRate: 0,
    properties: 0,
    cars: 0,
    land: 0,
    rentals: 0,
    pendingListings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getStats();
      if (response.data) {
        setStats({
          ...response.data,
          pendingListings: 0, // This would come from the pending listings API
        });
      }
      
      // Fetch pending listings count
      const pendingResponse = await fetch('/api/admin/listings/approve', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jubabuy_token')}`,
        },
      });
      
      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json();
        setStats(prev => ({
          ...prev,
          pendingListings: pendingData.counts?.total || 0,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'pending', label: 'Pending Approval', icon: Clock, badge: stats.pendingListings },
    { id: 'properties', label: 'Properties', icon: Home },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'land', label: 'Land', icon: MapPin },
    { id: 'users', label: 'Users', icon: Users },
  ];

  const getCategoryStats = () => {
    switch (selectedCategory) {
      case 'properties':
        return { total: stats.properties, label: 'Total Properties' };
      case 'cars':
        return { total: stats.cars, label: 'Total Vehicles' };
      case 'land':
        return { total: stats.land, label: 'Total Land Listings' };
      default:
        return { total: 0, label: 'Total' };
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {state.user?.profile?.name || 'Admin'}</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-x-auto">
          <div className="flex space-x-1 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                  {tab.badge && tab.badge > 0 && (
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600'
                        : 'bg-red-500 text-white'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Revenue"
                value={`$${stats.totalRevenue.toLocaleString()}`}
                change="+12.5%"
                trend="up"
                icon={DollarSign}
                color="green"
              />
              <StatsCard
                title="Active Listings"
                value={stats.activeListings.toLocaleString()}
                change="+8.2%"
                trend="up"
                icon={Package}
                color="blue"
              />
              <StatsCard
                title="Total Views"
                value={stats.totalViews.toLocaleString()}
                change="+23.1%"
                trend="up"
                icon={TrendingUp}
                color="purple"
              />
              <StatsCard
                title="Pending Approval"
                value={stats.pendingListings.toLocaleString()}
                change={stats.pendingListings > 0 ? 'Action needed' : 'All clear'}
                trend={stats.pendingListings > 0 ? 'neutral' : 'up'}
                icon={Clock}
                color="orange"
              />
            </div>

            {/* Revenue Chart */}
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <RevenueChart />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Properties</span>
                    <span className="font-semibold">{stats.properties}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Vehicles</span>
                    <span className="font-semibold">{stats.cars}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Land</span>
                    <span className="font-semibold">{stats.land}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rentals</span>
                    <span className="font-semibold">{stats.rentals}</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Conversion Rate</span>
                    <span className="font-semibold text-green-600">{stats.conversionRate}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {/* Sample activity items */}
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <p className="text-sm text-gray-600">
                    New property listing approved: <span className="font-medium">3 Bedroom House in Hai Cinema</span>
                  </p>
                  <span className="text-xs text-gray-400 ml-auto">2 mins ago</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <p className="text-sm text-gray-600">
                    New inquiry received for: <span className="font-medium">Toyota Land Cruiser 2020</span>
                  </p>
                  <span className="text-xs text-gray-400 ml-auto">15 mins ago</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <p className="text-sm text-gray-600">
                    Listing pending approval: <span className="font-medium">Commercial Land in New Site</span>
                  </p>
                  <span className="text-xs text-gray-400 ml-auto">1 hour ago</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'pending' && (
          <PendingListings />
        )}

        {(activeTab === 'properties' || activeTab === 'vehicles' || activeTab === 'land') && (
          <>
            {/* Listings Management Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {activeTab === 'properties' ? 'Properties' : activeTab === 'vehicles' ? 'Vehicles' : 'Land'} Management
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {getCategoryStats().total} {getCategoryStats().label}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {/* Search */}
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search listings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                    />
                  </div>
                  
                  {/* Status Filter */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  
                  {/* Add New Button */}
                  <button
                    onClick={() => {
                      setSelectedCategory(
                        activeTab === 'properties' ? 'properties' : 
                        activeTab === 'vehicles' ? 'cars' : 
                        'land'
                      );
                      setShowAddModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                  </button>
                </div>
              </div>
            </div>

            {/* Listings Table */}
            <ListingsTable 
              category={
                activeTab === 'properties' ? 'properties' : 
                activeTab === 'vehicles' ? 'cars' : 
                'land'
              }
              searchQuery={searchQuery}
              filterStatus={filterStatus}
            />
          </>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">User Management</h3>
            <p className="text-gray-600">User management features coming soon.</p>
          </div>
        )}
      </div>

      {/* Add Listing Modal */}
      {showAddModal && (
        <AddListingModal
          category={selectedCategory}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
}