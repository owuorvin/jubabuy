// components/layout/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, User, Settings, Home, Heart, LogOut, Plus, Phone, Car,LandPlot, Building, MapPin } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

export default function Header() {
  const { state, actions } = useApp();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className={cn(
      'fixed w-full top-0 z-50 transition-all duration-300',
      scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md'
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/"
            className="flex items-center"
          >
            <Logo />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                JUBABUY LTD
              </h1>
              <p className="text-xs text-gray-600">Premium Real Estate & Automotive</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Houses Dropdown */}
            <NavDropdown title="Houses" icon={Home} color="text-blue-600">
              <div className="p-4 w-72">
                <DropdownSection>
                  <DropdownLink 
                    href="/properties"
                    icon="🏠"
                    title="Buy House"
                    description="Browse houses for sale"
                  />
                  <DropdownLink 
                    href="/rentals"
                    icon="🏘️"
                    title="Rent House"
                    description="Find rental properties"
                  />
                  <DropdownLink 
                    href="/airbnb"
                    icon="🏨"
                    title="Short Stay / Airbnb"
                    description="Book short-term accommodations"
                  />
                </DropdownSection>
              </div>
            </NavDropdown>

            {/* Land */}
           {/* Land Dropdown */}
           <NavDropdown title="Land" icon={MapPin} color="text-green-600">
              <div className="p-4 w-72">
                <DropdownSection>
                  <DropdownLink 
                    href="/land?landCategory=sale"
                    icon="🏞️"
                    title="Sale Land"
                    description="Browse land for sale"
                  />
                  <DropdownLink 
                    href="/land?landCategory=lease"
                    icon="📜"
                    title="Lease Land"
                    description="Find land for lease"
                  />
                  <DropdownLink 
                    href="/land?landCategory=rent"
                    icon="🌾"
                    title="Rent Land"
                    description="Rent land for your needs"
                  />
                </DropdownSection>
              </div>
            </NavDropdown>

            {/* Vehicles Dropdown */}
            <NavDropdown title="Vehicles" icon={Car} color="text-red-600">
              <div className="p-4 w-72">
                <DropdownSection>
                  <DropdownLink 
                    href="/cars?condition=new"
                    icon="🚗"
                    title="New Vehicles"
                    description="Brand new cars and trucks"
                  />
                  <DropdownLink 
                    href="/cars?condition=used"
                    icon="🚙"
                    title="Used Vehicles"
                    description="Quality pre-owned vehicles"
                  />
                   <DropdownLink 
                    href="/cars?carCategory=rent"
                    icon="🚕"
                    title="Rent Vehicle"
                    description="Car hire and rentals"
                  />
                </DropdownSection>
              </div>
            </NavDropdown>

            {/* About & Services */}
            <NavDropdown title="Company" color="text-purple-600">
              <div className="p-4 w-64">
                <DropdownSection>
                  <DropdownLink 
                    href="/about"
                    title="About Us"
                    description="Learn about JubaBuy Ltd"
                  />
                  <DropdownLink 
                    href="/services"
                    title="Our Services"
                    description="What we offer"
                  />
                  <DropdownLink 
                    href="/contact"
                    title="Contact Us"
                    description="Get in touch"
                  />
                </DropdownSection>
              </div>
            </NavDropdown>

            {/* Admin Link */}
            {state.user?.isAdmin && (
              <NavLink href="/admin" color="text-orange-600">
                Admin
              </NavLink>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Contact Number */}
            <a 
              href="tel:+211981779330"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">+211 981 779 330</span>
            </a>

            {/* List Property Button */}
            <Link 
              href="/list-property"
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              List Property
            </Link>

            {/* User Menu */}
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && <MobileMenu />}
      </div>
    </header>
  );
}

// Logo Component
function Logo() {
  return (
    <div className="w-12 h-12 mr-3">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="none" stroke="url(#logoGradient)" strokeWidth="3"/>
        <rect x="70" y="60" width="60" height="80" fill="url(#logoGradient)" rx="5" opacity="0.8"/>
        <rect x="85" y="75" width="10" height="10" fill="white"/>
        <rect x="105" y="75" width="10" height="10" fill="white"/>
        <rect x="85" y="95" width="10" height="10" fill="white"/>
        <rect x="105" y="95" width="10" height="10" fill="white"/>
        <rect x="90" y="120" width="20" height="20" fill="white" rx="2"/>
      </svg>
    </div>
  );
}

// NavLink Component
function NavLink({ children, href, color = "text-gray-700", icon: Icon }: { 
  children: React.ReactNode; 
  href: string;
  color?: string;
  icon?: any;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href}
      className={cn(
        "font-medium transition-colors px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center",
        isActive ? "text-blue-600 bg-blue-50" : `${color} hover:text-blue-600`
      )}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </Link>
  );
}

// NavDropdown Component
function NavDropdown({ title, children, color = "text-gray-700", icon: Icon }: { 
  title: string; 
  children: React.ReactNode;
  color?: string;
  icon?: any;
}) {
  return (
    <div className="relative group">
      <button className={`${color} hover:text-blue-600 font-medium transition-colors flex items-center px-4 py-2 rounded-lg hover:bg-gray-50`}>
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        {title} <ChevronDown className="w-4 h-4 ml-1" />
      </button>
      <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 z-50">
        {children}
      </div>
    </div>
  );
}

// DropdownSection Component
function DropdownSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      {children}
    </div>
  );
}

