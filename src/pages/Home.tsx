import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import CategoryShowcase from '../components/CategoryShowcase';
import FeaturedProducts from '../components/FeaturedProducts';
import SearchBar from '../components/SearchBar';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Search Bar */}
      <section className="py-8 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar Above Carousel */}
          <div className="mb-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="font-heading text-2xl lg:text-3xl font-bold text-neutral-dark mb-2">
                  Find Your Perfect Health Solution
                </h2>
                <p className="text-neutral-medium">
                  Search through our extensive collection of natural health products
                </p>
              </div>
              <SearchBar 
                variant="hero"
                className="w-full" 
                placeholder="Search for products, categories, or health concerns..."
              />
            </div>
          </div>
          
          {/* Hero Carousel */}
          <HeroCarousel />
        </div>
      </section>

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
            Stay Updated with NatureHeal
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Get the latest health tips, product updates, and exclusive offers delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-neutral-dark focus:ring-2 focus:ring-secondary focus:outline-none"
            />
            <button className="px-8 py-3 bg-secondary hover:bg-yellow-500 text-white font-semibold rounded-lg transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}