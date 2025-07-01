'use client';

import { Edit2, Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface ListingsTableProps {
  category: string;
}

export default function ListingsTable({ category }: ListingsTableProps) {
  const { state, actions } = useApp();
  const listings = (state as any)[category] || [];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {listings.map((item: any) => (
            <tr key={item.id}>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img src={item.images[0]} alt={item.title} className="w-10 h-10 rounded-lg object-cover mr-3" />
                  <span className="text-sm font-medium text-gray-900">{item.title}</span>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                ${item.price.toLocaleString()}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.location || item.make || '-'}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  item.status === 'active' ? 'bg-green-100 text-green-800' :
                  item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.views}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 mr-3">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => actions.deleteListing(category, item.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}