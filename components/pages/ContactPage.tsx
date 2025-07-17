'use client';

import { useState } from 'react';
import { 
  Phone, Mail, MapPin, Clock, Send, MessageSquare, 
  Facebook, Twitter, Instagram, Linkedin, CheckCircle,
  AlertCircle
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Numbers',
      details: [
        { label: 'Main Office', value: '+211 981 779 330' },
        { label: 'Sales', value: '+211 923 933 655' },
      ],
    },
    {
      icon: Mail,
      title: 'Email Addresses',
      details: [
        { label: 'General Inquiries', value: 'info@jubabuy.com' },
        { label: 'Sales', value: 'sales@jubabuy.com' },
      ],
    },
    {
      icon: MapPin,
      title: 'Office Location',
      details: [
        { label: 'Head Office', value: 'Hai Cinema, Juba' },
        { label: 'South Sudan', value: 'East Africa' },
      ],
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: [
        { label: 'Monday - Friday', value: '8:00 AM - 6:00 PM' },
        { label: 'Saturday', value: '9:00 AM - 2:00 PM' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, url: '#', name: 'Facebook' },
    { icon: Twitter, url: '#', name: 'Twitter' },
    { icon: Instagram, url: '#', name: 'Instagram' },
    { icon: Linkedin, url: '#', name: 'LinkedIn' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null); // Add error state to your component
    
    try {
      // Use the API client to submit the inquiry
      const response = await apiClient.submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Success!
      setSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        setSubmitted(false);
      }, 5000);
      
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // And add error display in your form JSX:
  {error && (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
      <p className="text-red-700">{error}</p>
    </div>
  )}

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl max-w-3xl">
            Get in touch with our team for any inquiries, support, or assistance. 
            We're here to help you with all your real estate and automotive needs.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <div key={idx} className="mb-2">
                      <p className="text-sm text-gray-600">{detail.label}</p>
                      <p className="font-medium text-gray-900">{detail.value}</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Contact Form and Map */}
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent Successfully!</h3>
                  <p className="text-green-700">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="+211 XXX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="property">Property Inquiry</option>
                        <option value="vehicle">Vehicle Inquiry</option>
                        <option value="listing">List Property/Vehicle</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Map Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Find Us</h2>
              <div className="bg-gray-200 rounded-2xl h-96 mb-6 relative overflow-hidden">
                {/* Replace with actual map integration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Interactive Map</p>
                    <p className="text-sm text-gray-500 mt-2">Hai Cinema, Juba, South Sudan</p>
                  </div>
                </div>
              </div>
              
              {/* Social Links */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        aria-label={social.name}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">How can I list my property?</h3>
              <p className="text-gray-600">
                You can list your property by clicking the "List Property" button in the header or visiting our 
                listing page. Fill out the form with your property details and our team will review and approve it.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">What are your service fees?</h3>
              <p className="text-gray-600">
                Our service fees vary depending on the type of listing and services required. Contact our sales 
                team for detailed pricing information tailored to your needs.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">How do you verify listings?</h3>
              <p className="text-gray-600">
                All listings go through a thorough verification process including document checks, physical 
                inspections, and ownership verification to ensure authenticity and protect our users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <MessageSquare className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Need Immediate Assistance?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our customer support team is available during business hours to help you with any urgent matters.
          </p>
          <a
            href="tel:+211981779330"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors font-semibold"
          >
            <Phone className="w-5 h-5 mr-2" />
            Call Us Now
          </a>
        </div>
      </section>
    </div>
  );
}