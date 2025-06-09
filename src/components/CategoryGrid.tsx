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
  Beaker
} from 'lucide-react';
import { categories } from '../data/products';
import ImageOptimizer from './ImageOptimizer';

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

export default function CategoryGrid() {
  return (
    <section className="py-16 bg-neutral-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-dark mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-neutral-medium max-w-2xl mx-auto">
            Discover our comprehensive range of natural health products, carefully curated for your wellness journey.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap];
            return (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group bg-white rounded-xl p-6 text-center hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="bg-primary/10 group-hover:bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110">
                  {IconComponent && <IconComponent className="h-8 w-8 text-primary" />}
                </div>
                <h3 className="font-heading font-semibold text-neutral-dark mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-neutral-medium mb-2">
                  {category.description}
                </p>
                <span className="text-xs text-primary font-medium">
                  {category.productCount} products
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}