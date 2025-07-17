// components/Navigation.tsx
import Link from 'next/link';
import { getListingPageUrl } from '@/lib/utils/routing';

export function Navigation() {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl">
            JUBABUY
          </Link>
          
          <div className="flex space-x-8">
            <Link 
              href={getListingPageUrl('property')} 
              className="hover:text-blue-600"
            >
              Properties
            </Link>
            <Link 
              href={getListingPageUrl('car')} 
              className="hover:text-blue-600"
            >
              Cars
            </Link>
            <Link 
              href={getListingPageUrl('land')} 
              className="hover:text-blue-600"
            >
              Land
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// If you have a mobile navigation or dropdown
export function CategoryDropdown() {
  const categories = [
    { type: 'property' as const, label: 'Properties', icon: '🏠' },
    { type: 'car' as const, label: 'Cars', icon: '🚗' },
    { type: 'land' as const, label: 'Land', icon: '🏞️' },
  ];
  
  return (
    <div className="dropdown">
      <button className="dropdown-trigger">Browse Categories</button>
      <div className="dropdown-menu">
        {categories.map(({ type, label, icon }) => (
          <Link
            key={type}
            href={getListingPageUrl(type)}
            className="dropdown-item"
          >
            <span className="mr-2">{icon}</span>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}