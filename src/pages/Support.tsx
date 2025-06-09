import React, { useState } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  User, 
  Package, 
  CreditCard, 
  Truck,
  AlertCircle,
  CheckCircle,
  Send,
  FileText,
  Download
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Support() {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'general',
    priority: 'medium',
    subject: '',
    description: '',
    orderNumber: ''
  });

  const supportCategories = [
    { id: 'general', name: 'General Inquiry', icon: MessageCircle },
    { id: 'order', name: 'Order Support', icon: Package },
    { id: 'payment', name: 'Payment Issues', icon: CreditCard },
    { id: 'shipping', name: 'Shipping & Delivery', icon: Truck },
    { id: 'product', name: 'Product Questions', icon: FileText },
    { id: 'account', name: 'Account Help', icon: User }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle ticket submission
    alert('Support ticket submitted successfully! We\'ll get back to you within 24 hours.');
    setTicketForm({
      name: '',
      email: '',
      phone: '',
      category: 'general',
      priority: 'medium',
      subject: '',
      description: '',
      orderNumber: ''
    });
  };

  const updateTicketForm = (field: string, value: string) => {
    setTicketForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
              Customer Support
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              We're here to help! Get the support you need for your wellness journey.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Options */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card p-6 mb-8">
              <h2 className="font-heading text-xl font-semibold text-neutral-dark mb-6">
                Get Immediate Help
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-dark">Live Chat</h3>
                      <p className="text-sm text-neutral-medium">Average response: 2 min</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600 font-medium">Online</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-dark">Phone Support</h3>
                    <p className="text-sm text-neutral-medium mb-2">1-800-NATURAL (628-8725)</p>
                    <div className="text-xs text-neutral-medium">
                      <div className="flex items-center mb-1">
                        <Clock className="h-3 w-3 mr-1" />
                        Mon-Fri: 8AM-8PM GMT
                      </div>
                      <div className="flex items-center mb-1">
                        <Clock className="h-3 w-3 mr-1" />
                        Sat: 9AM-6PM GMT
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Sun: 10AM-4PM GMT
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-dark">Email Support</h3>
                    <p className="text-sm text-neutral-medium">support@natureheal.com</p>
                    <p className="text-xs text-neutral-medium">Response within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h3 className="font-heading text-lg font-semibold text-neutral-dark mb-4">
                Quick Links
              </h3>
              <div className="space-y-3">
                <Link to="/faq" className="flex items-center text-primary hover:text-green-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Frequently Asked Questions
                </Link>
                <Link to="/shipping" className="flex items-center text-primary hover:text-green-700">
                  <Truck className="h-4 w-4 mr-2" />
                  Shipping Information
                </Link>
                <Link to="/returns" className="flex items-center text-primary hover:text-green-700">
                  <Download className="h-4 w-4 mr-2" />
                  Returns & Refunds
                </Link>
                <Link to="/account" className="flex items-center text-primary hover:text-green-700">
                  <User className="h-4 w-4 mr-2" />
                  My Account
                </Link>
              </div>
            </div>
          </div>

          {/* Support Ticket Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-card p-8">
              <h2 className="font-heading text-2xl font-semibold text-neutral-dark mb-6">
                Submit a Support Ticket
              </h2>
              
              {/* Category Selection */}
              <div className="mb-8">
                <h3 className="font-medium text-gray-900 mb-4">What can we help you with?</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {supportCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          updateTicketForm('category', category.id);
                        }}
                        className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all duration-200 ${
                          selectedCategory === category.id
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 hover:border-gray-300 text-neutral-dark'
                        }`}
                      >
                        <Icon className="h-6 w-6 mb-2" />
                        <span className="text-sm font-medium text-center">{category.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={ticketForm.name}
                      onChange={(e) => updateTicketForm('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={ticketForm.email}
                      onChange={(e) => updateTicketForm('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={ticketForm.phone}
                      onChange={(e) => updateTicketForm('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) => updateTicketForm('priority', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="low">Low - General question</option>
                      <option value="medium">Medium - Need assistance</option>
                      <option value="high">High - Urgent issue</option>
                      <option value="critical">Critical - Service disruption</option>
                    </select>
                  </div>
                </div>

                {/* Order Number (conditional) */}
                {(selectedCategory === 'order' || selectedCategory === 'shipping' || selectedCategory === 'payment') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Number
                    </label>
                    <input
                      type="text"
                      value={ticketForm.orderNumber}
                      onChange={(e) => updateTicketForm('orderNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., #12345"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketForm.subject}
                    onChange={(e) => updateTicketForm('subject', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={ticketForm.description}
                    onChange={(e) => updateTicketForm('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Please provide as much detail as possible about your issue..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Support Ticket
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-card p-6 text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-neutral-dark mb-2">All Systems Operational</h3>
            <p className="text-sm text-neutral-medium">Website, payments, and shipping are running smoothly</p>
          </div>

          <div className="bg-white rounded-lg shadow-card p-6 text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-neutral-dark mb-2">Average Response Time</h3>
            <p className="text-sm text-neutral-medium">Live Chat: 2 minutes | Email: 4 hours</p>
          </div>

          <div className="bg-white rounded-lg shadow-card p-6 text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-neutral-dark mb-2">Customer Satisfaction</h3>
            <p className="text-sm text-neutral-medium">99.8% of customers rate our support as excellent</p>
          </div>
        </div>
      </div>
    </div>
  );
}