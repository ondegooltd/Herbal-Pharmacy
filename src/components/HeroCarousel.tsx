import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const carouselSlides = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/3735632/pexels-photo-3735632.jpeg',
    title: 'Premium Herbal Supplements',
    subtitle: 'Natural wellness solutions for your health journey',
    description: 'Discover our collection of organic herbs and natural remedies sourced from trusted suppliers worldwide.',
    buttonText: 'Shop Supplements',
    buttonLink: '/products?category=herbal-supplements',
    overlay: 'from-black/60 to-black/30'
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg',
    title: 'Authentic African Black Soap',
    subtitle: 'Traditional skincare with modern benefits',
    description: 'Experience the cleansing power of authentic African black soap, handcrafted using traditional methods.',
    buttonText: 'Explore Black Soap',
    buttonLink: '/products?category=black-soap',
    overlay: 'from-green-900/60 to-green-700/30'
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/2649403/pexels-photo-2649403.jpeg',
    title: 'Pure Shea Butter Collection',
    subtitle: 'Nourish your skin naturally',
    description: 'Premium quality shea butter products for deep moisturizing and skin protection.',
    buttonText: 'Shop Shea Butter',
    buttonLink: '/products?category=shea-butter',
    overlay: 'from-yellow-900/60 to-yellow-700/30'
  },
  {
    id: 4,
    image: 'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg',
    title: 'Tree Bark & Roots Collection',
    subtitle: 'Traditional medicinal plants',
    description: 'Authentic tree bark and root extracts used in traditional medicine for centuries.',
    buttonText: 'Explore Traditional Medicine',
    buttonLink: '/products?category=tree-bark-roots',
    overlay: 'from-brown-900/60 to-brown-700/30'
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-2xl shadow-2xl">
      {/* Slides */}
      <div className="relative w-full h-full">
        {carouselSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />
            
            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl text-white">
                  <h1 className="font-heading text-4xl lg:text-6xl font-bold leading-tight mb-4 animate-fade-in">
                    {slide.title}
                  </h1>
                  <h2 className="text-xl lg:text-2xl font-medium mb-4 text-secondary animate-fade-in-delay-1">
                    {slide.subtitle}
                  </h2>
                  <p className="text-lg lg:text-xl opacity-90 mb-8 leading-relaxed animate-fade-in-delay-2">
                    {slide.description}
                  </p>
                  
                  <Link
                    to={slide.buttonLink}
                    className="inline-flex items-center px-8 py-4 bg-secondary hover:bg-yellow-500 text-white font-bold text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-fade-in-delay-3"
                  >
                    {slide.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 group"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-secondary scale-125 shadow-lg' 
                : 'bg-white/50 hover:bg-white/70 hover:scale-110'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-4 right-4">
        <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-400' : 'bg-gray-400'} animate-pulse`} />
      </div>
    </div>
  );
}