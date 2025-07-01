'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, User, Settings, Home, Heart, LogOut, Plus, Phone } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

export default function Header() {
  const { state, actions } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      'fixed w-full top-0 z-50 transition-all duration-300',
      scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md'
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => actions.setCurrentPage('home')}
          >
            <Logo />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                JUBABUY LTD
              </h1>
              <p className="text-xs text-gray-600">Premium Real Estate & Automotive</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavDropdown title="For Sale" color="text-red-600">
              <div className="grid grid-cols-2 gap-1 p-2 w-80">
                <DropdownSection title="Property">
                  <DropdownLink onClick={() => actions.setCurrentPage('houses')}>Houses for Sale</DropdownLink>
                  <DropdownLink onClick={() => actions.setCurrentPage('apartments')}>Apartments for Sale</DropdownLink>
                  <DropdownLink onClick={() => actions.setCurrentPage('villas')}>Villas for Sale</DropdownLink>
                  <DropdownLink onClick={() => actions.setCurrentPage('land')}>Land for Sale</DropdownLink>
                </DropdownSection>
                <DropdownSection title="Vehicles">
                  <DropdownLink onClick={() => actions.setCurrentPage('new-cars')}>New Cars</DropdownLink>
                  <DropdownLink onClick={() => actions.setCurrentPage('used-cars')}>Used Cars</DropdownLink>
                  <DropdownLink onClick={() => actions.setCurrentPage('commercial-vehicles')}>Commercial Vehicles</DropdownLink>
                  <DropdownLink onClick={() => actions.setCurrentPage('motorcycles')}>Motorcycles</DropdownLink>
                </DropdownSection>
              </div>
            </NavDropdown>

            <NavDropdown title="For Rent" color="text-blue-600">
              <div className="p-2 w-64">
                <DropdownSection title="Rentals">
                  <DropdownLink onClick={() => actions.setCurrentPage('house-rentals')}>Houses for Rent</DropdownLink>
                  <DropdownLink onClick={() => actions.setCurrentPage('apartment-rentals')}>Apartments for Rent</DropdownLink>
                  <DropdownLink onClick={() => actions.setCurrentPage('commercial-rent')}>Commercial Property</DropdownLink>
                  <DropdownLink onClick={() => actions.setCurrentPage('office-rent')}>Office Spaces</DropdownLink>
                </DropdownSection>
              </div>
            </NavDropdown>

            <NavLink onClick={() => actions.setCurrentPage('airbnb')} color="text-green-600">
              Short Stay
            </NavLink>

            <NavDropdown title="Services" color="text-purple-600">
              <div className="p-2 w-64">
                <DropdownSection title="Our Services">
                  <DropdownLink onClick={() => actions.setCurrentPage('property-management')}>Property Management</DropdownLink>
                  <DropdownLink onClick={() => actions.setCurrentPage('valuation')}>Property Valuation</DropdownLink>
                  <DropdownLink onClick={() => actions.setCurrentPage('legal-services')}>Legal Services</DropdownLink>
                  <DropdownLink onClick={() => actions.setCurrentPage('mortgage')}>Mortgage Assistance</DropdownLink>
                </DropdownSection>
              </div>
            </NavDropdown>

            {/* <NavLink onClick={() => actions.setCurrentPage('agents')}>
              Estate Agents
            </NavLink> */}

            {/* <NavLink onClick={() => actions.setCurrentPage('advice')}>
              Property Advice
            </NavLink> */}

            {state.user.isAdmin && (
              <NavLink onClick={() => actions.setCurrentPage('admin')} color="text-orange-600">
                Admin
              </NavLink>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Contact Number */}
            <a 
              href="tel:+211704049044"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">+211 704 049 044</span>
            </a>

            {/* List Property Button */}
            <button 
              onClick={() => actions.setCurrentPage('list-property')}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              List Property
            </button>

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
        {mobileMenuOpen && <MobileMenu setMobileMenuOpen={setMobileMenuOpen} />}
      </div>
    </header>
  );
}

