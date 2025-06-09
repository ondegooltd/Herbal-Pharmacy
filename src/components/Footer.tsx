import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="font-heading font-bold text-xl">NatureHeal</span>
            </div>
            <p className="text-gray-300">
              Your trusted partner in natural health and wellness. Premium herbal supplements and remedies delivered to your door.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-300 hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/categories" className="text-gray-300 hover:text-primary transition-colors">Categories</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-primary transition-colors">Health Blog</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-300 hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/support" className="text-gray-300 hover:text-primary transition-colors">Support</Link></li>
              <li><Link to="/policy" className="text-gray-300 hover:text-primary transition-colors">Shipping Info</Link></li>
              <li><Link to="/policy" className="text-gray-300 hover:text-primary transition-colors">Returns</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-primary transition-colors">Live Chat</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-gray-300">support@natureheal.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-gray-300">1-800-NATURAL</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-gray-300">123 Wellness St, Health City, HC 12345</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 NatureHeal. All rights reserved. | 
            <Link to="/policy" className="text-primary hover:underline ml-1">Privacy Policy</Link> | 
            <Link to="/terms" className="text-primary hover:underline ml-1">Terms of Service</Link> |
            <Link to="/policy" className="text-primary hover:underline ml-1">Ghana Delivery Policy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}