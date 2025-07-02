// app/admin/page.tsx
import AdminDashboard from '@/components/admin/AdminDashboard';
import { getStats, getRecentListings } from '@/lib/db/queries';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  // Check authentication
  const session = await getServerSession();
  if (!session || session.user?.role !== 'admin') {
    redirect('/login');
  }

  // Fetch data from Turso
  const [stats, recentListings] = await Promise.all([
    getStats(),
    getRecentListings(10),
  ]);

  return <AdminDashboard initialStats={stats} initialListings={recentListings} />;
}

// components/admin/AdminDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
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
import { apiClient } from '@/lib/api/client';

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
      // Fetch fresh data from API
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
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Date Range Selector */}
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

              {/* Refresh Button */}
              <button
                onClick={refreshData}
                disabled={loading}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>

              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatsCard
            title="Total Revenue"
            value={`$${stats.totalRevenue?.toLocaleString() || '0'}`}
            change="+12.5%"
            trend="up"
            icon={DollarSign}
            color="green"
          />
          <StatsCard
            title="Active Listings"
            value={stats.activeListings || 0}
            change="+8.3%"
            trend="up"
            icon={Home}
            color="blue"
          />
          <StatsCard
            title="Total Views"
            value={stats.totalViews?.toLocaleString() || '0'}
            change="+23.1%"
            trend="up"
            icon={Eye}
            color="purple"
          />
          <StatsCard
            title="New Users"
            value={stats.newUsers || 0}
            change="-2.4%"
            trend="down"
            icon={Users}
            color="orange"
          />
          <StatsCard
            title="Conversion Rate"
            value={`${stats.conversionRate || 0}%`}
            change="+5.2%"
            trend="up"
            icon={TrendingUp}
            color="indigo"
          />
        </div>

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

        {/* Enhanced Tabs */}
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
                {/* Search and Filters */}
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

                {/* Enhanced Table */}
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

// Enhanced Stats Card Component
function StatsCard({ title, value, change, trend, icon: Icon, color }: any) {
  const colorClasses = {
    green: 'text-green-600 bg-green-100',
    blue: 'text-blue-600 bg-blue-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100',
    indigo: 'text-indigo-600 bg-indigo-100',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <div className={`flex items-center text-sm font-medium ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {change}
        </div>
      </div>
    </div>
  );
}