// Subcomponents
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
        {[...Array(12)].map((_, i) => (
          <g key={i} transform={`rotate(${i * 30} 100 100)`}>
            {[...Array(8)].map((_, j) => (
              <rect
                key={j}
                x={90 + j * 8}
                y="95"
                width="6"
                height="10"
                fill={i < 8 ? 'url(#logoGradient)' : '#10b981'}
                rx="1"
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

function NavLink({ children, onClick, color = "text-gray-700" }: { 
  children: React.ReactNode; 
  onClick: () => void;
  color?: string;
}) {
  return (
    <button 
      onClick={onClick}
      className={`${color} hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-50`}
    >
      {children}
    </button>
  );
}

function NavDropdown({ title, children, color = "text-gray-700" }: { 
  title: string; 
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="relative group">
      <button className={`${color} hover:text-blue-600 font-medium transition-colors flex items-center px-3 py-2 rounded-lg hover:bg-gray-50`}>
        {title} <ChevronDown className="w-4 h-4 ml-1" />
      </button>
      <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
        {children}
      </div>
    </div>
  );
}

function DropdownSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2 border-b border-gray-100">
        {title}
      </h4>
      <div className="py-1">
        {children}
      </div>
    </div>
  );
}

function DropdownLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 text-sm transition-colors"
    >
      {children}
    </button>
  );
}

function UserMenu() {
  const { state, actions } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
      >
        <User className="w-5 h-5 text-gray-700" />
      </button>
      
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 border border-gray-100">
          {state.user.isAuthenticated ? (
            <>
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{state.user.profile?.name}</p>
                <p className="text-xs text-gray-500">{state.user.profile?.email}</p>
              </div>
              {state.user.isAdmin && (
                <MenuLink onClick={() => { actions.setCurrentPage('admin'); setOpen(false); }} icon={Settings}>
                  Admin Dashboard
                </MenuLink>
              )}
              <MenuLink onClick={() => { actions.setCurrentPage('my-properties'); setOpen(false); }} icon={Home}>
                My Properties
              </MenuLink>
              <MenuLink onClick={() => { actions.setCurrentPage('favorites'); setOpen(false); }} icon={Heart}>
                Saved Listings ({state.favorites.length})
              </MenuLink>
              <MenuLink onClick={() => { actions.setCurrentPage('profile'); setOpen(false); }} icon={User}>
                Profile Settings
              </MenuLink>
              <hr className="my-2" />
              <MenuLink onClick={() => { actions.logout(); setOpen(false); }} icon={LogOut}>
                Sign Out
              </MenuLink>
            </>
          ) : (
            <>
              <MenuLink onClick={() => { actions.setCurrentPage('login'); setOpen(false); }} icon={User}>
                Login / Register
              </MenuLink>
              <div className="px-4 py-2">
                <p className="text-xs text-gray-500">Sign in to save listings and get personalized recommendations</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MenuLink({ children, onClick, icon: Icon }: { 
  children: React.ReactNode; 
  onClick: () => void; 
  icon: any 
}) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center w-full px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
    >
      <Icon className="w-4 h-4 mr-3" />
      {children}
    </button>
  );
}

function MobileMenu({ setMobileMenuOpen }: { setMobileMenuOpen: (open: boolean) => void }) {
  const { state, actions } = useApp();
  
  const handleNavigation = (page: string) => {
    actions.setCurrentPage(page);
    setMobileMenuOpen(false);
  };
  
  return (
    <div className="lg:hidden bg-white border-t border-gray-100 py-4">
      <div className="space-y-1">
        {/* Contact */}
        <div className="px-4 py-2 border-b border-gray-100 mb-4">
          <a 
            href="tel:+211704049044"
            className="flex items-center text-blue-600 font-medium"
          >
            <Phone className="w-4 h-4 mr-2" />
            +211 704 049 044
          </a>
        </div>

        {/* Navigation Links */}
        <MobileNavSection title="For Sale">
          <MobileNavLink onClick={() => handleNavigation('houses')}>Houses for Sale</MobileNavLink>
          <MobileNavLink onClick={() => handleNavigation('apartments')}>Apartments for Sale</MobileNavLink>
          <MobileNavLink onClick={() => handleNavigation('land')}>Land for Sale</MobileNavLink>
          <MobileNavLink onClick={() => handleNavigation('new-cars')}>New Cars</MobileNavLink>
          <MobileNavLink onClick={() => handleNavigation('used-cars')}>Used Cars</MobileNavLink>
        </MobileNavSection>

        <MobileNavSection title="For Rent">
          <MobileNavLink onClick={() => handleNavigation('house-rentals')}>Houses for Rent</MobileNavLink>
          <MobileNavLink onClick={() => handleNavigation('apartment-rentals')}>Apartments for Rent</MobileNavLink>
          <MobileNavLink onClick={() => handleNavigation('commercial-rent')}>Commercial Property</MobileNavLink>
        </MobileNavSection>

        <MobileNavLink onClick={() => handleNavigation('airbnb')}>Short Stay</MobileNavLink>
        <MobileNavLink onClick={() => handleNavigation('agents')}>Estate Agents</MobileNavLink>
        
        {state.user.isAdmin && (
          <MobileNavLink onClick={() => handleNavigation('admin')}>Admin</MobileNavLink>
        )}

        {/* List Property Button */}
        <div className="px-4 pt-4">
          <button 
            onClick={() => handleNavigation('list-property')}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            List Property
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileNavSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium"
      >
        {title}
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

function MobileNavLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="block w-full text-left px-8 py-2.5 text-gray-600 hover:text-blue-600 hover:bg-white transition-colors"
    >
      {children}
    </button>
  );
}