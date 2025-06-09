import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronDown
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [showChat, setShowChat] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      category: 'general'
    });
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const faqs = [
    {
      question: 'What are your shipping options and delivery times?',
      answer: 'We offer standard shipping (5-7 business days, free) and express shipping (2-3 business days, $15.99). Orders placed before 2 PM EST ship the same day.'
    },
    {
      question: 'Are your products organic and natural?',
      answer: 'Yes, all our products are made from natural ingredients. Many are certified organic, and we clearly label all certifications on product pages.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Currently, we ship within the United States and Canada. We\'re working on expanding to more countries soon.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day money-back guarantee on all products. If you\'re not satisfied, contact us for a full refund or exchange.'
    },
    {
      question: 'Do I need a prescription for your products?',
      answer: 'Most of our products are dietary supplements that don\'t require a prescription. Products that do require one are clearly marked and have an upload option.'
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track orders in your account dashboard.'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Have questions about our products or need personalized health advice? 
              Our team of experts is here to help you on your wellness journey.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card p-6 mb-8">
              <h2 className="font-heading text-xl font-semibold text-neutral-dark mb-6">
                Contact Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-dark">Phone</h3>
                    <p className="text-neutral-medium">1-800-NATURAL (628-8725)</p>
                    <p className="text-sm text-neutral-medium">Toll-free within US & Canada</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-dark">Email</h3>
                    <p className="text-neutral-medium">support@natureheal.com</p>
                    <p className="text-sm text-neutral-medium">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-dark">Address</h3>
                    <p className="text-neutral-medium">
                      123 Wellness Street<br />
                      Health City, HC 12345<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-dark">Business Hours</h3>
                    <div className="text-neutral-medium text-sm">
                      <p>Monday - Friday: 8:00 AM - 8:00 PM EST</p>
                      <p>Saturday: 9:00 AM - 6:00 PM EST</p>
                      <p>Sunday: 10:00 AM - 4:00 PM EST</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-neutral-dark mb-4">Follow Us</h3>
                <div className="flex space-x-3">
                  <a href="#" className="bg-primary/10 p-2 rounded-lg text-primary hover:bg-primary hover:text-white transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="bg-primary/10 p-2 rounded-lg text-primary hover:bg-primary hover:text-white transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="bg-primary/10 p-2 rounded-lg text-primary hover:bg-primary hover:text-white transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="bg-primary/10 p-2 rounded-lg text-primary hover:bg-primary hover:text-white transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Live Chat */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-semibold text-neutral-dark">
                  Live Chat Support
                </h3>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600 font-medium">Online</span>
                </div>
              </div>
              <p className="text-neutral-medium mb-4">
                Get instant help from our wellness experts. Average response time: 2 minutes.
              </p>
              <button
                onClick={() => setShowChat(true)}
                className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Live Chat
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="font-heading text-2xl font-semibold text-neutral-dark mb-6">
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => updateFormData('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="product">Product Question</option>
                      <option value="order">Order Support</option>
                      <option value="health">Health Consultation</option>
                      <option value="wholesale">Wholesale Inquiry</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => updateFormData('subject', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => updateFormData('message', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Please provide as much detail as possible..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="font-heading text-2xl font-semibold text-neutral-dark mb-6 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-neutral-dark">{faq.question}</span>
                    <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`} />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-neutral-medium">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="font-heading text-2xl font-semibold text-neutral-dark mb-6 text-center">
              Visit Our Store
            </h2>
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Interactive map would be integrated here</p>
                <p className="text-sm text-gray-400">123 Wellness Street, Health City, HC 12345</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-96">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Live Chat Support</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="p-4 h-64 overflow-y-auto">
              <div className="space-y-3">
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm">Hello! How can I help you today?</p>
                  <span className="text-xs text-gray-500">Support Agent - Just now</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}