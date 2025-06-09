import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Microscope, 
  Heart, 
  Shield, 
  Apple, 
  ShieldCheck,
  ArrowRight,
  Droplets,
  Zap as Soap,
  Recycle,
  Coffee,
  Pill,
  Bone,
  Activity,
  TreePine,
  TrendingDown,
  Zap,
  Beaker
} from 'lucide-react';
import { categories } from '../data/products';

const iconMap = {
  leaf: Leaf,
  microscope: Microscope,
  heart: Heart,
  shield: Shield,
  apple: Apple,
  'shield-check': ShieldCheck,
  droplets: Droplets,
  soap: Soap,
  recycle: Recycle,
  coffee: Coffee,
  pill: Pill,
  bone: Bone,
  activity: Activity,
  'tree-pine': TreePine,
  'trending-down': TrendingDown,
  zap: Zap,
  beaker: Beaker,
};

export default function Categories() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-neutral-dark mb-6">
            Product Categories
          </h1>
          <p className="text-xl text-neutral-medium max-w-3xl mx-auto">
            Explore our comprehensive range of natural health products, carefully organized 
            to help you find exactly what you need for your wellness journey.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap];
            return (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group bg-white rounded-2xl p-8 text-center hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="bg-primary/10 group-hover:bg-primary/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110">
                  {IconComponent && <IconComponent className="h-10 w-10 text-primary" />}
                </div>
                
                <h3 className="font-heading font-bold text-xl text-neutral-dark mb-3 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-neutral-medium mb-4 leading-relaxed">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {category.productCount} products
                  </span>
                  
                  <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform duration-300">
                    <span className="text-sm font-medium mr-1">Shop Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Featured Categories Section */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-card">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-neutral-dark mb-4">
              Why Choose Our Categories?
            </h2>
            <p className="text-lg text-neutral-medium">
              Each category is carefully curated with premium products from trusted sources
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-neutral-dark mb-2">
                Quality Assured
              </h3>
              <p className="text-neutral-medium">
                All products undergo rigorous testing and quality control processes
              </p>
            </div>

            <div className="text-center">
              <div className="bg-secondary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-neutral-dark mb-2">
                Natural & Organic
              </h3>
              <p className="text-neutral-medium">
                Sourced from certified organic farms and sustainable suppliers
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-neutral-dark mb-2">
                Expert Curated
              </h3>
              <p className="text-neutral-medium">
                Selected by healthcare professionals and wellness experts
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="font-heading text-2xl font-bold text-neutral-dark mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-lg text-neutral-medium mb-6">
            Browse all our products or contact our wellness experts for personalized recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors duration-200"
            >
              Contact Experts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}