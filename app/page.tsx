'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HomePage from '@/components/pages/HomePage';
import AdminDashboard from '@/components/admin/AdminDashboard';
import LoginPage from '@/components/auth/LoginForm';
import ListingsPage from '@/components/pages/ListingsPage';
import { useApp } from '@/contexts/AppContext';

export default function App() {
  const { state } = useApp();

  const renderPage = () => {
    switch(state.ui.currentPage) {
      case 'home':
        return <HomePage />;
      case 'new-cars':
        return <ListingsPage category="cars" title="New Cars for Sale" />;
      case 'used-cars':
        return <ListingsPage category="cars" title="Used Cars for Sale" />;
      case 'rentals':
        return <ListingsPage category="rentals" title="Properties for Rent" />;
      case 'houses':
        return <ListingsPage category="properties" title="Houses for Sale" />;
      case 'land':
        return <ListingsPage category="land" title="Land & Plots for Sale" />;
      case 'airbnb':
        return <ListingsPage category="airbnb" title="Short Stay & Airbnb" />;
      case 'admin':
        return state.user.isAdmin ? <AdminDashboard /> : <LoginPage />;
      case 'login':
        return <LoginPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <>
      <Header />
      <main>{renderPage()}</main>
      <Footer />
    </>
  );
}