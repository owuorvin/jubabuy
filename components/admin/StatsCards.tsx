'use client';

import { Home, Car, MapPin, Building, BarChart3 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function StatsCards() {
  const { state } = useApp();

  const stats = {
    properties: state.properties.length,
    cars: state.cars.length,
    land: state.land.length,
    rentals: state.rentals.length,
    totalViews: [...state.properties, ...state.cars, ...state.land, ...state.rentals]
      .reduce((sum, item) => sum + (item.views || 0), 0)
  };

  const cards = [
    { title: 'Properties', value: stats.properties, icon: Home, color: 'text-blue-500' },
    { title: 'Cars', value: stats.cars, icon: Car, color: 'text-green-500' },
    { title: 'Land Plots', value: stats.land, icon: MapPin, color: 'text-orange-500' },
    { title: 'Rentals', value: stats.rentals, icon: Building, color: 'text-purple-500' },
    { title: 'Total Views', value: stats.totalViews, icon: BarChart3, color: 'text-indigo-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <card.icon className={`w-10 h-10 ${card.color}`} />
            <span className="text-2xl font-bold">{card.value}</span>
          </div>
          <p className="text-gray-600">{card.title}</p>
        </div>
      ))}
    </div>
  );
}