// components/admin/AnalyticsChart.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from 'recharts';
import { Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';

interface AnalyticsChartProps {
  dateRange: string;
}

export default function AnalyticsChart({ dateRange }: AnalyticsChartProps) {
  const [chartType, setChartType] = useState<'revenue' | 'views' | 'listings'>('revenue');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, [dateRange, chartType]);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?range=${dateRange}&type=${chartType}`);
      const result = await response.json();
      setData(result.data || generateMockData());
    } catch (error) {
      // Use mock data if API fails
      setData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const days = dateRange === '24h' ? 24 : dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      
      return {
        date: dateRange === '24h' 
          ? date.toLocaleTimeString('en-US', { hour: '2-digit' })
          : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.floor(Math.random() * 50000) + 20000,
        views: Math.floor(Math.random() * 1000) + 500,
        listings: Math.floor(Math.random() * 20) + 5,
      };
    });
  };

  const chartConfig = {
    revenue: {
      title: 'Revenue Overview',
      color: '#3b82f6',
      icon: DollarSign,
      format: (value: number) => `$${value.toLocaleString()}`,
    },
    views: {
      title: 'Page Views',
      color: '#8b5cf6',
      icon: TrendingUp,
      format: (value: number) => value.toLocaleString(),
    },
    listings: {
      title: 'New Listings',
      color: '#10b981',
      icon: Users,
      format: (value: number) => value.toString(),
    },
  };

  const currentConfig = chartConfig[chartType];
  const Icon = currentConfig.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100`}>
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{currentConfig.title}</h3>
            <p className="text-sm text-gray-500">Last {dateRange === '24h' ? '24 hours' : dateRange}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {Object.keys(chartConfig).map((key) => (
            <button
              key={key}
              onClick={() => setChartType(key as any)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                chartType === key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="animate-pulse space-y-3 w-full">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-32 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${chartType}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                tickFormatter={currentConfig.format}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: any) => [currentConfig.format(value), currentConfig.title]}
              />
              <Area
                type="monotone"
                dataKey={chartType}
                stroke={currentConfig.color}
                strokeWidth={2}
                fill={`url(#gradient-${chartType})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-lg font-semibold text-gray-900">
            {currentConfig.format(data.reduce((sum, item) => sum + item[chartType], 0))}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Average</p>
          <p className="text-lg font-semibold text-gray-900">
            {currentConfig.format(Math.floor(data.reduce((sum, item) => sum + item[chartType], 0) / data.length))}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Peak</p>
          <p className="text-lg font-semibold text-gray-900">
            {currentConfig.format(Math.max(...data.map(item => item[chartType])))}
          </p>
        </div>
      </div>
    </div>
  );
}