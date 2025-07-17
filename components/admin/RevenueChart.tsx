// components/admin/RevenueChart.tsx
'use client';

import { useState } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';

export default function RevenueChart() {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data - replace with actual data from API
  const chartData = {
    '24h': [
      { time: '00:00', revenue: 2400 },
      { time: '04:00', revenue: 3200 },
      { time: '08:00', revenue: 5600 },
      { time: '12:00', revenue: 8900 },
      { time: '16:00', revenue: 7200 },
      { time: '20:00', revenue: 4500 },
      { time: '23:59', revenue: 3100 },
    ],
    '7d': [
      { time: 'Mon', revenue: 12400 },
      { time: 'Tue', revenue: 15200 },
      { time: 'Wed', revenue: 18600 },
      { time: 'Thu', revenue: 14900 },
      { time: 'Fri', revenue: 22200 },
      { time: 'Sat', revenue: 19500 },
      { time: 'Sun', revenue: 16100 },
    ],
    '30d': [
      { time: 'Week 1', revenue: 84000 },
      { time: 'Week 2', revenue: 95000 },
      { time: 'Week 3', revenue: 78000 },
      { time: 'Week 4', revenue: 102000 },
    ],
  };

  const currentData = chartData[timeRange as keyof typeof chartData];
  const maxRevenue = Math.max(...currentData.map(d => d.revenue));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
          <p className="text-sm text-gray-500 mt-1">Total revenue over time</p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>

      {/* Simple Chart */}
      <div className="relative h-64">
        <div className="absolute inset-0 flex items-end justify-between">
          {currentData.map((data, index) => {
            const height = (data.revenue / maxRevenue) * 100;
            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center"
                style={{ marginRight: index < currentData.length - 1 ? '4px' : '0' }}
              >
                <div
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:from-blue-700 hover:to-blue-500 transition-colors relative group"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${data.revenue.toLocaleString()}
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-2">{data.time}</span>
              </div>
            );
          })}
        </div>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-8">
          <span>${(maxRevenue / 1000).toFixed(0)}k</span>
          <span>${(maxRevenue / 2000).toFixed(0)}k</span>
          <span>$0</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500">Total Revenue</p>
          <p className="text-lg font-semibold text-gray-900">
            ${currentData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Average</p>
          <p className="text-lg font-semibold text-gray-900">
            ${Math.round(currentData.reduce((sum, d) => sum + d.revenue, 0) / currentData.length).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Growth</p>
          <p className="text-lg font-semibold text-green-600 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12.5%
          </p>
        </div>
      </div>
    </div>
  );
}