import React from 'react';
import { 
  Award, 
  Users, 
  Leaf, 
  Shield, 
  Heart, 
  Globe,
  CheckCircle,
  Star
} from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Leaf,
      title: 'Natural & Organic',
      description: 'We source only the finest organic and natural ingredients from certified suppliers worldwide.'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Every product undergoes rigorous testing and quality control to ensure safety and efficacy.'
    },
    {
      icon: Heart,
      title: 'Customer Care',
      description: 'Your health and satisfaction are our top priorities. We provide personalized support and guidance.'
    },
    {
      icon: Globe,
      title: 'Sustainability',
      description: 'We are committed to sustainable practices and supporting eco-friendly farming communities.'
    }
  ];

  const achievements = [
    { number: '50,000+', label: 'Happy Customers' },
    { number: '500+', label: 'Natural Products' },
    { number: '15+', label: 'Years Experience' },
    { number: '99.8%', label: 'Customer Satisfaction' }
  ];

  const certifications = [
    'FDA Registered Facility',
    'GMP Certified',
    'Organic Certified',
    'Third-Party Tested',
    'ISO 9001 Certified',
    'Halal Certified'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="font-heading text-4xl lg:text-6xl font-bold mb-6">
              About NatureHeal
            </h1>
            <p className="text-xl lg:text-2xl opacity-90 max-w-3xl mx-auto">
              Dedicated to bringing you the finest natural health products and herbal remedies 
              from around the world for over 15 years.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-16 bg-neutral-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-dark mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-lg text-neutral-medium">
                <p>
                  Founded in 2009 by Dr. Sarah Mitchell, a naturopathic physician with a passion 
                  for holistic healing, NatureHeal began as a small clinic offering natural 
                  health consultations and herbal remedies.
                </p>
                <p>
                  After witnessing the transformative power of natural medicine in her practice, 
                  Dr. Mitchell envisioned making high-quality herbal supplements accessible to 
                  everyone. What started as a local pharmacy has grown into a trusted online 
                  marketplace serving customers worldwide.
                </p>
                <p>
                  Today, we continue to honor our founding principles: providing pure, potent, 
                  and ethically sourced natural health products while maintaining the personal 
                  touch and expert guidance that sets us apart.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3735632/pexels-photo-3735632.jpeg"
                alt="Natural herbs and supplements"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-secondary text-white p-6 rounded-lg shadow-lg">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-dark mb-4">
              Our Values
            </h2>
            <p className="text-lg text-neutral-medium max-w-2xl mx-auto">
              These core values guide everything we do and shape our commitment to your health and wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-neutral-dark mb-3">
                    {value.title}
                  </h3>
                  <p className="text-neutral-medium">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
              Our Achievements
            </h2>
            <p className="text-xl opacity-90">
              Numbers that reflect our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-secondary mb-2">
                  {achievement.number}
                </div>
                <div className="text-lg opacity-90">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-neutral-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-dark mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-neutral-medium max-w-2xl mx-auto">
              Our dedicated team of health professionals and experts are here to guide you on your wellness journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Dr. Sarah Mitchell',
                role: 'Founder & Chief Medical Officer',
                image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg',
                bio: 'Naturopathic physician with 20+ years of experience in holistic medicine.'
              },
              {
                name: 'Michael Chen',
                role: 'Head of Quality Assurance',
                image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg',
                bio: 'Biochemist ensuring the highest standards in product testing and quality control.'
              },
              {
                name: 'Dr. Emily Rodriguez',
                role: 'Clinical Herbalist',
                image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg',
                bio: 'Expert in traditional herbal medicine with a focus on women\'s health.'
              }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-card p-6 text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-heading font-semibold text-lg text-neutral-dark mb-1">
                  {member.name}
                </h3>
                <p className="text-primary font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-neutral-medium text-sm">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-dark mb-4">
              Certifications & Standards
            </h2>
            <p className="text-lg text-neutral-medium max-w-2xl mx-auto">
              We maintain the highest industry standards and certifications to ensure product quality and safety.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-neutral-light rounded-lg p-4 text-center">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-neutral-dark">
                  {cert}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-gradient-to-r from-primary to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-6">
            Our Mission
          </h2>
          <p className="text-xl lg:text-2xl opacity-90 leading-relaxed">
            To empower individuals on their wellness journey by providing access to the highest quality 
            natural health products, expert guidance, and personalized care that honors the healing 
            wisdom of nature while embracing modern scientific understanding.
          </p>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-neutral-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-dark mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-neutral-medium">
              Real stories from real customers who have transformed their health with our products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Jennifer L.',
                rating: 5,
                text: 'NatureHeal has completely transformed my approach to health. The quality of their products is unmatched, and the customer service is exceptional.'
              },
              {
                name: 'Robert M.',
                rating: 5,
                text: 'I\'ve been a customer for over 5 years. The consistency and purity of their supplements have helped me maintain my health naturally.'
              },
              {
                name: 'Maria S.',
                rating: 5,
                text: 'The expert guidance I received helped me find the perfect products for my needs. I couldn\'t be happier with the results!'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-card p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-secondary fill-current" />
                  ))}
                </div>
                <p className="text-neutral-medium mb-4 italic">
                  "{testimonial.text}"
                </p>
                <p className="font-semibold text-neutral-dark">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}