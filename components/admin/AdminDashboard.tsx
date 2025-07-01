'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import StatsCards from './StatsCards';
import ListingsTable from './ListingsTable';
import AddListingModal from './AddListingModal';
import { Plus } from 'lucide-react';

export default function AdminDashboard() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addCategory, setAddCategory] = useState('properties');

  const tabs = ['overview', 'properties', 'cars', 'land', 'rentals', 'airbnb'];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Admin Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your listings and monitor performance</p>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'overview' ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {[...state.properties.slice(0, 3), ...state.cars.slice(0, 2)].map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center">
                        <img src={item.images[0]} alt={item.title} className="w-16 h-16 rounded-lg object-cover mr-4" />
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-gray-500">{'location' in item ? item.location : ''}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.price.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{item.views} views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Manage {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                  <button
                    onClick={() => {
                      setAddCategory(activeTab);
                      setShowAddModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New
                  </button>
                </div>

                <ListingsTable category={activeTab} />
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddListingModal 
          category={addCategory}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}