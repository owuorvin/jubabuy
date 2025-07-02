// components/admin/RecentActivity.tsx
'use client';

import { Clock, Home, Car, MapPin, Eye, Heart, MessageSquare } from 'lucide-react';

interface RecentActivityProps {
  listings: any[];
}

export default function RecentActivity({ listings }: RecentActivityProps) {
  // Mock activity data - in production, this would come from your database
  const activities = [
    {
      id: 1,
      type: 'view',
      user: 'John Doe',
      action: 'viewed',
      item: 'Modern 4BR House in Hai Cinema',
      time: '2 minutes ago',
      icon: Eye,
      color: 'blue',
    },
    {
      id: 2,
      type: 'inquiry',
      user: 'Sarah Smith',
      action: 'inquired about',
      item: '2023 Toyota Land Cruiser',
      time: '15 minutes ago',
      icon: MessageSquare,
      color: 'green',
    },
    {
      id: 3,
      type: 'favorite',
      user: 'Mike Johnson',
      action: 'saved',
      item: '2 Acres Land in Jebel',
      time: '1 hour ago',
      icon: Heart,
      color: 'red',
    },
    {
      id: 4,
      type: 'listing',
      user: 'Admin',
      action: 'added new',
      item: 'Luxury Villa in Thongping',
      time: '3 hours ago',
      icon: Home,
      color: 'purple',
    },
    {
      id: 5,
      type: 'view',
      user: 'Jane Wilson',
      action: 'viewed',
      item: '2022 Mercedes-Benz GLE',
      time: '5 hours ago',
      icon: Eye,
      color: 'blue',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600',
      purple: 'bg-purple-100 text-purple-600',
    };
    return colors[color] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getColorClasses(activity.color)}`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span>
                  {' '}
                  <span className="text-gray-600">{activity.action}</span>
                  {' '}
                  <span className="font-medium">{activity.item}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">847</p>
            <p className="text-xs text-gray-500">Views Today</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">32</p>
            <p className="text-xs text-gray-500">New Inquiries</p>
          </div>
        </div>
      </div>
    </div>
  );
}