// DropdownLink Component
function DropdownLink({ 
  href,
  icon, 
  title, 
  description 
}: { 
  href: string;
  icon?: string;
  title: string;
  description?: string;
}) {
  return (
    <Link 
      href={href}
      className="block w-full text-left px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
    >
      <div className="flex items-start">
        {icon && <span className="text-2xl mr-3 mt-0.5">{icon}</span>}
        <div>
          <p className="font-medium text-gray-900 group-hover:text-blue-600">{title}</p>
          {description && (
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

// UserMenu Component
function UserMenu() {
  const { state, actions } = useApp();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isAuthenticated = state.user?.isAuthenticated || false;
  const user = state.user?.profile || { name: 'Guest User', email: 'guest@example.com' };
  const isAdmin = state.user?.isAdmin || false;

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    if (actions.logout) {
      actions.logout();
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
      >
        <User className="w-5 h-5 text-gray-700" />
      </button>
      
      {open && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 border border-gray-100 z-50">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                {isAdmin && (
                  <MenuLink href="/admin" icon={Settings}>
                    Admin Dashboard
                  </MenuLink>
                )}
                <MenuLink href="/my-properties" icon={Home}>
                  My Properties
                </MenuLink>
                <MenuLink href="/favorites" icon={Heart}>
                  Saved Listings ({actions.getFavoriteCount()})
                </MenuLink>
                <MenuLink href="/profile" icon={User}>
                  Profile Settings
                </MenuLink>
                <hr className="my-2" />
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <MenuLink href="/login" icon={User}>
                  Login / Register
                </MenuLink>
                <div className="px-4 py-2">
                  <p className="text-xs text-gray-500">Sign in to save listings and get personalized recommendations</p>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// MenuLink Component
function MenuLink({ children, href, icon: Icon }: { 
  children: React.ReactNode; 
  href: string; 
  icon: any 
}) {
  return (
    <Link 
      href={href}
      className="flex items-center w-full px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
    >
      <Icon className="w-4 h-4 mr-3" />
      {children}
    </Link>
  );
}

// MobileMenu Component
function MobileMenu() {
  const { state, actions } = useApp();
  const pathname = usePathname();
  
  return (
    <div className="lg:hidden bg-white border-t border-gray-100 py-4 max-h-[calc(100vh-5rem)] overflow-y-auto">
      <div className="space-y-1">
        {/* Contact */}
        <div className="px-4 py-2 border-b border-gray-100 mb-4">
          <a 
            href="tel:+211981779330"
            className="flex items-center text-blue-600 font-medium"
          >
            <Phone className="w-4 h-4 mr-2" />
            +211 981 779 330
          </a>
        </div>

        {/* Navigation Links */}
        <MobileNavSection title="Houses" icon={Home}>
          <MobileNavLink href="/properties">
            🏠 Buy House
          </MobileNavLink>
          <MobileNavLink href="/rentals">
            🏘️ Rent House
          </MobileNavLink>
          <MobileNavLink href="/airbnb">
            🏨 Short Stay / Airbnb
          </MobileNavLink>
        </MobileNavSection>

        <MobileNavSection title="Land" icon={MapPin}>
          <MapPin className="w-4 h-4 mr-2" /> Land

          <MobileNavLink href="/land?landCategory=sale">
          🏞️ Sale Land
          </MobileNavLink>
          <MobileNavLink href="/land?landCategory=lease">
          📜 Lease Land
          </MobileNavLink>
          <MobileNavLink href="/land?landCategory=rent">
          🌾 Rent Land
          </MobileNavLink>
        </MobileNavSection>

        <MobileNavSection title="Vehicles" icon={Car}>
          <MobileNavLink href="/cars?condition=new">
            🚗 New Vehicles
          </MobileNavLink>
          <MobileNavLink href="/cars?condition=used">
            🚙 Used Vehicles
          </MobileNavLink>
          <MobileNavLink href="/cars?carCategory=rent">
           🚕 Rent Vehicles
          </MobileNavLink>
        </MobileNavSection>

        <MobileNavSection title="Company">
          <MobileNavLink href="/about">About Us</MobileNavLink>
          <MobileNavLink href="/services">Our Services</MobileNavLink>
          <MobileNavLink href="/contact">Contact Us</MobileNavLink>
        </MobileNavSection>
        
        {state.user?.isAdmin && (
          <MobileNavLink href="/admin">
            <Settings className="w-4 h-4 mr-2" /> Admin
          </MobileNavLink>
        )}

        {/* List Property Button */}
        <div className="px-4 pt-4">
          <Link 
            href="/list-property"
            className="block w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 text-center font-medium"
          >
            <Plus className="inline-block w-4 h-4 mr-2" />
            List Property
          </Link>
        </div>
      </div>
    </div>
  );
}

// MobileNavSection Component
function MobileNavSection({ title, children, icon: Icon }: { 
  title: string; 
  children: React.ReactNode; 
  icon?: any;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium"
      >
        <div className="flex items-center">
          {Icon && <Icon className="w-5 h-5 mr-2" />}
          {title}
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="bg-gray-50 border-l-2 border-blue-200">
          {children}
        </div>
      )}
    </div>
  );
}

// MobileNavLink Component
function MobileNavLink({ children, href }: { children: React.ReactNode; href: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href}
      className={cn(
        "block w-full text-left px-8 py-2.5 transition-colors",
        isActive 
          ? "text-blue-600 bg-white font-medium" 
          : "text-gray-600 hover:text-blue-600 hover:bg-white"
      )}
    >
      {children}
    </Link>
  );
}