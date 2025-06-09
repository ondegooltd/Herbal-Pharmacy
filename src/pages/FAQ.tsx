import React, { useState } from 'react';
import { ChevronDown, Search, MessageCircle, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqCategories = [
    {
      title: 'Orders & Shipping',
      faqs: [
        {
          question: 'What are your shipping options and delivery times?',
          answer: 'We offer standard delivery (3-5 business days within Ghana, free) and express delivery (1-2 business days for Accra & Kumasi only, GH₵ 25.00). Orders placed before 2 PM GMT ship the same day.'
        },
        {
          question: 'Do you ship outside Ghana?',
          answer: 'Currently, we only ship within Ghana. We are working on expanding our delivery services to other West African countries. Please subscribe to our newsletter to be notified when international shipping becomes available.'
        },
        {
          question: 'How can I track my order?',
          answer: 'Once your order ships, you\'ll receive a tracking number via SMS and email. You can also track your orders in your account dashboard under "Order History".'
        },
        {
          question: 'What happens if my order is delayed?',
          answer: 'If your order is delayed beyond the estimated delivery time, we will contact you immediately with an updated timeline. You can also contact our customer service team for real-time updates.'
        }
      ]
    },
    {
      title: 'Products & Quality',
      faqs: [
        {
          question: 'Are your products organic and natural?',
          answer: 'Yes, all our products are made from natural ingredients. Many are certified organic, and we clearly label all certifications on product pages. We source from trusted suppliers and conduct rigorous quality testing.'
        },
        {
          question: 'Do I need a prescription for your products?',
          answer: 'Most of our products are dietary supplements that don\'t require a prescription. Products that do require one are clearly marked with a prescription upload option during checkout.'
        },
        {
          question: 'How do I know which products are right for me?',
          answer: 'Each product page includes detailed information about benefits, usage, and ingredients. For personalized recommendations, you can contact our wellness experts or use our live chat feature.'
        },
        {
          question: 'Are your products tested for safety?',
          answer: 'Yes, all our products undergo rigorous third-party testing for purity, potency, and safety. We maintain FDA registration and follow GMP (Good Manufacturing Practice) standards.'
        }
      ]
    },
    {
      title: 'Payments & Pricing',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept Mobile Money (MTN, Vodafone, AirtelTigo), Credit/Debit Cards (Visa, Mastercard, Verve), and PayPal. All payments are processed securely with 256-bit SSL encryption.'
        },
        {
          question: 'Are prices displayed in Ghana Cedis?',
          answer: 'Yes, all prices on our website are displayed in Ghana Cedis (GH₵). We automatically convert USD pricing to local currency for your convenience.'
        },
        {
          question: 'Do you offer discounts or promotions?',
          answer: 'Yes! New customers get 20% off their first order with code WELCOME20. We also offer seasonal promotions, bulk discounts, and loyalty rewards. Subscribe to our newsletter for exclusive offers.'
        },
        {
          question: 'Is there a minimum order amount?',
          answer: 'There is no minimum order amount. However, orders over GH₵ 150 qualify for free express delivery within Accra and Kumasi.'
        }
      ]
    },
    {
      title: 'Returns & Refunds',
      faqs: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day money-back guarantee on unopened products. If you\'re not satisfied, contact us within 30 days of delivery for a full refund or exchange.'
        },
        {
          question: 'Can I return opened products?',
          answer: 'For safety and hygiene reasons, we cannot accept returns of opened consumable products unless there is a quality issue. Unopened products in original packaging can be returned within 30 days.'
        },
        {
          question: 'How long does it take to process refunds?',
          answer: 'Refunds are processed within 3-5 business days after we receive your returned items. Mobile Money refunds are typically instant, while card refunds may take 5-10 business days to appear on your statement.'
        },
        {
          question: 'Who pays for return shipping?',
          answer: 'If the return is due to our error (wrong item, damaged product), we cover return shipping costs. For other returns, customers are responsible for return shipping fees.'
        }
      ]
    },
    {
      title: 'Account & Technical',
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'You can create an account by clicking "Sign Up" in the top navigation. You can register using either your email address or phone number. Account creation gives you access to order tracking, wishlist, and exclusive member benefits.'
        },
        {
          question: 'I forgot my password. How can I reset it?',
          answer: 'Click "Forgot Password" on the sign-in page and enter your email or phone number. You\'ll receive a password reset link via email or SMS within a few minutes.'
        },
        {
          question: 'Can I change my delivery address after placing an order?',
          answer: 'You can change your delivery address within 2 hours of placing your order by contacting our customer service team. After this time, address changes may not be possible if the order has already been processed.'
        },
        {
          question: 'Is my personal information secure?',
          answer: 'Yes, we use industry-standard security measures including SSL encryption, secure payment processing, and strict data protection policies. We never share your personal information with third parties without your consent.'
        }
      ]
    }
  ];

  const allFaqs = faqCategories.flatMap(category => 
    category.faqs.map(faq => ({ ...faq, category: category.title }))
  );

  const filteredFaqs = searchQuery 
    ? allFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allFaqs;

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Find quick answers to common questions about our products, shipping, and services.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            />
            <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
          </div>
        </div>

        {/* FAQ Content */}
        {searchQuery ? (
          /* Search Results */
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-neutral-dark mb-6">
              Search Results ({filteredFaqs.length})
            </h2>
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg text-neutral-medium">No results found for "{searchQuery}"</p>
                <p className="text-neutral-medium">Try different keywords or browse categories below</p>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <span className="font-medium text-neutral-dark">{faq.question}</span>
                      <span className="block text-sm text-primary mt-1">{faq.category}</span>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`} />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-neutral-medium leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          /* Category View */
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-lg shadow-card p-6">
                <h2 className="font-heading text-xl font-semibold text-neutral-dark mb-6">
                  {category.title}
                </h2>
                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex; // Unique index
                    return (
                      <div key={faqIndex} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === globalIndex ? null : globalIndex)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-neutral-dark">{faq.question}</span>
                          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${
                            expandedFaq === globalIndex ? 'rotate-180' : ''
                          }`} />
                        </button>
                        {expandedFaq === globalIndex && (
                          <div className="px-6 pb-4">
                            <p className="text-neutral-medium leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-16 bg-white rounded-lg shadow-card p-8">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl font-semibold text-neutral-dark mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg text-neutral-medium">
              Our customer support team is here to help you with any questions not covered above.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/contact"
              className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all duration-200"
            >
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-neutral-dark mb-2">Live Chat</h3>
              <p className="text-sm text-neutral-medium text-center">
                Get instant help from our wellness experts
              </p>
            </Link>

            <a
              href="tel:+233800628872"
              className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all duration-200"
            >
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-neutral-dark mb-2">Call Us</h3>
              <p className="text-sm text-neutral-medium text-center">
                1-800-NATURAL (628-8725)
              </p>
            </a>

            <a
              href="mailto:support@natureheal.com"
              className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all duration-200"
            >
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-neutral-dark mb-2">Email Us</h3>
              <p className="text-sm text-neutral-medium text-center">
                support@natureheal.com
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}