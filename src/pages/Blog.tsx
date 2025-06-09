import React, { useState } from 'react';
import { Calendar, User, Clock, ArrowRight, Search, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogCategories = [
    { id: 'all', name: 'All Posts' },
    { id: 'nutrition', name: 'Nutrition' },
    { id: 'herbal-medicine', name: 'Herbal Medicine' },
    { id: 'wellness', name: 'Wellness Tips' },
    { id: 'lifestyle', name: 'Healthy Lifestyle' },
    { id: 'research', name: 'Research & Studies' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'The Complete Guide to Turmeric: Benefits, Uses, and Dosage',
      excerpt: 'Discover the powerful anti-inflammatory properties of turmeric and how to incorporate this golden spice into your daily wellness routine.',
      content: 'Turmeric has been used for thousands of years in traditional medicine...',
      author: 'Dr. Sarah Mitchell',
      date: '2024-01-15',
      readTime: '8 min read',
      category: 'herbal-medicine',
      image: 'https://images.pexels.com/photos/2406181/pexels-photo-2406181.jpeg',
      tags: ['turmeric', 'anti-inflammatory', 'natural-remedies']
    },
    {
      id: 2,
      title: '10 Natural Ways to Boost Your Immune System',
      excerpt: 'Learn evidence-based strategies to strengthen your immune system naturally using herbs, nutrition, and lifestyle changes.',
      content: 'Your immune system is your body\'s natural defense mechanism...',
      author: 'Dr. Emily Rodriguez',
      date: '2024-01-12',
      readTime: '6 min read',
      category: 'wellness',
      image: 'https://images.pexels.com/photos/2649403/pexels-photo-2649403.jpeg',
      tags: ['immune-system', 'natural-health', 'prevention']
    },
    {
      id: 3,
      title: 'Ashwagandha: The Ancient Adaptogen for Modern Stress',
      excerpt: 'Explore how this powerful adaptogenic herb can help manage stress, improve energy levels, and support overall well-being.',
      content: 'In our fast-paced modern world, stress has become a constant companion...',
      author: 'Michael Chen',
      date: '2024-01-10',
      readTime: '7 min read',
      category: 'herbal-medicine',
      image: 'https://images.pexels.com/photos/6620777/pexels-photo-6620777.jpeg',
      tags: ['ashwagandha', 'stress-relief', 'adaptogens']
    },
    {
      id: 4,
      title: 'The Science Behind Moringa: Nature\'s Superfood',
      excerpt: 'Uncover the nutritional powerhouse that is moringa and why it\'s considered one of the most nutrient-dense plants on Earth.',
      content: 'Moringa oleifera, often called the "miracle tree," has been used...',
      author: 'Dr. Sarah Mitchell',
      date: '2024-01-08',
      readTime: '5 min read',
      category: 'nutrition',
      image: 'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg',
      tags: ['moringa', 'superfood', 'nutrition']
    },
    {
      id: 5,
      title: 'Creating a Daily Wellness Routine That Actually Works',
      excerpt: 'Build sustainable healthy habits with our practical guide to creating a morning and evening wellness routine.',
      content: 'Consistency is key when it comes to wellness...',
      author: 'Dr. Emily Rodriguez',
      date: '2024-01-05',
      readTime: '9 min read',
      category: 'lifestyle',
      image: 'https://images.pexels.com/photos/3738073/pexels-photo-3738073.jpeg',
      tags: ['wellness-routine', 'healthy-habits', 'lifestyle']
    },
    {
      id: 6,
      title: 'Recent Research: Elderberry\'s Role in Immune Support',
      excerpt: 'A comprehensive review of recent scientific studies on elderberry\'s effectiveness in supporting immune function.',
      content: 'Recent clinical trials have shown promising results...',
      author: 'Michael Chen',
      date: '2024-01-03',
      readTime: '10 min read',
      category: 'research',
      image: 'https://images.pexels.com/photos/3951965/pexels-photo-3951965.jpeg',
      tags: ['elderberry', 'research', 'immune-support']
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts[0];

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
              NatureHeal Health Blog
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Expert insights, research-backed articles, and practical tips for your natural health journey.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Post */}
        <div className="mb-16">
          <h2 className="font-heading text-2xl font-bold text-neutral-dark mb-8">Featured Article</h2>
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="lg:order-2">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-64 lg:h-full object-cover"
                />
              </div>
              <div className="p-8 lg:order-1">
                <div className="flex items-center space-x-4 text-sm text-neutral-medium mb-4">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                    {blogCategories.find(cat => cat.id === featuredPost.category)?.name}
                  </span>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(featuredPost.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {featuredPost.readTime}
                  </div>
                </div>
                <h3 className="font-heading text-2xl font-bold text-neutral-dark mb-4">
                  {featuredPost.title}
                </h3>
                <p className="text-neutral-medium mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-neutral-medium mr-2" />
                    <span className="text-sm text-neutral-medium">{featuredPost.author}</span>
                  </div>
                  <Link
                    to={`/blog/${featuredPost.id}`}
                    className="inline-flex items-center text-primary hover:text-green-700 font-semibold"
                  >
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {blogCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-white text-neutral-dark border border-gray-300 hover:border-primary'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.slice(1).map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-card-hover transition-shadow duration-300">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-neutral-medium mb-3">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                    {blogCategories.find(cat => cat.id === post.category)?.name}
                  </span>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {post.readTime}
                  </div>
                </div>
                
                <h3 className="font-heading text-lg font-semibold text-neutral-dark mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-neutral-medium mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-neutral-medium">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-primary hover:text-green-700 font-semibold text-sm"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-white rounded-lg shadow-card p-8">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-neutral-dark mb-4">
              Stay Updated with Our Latest Articles
            </h2>
            <p className="text-lg text-neutral-medium mb-6">
              Get weekly health tips, research updates, and exclusive content delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="px-8 py-3 bg-primary hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}