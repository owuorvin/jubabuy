// components/admin/StatsCards.tsx
'use client';

import { 
  Home, Car, MapPin, Building, BarChart3, 
  TrendingUp, TrendingDown, DollarSign, Eye, 
  Users, Calendar, ArrowUpRight, ArrowDownRight,
  MoreVertical
} from 'lucide-react';

interface StatsCardsProps {
  stats?: any;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Revenue',
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
      bgGradient: 'from-green-500 to-green-600',
      description: 'Last 30 days',
    },
    {
      title: 'Active Listings',
      value: stats?.activeListings || 0,
      change: '+8.3%',
      trend: 'up',
      icon: Home,
      color: 'blue',
      bgGradient: 'from-blue-500 to-blue-600',
      description: 'Currently active',
    },
    {
      title: 'Total Views',
      value: (stats?.totalViews || 0).toLocaleString(),
      change: '+23.1%',
      trend: 'up',
      icon: Eye,
      color: 'purple',
      bgGradient: 'from-purple-500 to-purple-600',
      description: 'This week',
    },
    {
      title: 'New Users',
      value: stats?.newUsers || 0,
      change: '-2.4%',
      trend: 'down',
      icon: Users,
      color: 'orange',
      bgGradient: 'from-orange-500 to-orange-600',
      description: 'This month',
    },
    {
      title: 'Conversion Rate',
      value: `${stats?.conversionRate || 0}%`,
      change: '+5.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'indigo',
      bgGradient: 'from-indigo-500 to-indigo-600',
      description: 'vs last month',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; lightBg: string }> = {
      green: { 
        bg: 'bg-green-100', 
        text: 'text-green-600', 
        lightBg: 'bg-green-50' 
      },
      blue: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-600', 
        lightBg: 'bg-blue-50' 
      },
      purple: { 
        bg: 'bg-purple-100', 
        text: 'text-purple-600', 
        lightBg: 'bg-purple-50' 
      },
      orange: { 
        bg: 'bg-orange-100', 
        text: 'text-orange-600', 
        lightBg: 'bg-orange-50' 
      },
      indigo: { 
        bg: 'bg-indigo-100', 
        text: 'text-indigo-600', 
        lightBg: 'bg-indigo-50' 
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const colorClasses = getColorClasses(card.color);
        
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
              <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
            </div>

            {/* Content */}
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses.bg} ${colorClasses.text} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
              <div className="flex items-baseline justify-between mb-2">
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{card.description}</p>
                <div className={`flex items-center text-sm font-medium ${
                  card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {card.change}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${card.bgGradient} transition-all duration-500`}
                  style={{ width: `${Math.random() * 40 + 60}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}