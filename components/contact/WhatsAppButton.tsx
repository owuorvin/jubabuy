// components/contact/WhatsAppButton.tsx
'use client';

import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phone: string;
  message?: string;
  listing?: {
    title: string;
    price: number;
    id: string;
  };
}

export default function WhatsAppButton({ phone, message, listing }: WhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    let text = message || 'Hello, I am interested in your listing on JubaBuy.';
    
    if (listing) {
      text = `Hello, I am interested in "${listing.title}" (ID: ${listing.id}) listed for $${listing.price.toLocaleString()} on JubaBuy.`;
    }
    
    // Format phone number (remove spaces, dashes, etc.)
    const formattedPhone = phone.replace(/\D/g, '');
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
    
    // Open in new window
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
    >
      <MessageCircle className="w-5 h-5 mr-2" />
      WhatsApp
    </button>
  );
}