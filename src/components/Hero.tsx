import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Award } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-primary to-green-600 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 z-10 relative">
            <h1 className="font-heading text-4xl lg:text-6xl font-bold leading-tight">
              Natural Health,
              <span className="text-secondary"> Delivered</span>
            </h1>
            <p className="text-xl lg:text-2xl font-body opacity-90">
              Premium herbal supplements and natural remedies from trusted sources worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-3 bg-secondary text-white font-semibold rounded-lg hover:bg-yellow-500 transition-colors duration-200"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-colors duration-200"
              >
                Learn More
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-secondary" />
                <span className="text-sm font-medium">FDA Registered</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-secondary" />
                <span className="text-sm font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-secondary" />
                <span className="text-sm font-medium">Quality Assured</span>
              </div>
            </div>
          </div>
          
          <div className="relative lg:mt-0 mt-8">
            <img
              src="https://images.pexels.com/photos/3735632/pexels-photo-3735632.jpeg"
              alt="Natural herbs and supplements"
              className="rounded-lg shadow-2xl w-full h-auto"
            />
            {/* Fixed positioning for promotional banner */}
            <div className="absolute -bottom-6 -right-6 bg-white text-primary p-6 rounded-lg shadow-xl max-w-[200px] z-20">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">20% OFF</div>
                <div className="text-sm font-medium text-neutral-dark">First Order</div>
                <div className="text-xs text-neutral-medium mt-1">Use code: WELCOME20</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}