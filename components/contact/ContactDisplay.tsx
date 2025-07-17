// components/contact/ContactDisplay.tsx
'use client';

import { Phone, Mail, MessageSquare, Shield, User } from 'lucide-react';
import { useState } from 'react';

interface ContactDisplayProps {
  listing: {
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    isPaidListing?: boolean;
    displayOwnContact?: boolean;
    agentId?: string;
    agent?: {
      name: string;
      email: string;
      phone: string;
      avatar?: string;
    };
  };
  showInquiryForm?: boolean;
}

export default function ContactDisplay({ listing, showInquiryForm = true }: ContactDisplayProps) {
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Determine which contact to display
  const shouldShowOwnContact = listing.isPaidListing && listing.displayOwnContact;
  
  const displayContact = shouldShowOwnContact ? {
    name: listing.contactName || 'Contact Person',
    email: listing.contactEmail || '',
    phone: listing.contactPhone || '',
    isPaid: true,
  } : {
    name: listing.agent?.name || 'JubaBuy Sales Team',
    email: listing.agent?.email || 'sales@jubabuy.com',
    phone: listing.agent?.phone || '+211 981 779 330',
    isPaid: false,
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Submit inquiry
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setShowInquiry(false);
        setInquiryForm({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
      }, 3000);
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
        {shouldShowOwnContact && (
          <div className="flex items-center text-green-600 text-sm">
            <Shield className="w-4 h-4 mr-1" />
            <span>Verified Seller</span>
          </div>
        )}
      </div>

      {/* Agent/Contact Info */}
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
            {displayContact.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{displayContact.name}</h4>
            {!displayContact.isPaid && (
              <p className="text-sm text-gray-500">Official JubaBuy Agent</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <a 
            href={`tel:${displayContact.phone}`}
            className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Phone className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Call</p>
              <p className="font-semibold text-gray-900">{displayContact.phone}</p>
            </div>
          </a>

          <a 
            href={`mailto:${displayContact.email}`}
            className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Mail className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-gray-900">{displayContact.email}</p>
            </div>
          </a>

          {showInquiryForm && (
            <button
              onClick={() => setShowInquiry(!showInquiry)}
              className="w-full flex items-center justify-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-purple-600 mr-3" />
              <span className="font-semibold text-gray-900">Send Inquiry</span>
            </button>
          )}
        </div>
      </div>

      {/* Inquiry Form */}
      {showInquiry && (
        <div className="mt-6 pt-6 border-t">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Inquiry Sent!</h4>
              <p className="text-gray-600">We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email *
                </label>
                <input
                  type="email"
                  value={inquiryForm.email}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Phone *
                </label>
                <input
                  type="tel"
                  value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="I'm interested in this listing..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send Inquiry'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Info Note */}
      {!shouldShowOwnContact && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This listing is managed by JubaBuy Ltd. Contact us for viewing arrangements and negotiations.
          </p>
        </div>
      )}
    </div>
  );
}

