// components/admin/AdminDashboard.tsx
'use client';

import { useState } from 'react';
import { 
  Home, Car, MapPin, Building, BarChart3, TrendingUp, 
  DollarSign, Eye, Users, Calendar, Filter, Search,
  Download, RefreshCw, Settings, Bell, Plus, ChevronDown,
  MoreVertical, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import StatsCards from './StatsCards';
import ListingsTable from './ListingsTable';
import AddListingModal from './AddListingModal';
import AnalyticsChart from './AnalyticsChart';
import RecentActivity from './RecentActivity';

interface AdminDashboardProps {
  initialStats: any;
  initialListings: any[];
}

export default function AdminDashboard({ initialStats, initialListings }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addCategory, setAddCategory] = useState('properties');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [stats, setStats] = useState(initialStats);
  const [listings, setListings] = useState(initialListings);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'properties', label: 'Properties', icon: Home },
    { id: 'cars', label: 'Cars', icon: Car },
    { id: 'land', label: 'Land', icon: MapPin },
    { id: 'rentals', label: 'Rentals', icon: Building },
    { id: 'airbnb', label: 'Short Stay', icon: Home },
  ];

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data.stats);
      setListings(data.recentListings);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>

              <button
                onClick={refreshData}
                disabled={loading}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Analytics Section for Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <AnalyticsChart dateRange={dateRange} />
            </div>
            <div className="lg:col-span-1">
              <RecentActivity listings={listings} />
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between px-6">
              <div className="flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
              
              {activeTab !== 'overview' && (
                <button
                  onClick={() => {
                    setAddCategory(activeTab);
                    setShowAddModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New</span>
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab !== 'overview' && (
              <>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search listings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="sold">Sold</option>
                    </select>
                    
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                      <Filter className="w-4 h-4" />
                      <span>More Filters</span>
                    </button>
                    
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                <ListingsTable 
                  category={activeTab} 
                  searchQuery={searchQuery}
                  filterStatus={filterStatus}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Listing Modal */}
      {showAddModal && (
        <AddListingModal 
          category={addCategory}
          onClose={() => setShowAddModal(false)}
          onSuccess={refreshData}
        />
      )}
    </div>
  );
}