import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Microscope, 
  Heart, 
  Shield, 
  Apple, 
  ShieldCheck,
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
  Beaker,
  ArrowRight
} from 'lucide-react';

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

// Enhanced categories with better Pexels images and optimized display
const enhancedCategories = [
  {
    id: 'herbal-supplements',
    name: 'Herbal Supplements',
    icon: 'leaf',
    description: 'Premium natural herbal remedies and supplements for optimal wellness',
    productCount: 24,
    image: 'https://images.pexels.com/photos/3735632/pexels-photo-3735632.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    gradient: 'from-green-600 to-emerald-700',
    hoverGradient: 'hover:from-green-700 hover:to-emerald-800'
  },
  {
    id: 'black-soap',
    name: 'African Black Soap',
    icon: 'soap',
    description: 'Authentic handcrafted African black soap for natural skincare',
    productCount: 6,
    image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    gradient: 'from-amber-700 to-orange-800',
    hoverGradient: 'hover:from-amber-800 hover:to-orange-900'
  },
  {
    id: 'shea-butter',
    name: 'Pure Shea Butter',
    icon: 'heart',
    description: 'Raw unrefined shea butter for deep moisturizing and skin protection',
    productCount: 7,
    image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    gradient: 'from-yellow-600 to-amber-700',
    hoverGradient: 'hover:from-yellow-700 hover:to-amber-800'
  },
  {
    id: 'tree-bark-roots',
    name: 'Tree Bark & Roots',
    icon: 'tree-pine',
    description: 'Traditional medicinal tree bark and root extracts',
    productCount: 18,
    image: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    gradient: 'from-emerald-800 to-green-900',
    hoverGradient: 'hover:from-emerald-900 hover:to-green-950'
  },
  {
    id: 'herbal-tonic-mixture',
    name: 'Herbal Tonic Mixtures',
    icon: 'beaker',
    description: 'Comprehensive herbal tonic blends for overall health',
    productCount: 11,
    image: 'https://images.pexels.com/photos/7262800/pexels-photo-7262800.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    gradient: 'from-purple-600 to-indigo-700',
    hoverGradient: 'hover:from-purple-700 hover:to-indigo-800'
  },
  {
    id: 'immune-support',
    name: 'Immune Support',
    icon: 'shield-check',
    description: 'Natural immune system boosters and protective supplements',
    productCount: 16,
    image: 'https://images.pexels.com/photos/2649403/pexels-photo-2649403.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    gradient: 'from-blue-600 to-cyan-700',
    hoverGradient: 'hover:from-blue-700 hover:to-cyan-800'
  }
];

// Lazy loading image component with optimization
const OptimizedImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`w-full h-full object-cover transition-all duration-700 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={{
          filter: isLoaded ? 'none' : 'blur(5px)',
        }}
      />
      
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
          <div className="text-gray-600 text-center">
            <Leaf className="h-8 w-8 mx-auto mb-2" />
            <span className="text-sm">Image unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function CategoryShowcase() {
  return (
    <section className="py-20 bg-gradient-to-br from-neutral-light via-white to-primary/5 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Enhanced Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-green-600 rounded-2xl mb-6 shadow-lg">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          <h2 className="font-heading text-4xl lg:text-6xl font-bold text-neutral-dark mb-6 leading-tight">
            Shop by Category
          </h2>
          <p className="text-xl lg:text-2xl text-neutral-medium max-w-4xl mx-auto leading-relaxed">
            Discover our comprehensive range of natural health products, carefully organized 
            to help you find exactly what you need for your wellness journey.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-8 rounded-full"></div>
        </div>

        {/* Enhanced Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {enhancedCategories.map((category, index) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap];
            
            return (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 hover:scale-105 border border-gray-100"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                {/* Image Container with Overlay */}
                <div className="relative h-64 overflow-hidden">
                  <OptimizedImage
                    src={category.image}
                    alt={`${category.name} products`}
                    className="w-full h-full"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} ${category.hoverGradient} opacity-75 group-hover:opacity-85 transition-all duration-500`} />
                  
                  {/* Floating Icon */}
                  <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md rounded-2xl p-4 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-500 shadow-lg">
                    {IconComponent && <IconComponent className="h-8 w-8 text-white" />}
                  </div>
                  
                  {/* Product Count Badge */}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-gray-800 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {category.productCount} products
                  </div>
                  
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-8 relative">
                  {/* Category Name */}
                  <h3 className="font-heading font-bold text-2xl text-neutral-dark mb-4 group-hover:text-primary transition-colors duration-300">
                    {category.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-neutral-medium mb-6 leading-relaxed line-clamp-2">
                    {category.description}
                  </p>
                  
                  {/* Enhanced CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold text-lg group-hover:text-green-700 transition-colors duration-300">
                      Shop Now
                    </span>
                    
                    {/* Animated Arrow */}
                    <div className="bg-gradient-to-r from-primary to-green-600 group-hover:from-green-600 group-hover:to-green-700 rounded-full p-3 transition-all duration-300 group-hover:scale-110 shadow-lg group-hover:shadow-xl">
                      <ArrowRight className="h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary/30 transition-colors duration-500 pointer-events-none"></div>
              </Link>
            );
          })}
        </div>

        {/* Enhanced Call to Action Section */}
        <div className="text-center bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h3 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-dark mb-6">
              Looking for Something Specific?
            </h3>
            <p className="text-xl text-neutral-medium mb-10 leading-relaxed">
              Explore our complete collection of natural health products or get personalized recommendations from our wellness experts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/products"
                className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-primary to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
              >
                Browse All Products
                <ArrowRight className="ml-3 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              
              <Link
                to="/categories"
                className="group inline-flex items-center px-10 py-5 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1"
              >
                View All Categories
                <Leaf className="ml-3 h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}