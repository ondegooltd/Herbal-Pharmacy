import React, { useState, useMemo } from 'react';
import { Filter, Grid, List, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/products';
import { useSearchParams } from 'react-router-dom';
import { useProductImageOptimization } from '../hooks/useImageOptimization';

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  const [filters, setFilters] = useState({
    category: categoryFilter || '',
    priceRange: '',
    rating: '',
    sortBy: 'name'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }

    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(product => 
        product.price >= min && (max ? product.price <= max : true)
      );
    }

    // Filter by rating
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      result = result.filter(product => product.rating >= minRating);
    }

    // Sort products
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [filters]);

  // Optimize images for filtered products
  const { isLoading: imagesLoading } = useProductImageOptimization(filteredProducts);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      rating: '',
      sortBy: 'name'
    });
  };

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-dark mb-4">
            All Products
          </h1>
          <p className="text-lg text-neutral-medium">
            Discover our complete range of natural health products
          </p>
          
          {/* Image optimization status */}
          {imagesLoading && (
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
              Optimizing product images...
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-neutral-medium hover:bg-gray-50'} transition-colors`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-neutral-medium hover:bg-gray-50'} transition-colors`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-neutral-medium">
              {filteredProducts.length} products
            </span>
            
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg p-6 shadow-card space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-lg">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="font-medium text-neutral-dark mb-3">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={filters.category === ''}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm">All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={filters.category === category.id}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="font-medium text-neutral-dark mb-3">Price Range</h4>
                <div className="space-y-2">
                  {[
                    { label: 'All Prices', value: '' },
                    { label: 'Under $25', value: '0-25' },
                    { label: '$25 - $50', value: '25-50' },
                    { label: '$50 - $100', value: '50-100' },
                    { label: 'Over $100', value: '100-' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        value={option.value}
                        checked={filters.priceRange === option.value}
                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h4 className="font-medium text-neutral-dark mb-3">Rating</h4>
                <div className="space-y-2">
                  {[
                    { label: 'All Ratings', value: '' },
                    { label: '4+ Stars', value: '4' },
                    { label: '3+ Stars', value: '3' },
                    { label: '2+ Stars', value: '2' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value={option.value}
                        checked={filters.rating === option.value}
                        onChange={(e) => handleFilterChange('rating', e.target.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-neutral-medium">No products found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    priority={index < 6} // Prioritize first 6 images
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}