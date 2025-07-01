import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/contexts/AppContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aries Ltd - Premium Real Estate & Automotive',
  description: 'Your trusted partner for real estate and automotive solutions in Juba, South Sudan',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}