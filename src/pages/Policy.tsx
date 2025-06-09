import React, { useState } from 'react';
import { FileText, Shield, Truck, AlertTriangle, Phone } from 'lucide-react';

export default function Policy() {
  const [activeSection, setActiveSection] = useState('terms');

  const sections = [
    { id: 'terms', name: 'Terms & Conditions', icon: FileText },
    { id: 'privacy', name: 'Privacy Policy', icon: Shield },
    { id: 'ghana-delivery', name: 'Ghana Delivery Policy', icon: Truck },
    { id: 'refund', name: 'Refund Policy', icon: AlertTriangle }
  ];

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
              Policies & Terms
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Important information about our terms of service, privacy practices, and delivery policies.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card p-6 sticky top-24">
              <h2 className="font-heading text-lg font-semibold text-neutral-dark mb-4">
                Policy Sections
              </h2>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary text-white'
                          : 'text-neutral-dark hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm">{section.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-card p-8">
              {/* Terms & Conditions */}
              {activeSection === 'terms' && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-neutral-dark mb-6">
                    Terms and Conditions
                  </h2>
                  <div className="prose prose-lg max-w-none text-neutral-medium">
                    <p className="text-sm text-gray-500 mb-6">Last updated: January 1, 2024</p>
                    
                    <h3 className="font-semibold text-neutral-dark">1. Acceptance of Terms</h3>
                    <p>
                      By accessing and using NatureHeal's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>

                    <h3 className="font-semibold text-neutral-dark">2. Product Information</h3>
                    <p>
                      We strive to provide accurate product information, including descriptions, ingredients, and pricing. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
                    </p>

                    <h3 className="font-semibold text-neutral-dark">3. Orders and Payment</h3>
                    <p>
                      All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason. Payment must be received before products are shipped.
                    </p>

                    <h3 className="font-semibold text-neutral-dark">4. Shipping and Delivery</h3>
                    <p>
                      Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers or circumstances beyond our control.
                    </p>

                    <h3 className="font-semibold text-neutral-dark">5. Returns and Refunds</h3>
                    <p>
                      Please refer to our specific return and refund policies for detailed information about returns, exchanges, and refunds.
                    </p>

                    <h3 className="font-semibold text-neutral-dark">6. Limitation of Liability</h3>
                    <p>
                      NatureHeal shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                    </p>

                    <h3 className="font-semibold text-neutral-dark">7. Contact Information</h3>
                    <p>
                      If you have any questions about these Terms and Conditions, please contact us at legal@natureheal.com or call 1-800-NATURAL.
                    </p>
                  </div>
                </div>
              )}

              {/* Privacy Policy */}
              {activeSection === 'privacy' && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-neutral-dark mb-6">
                    Privacy Policy
                  </h2>
                  <div className="prose prose-lg max-w-none text-neutral-medium">
                    <p className="text-sm text-gray-500 mb-6">Last updated: January 1, 2024</p>
                    
                    <h3 className="font-semibold text-neutral-dark">Information We Collect</h3>
                    <p>
                      We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, phone number, shipping address, and payment information.
                    </p>

                    <h3 className="font-semibold text-neutral-dark">How We Use Your Information</h3>
                    <ul>
                      <li>Process and fulfill your orders</li>
                      <li>Communicate with you about your orders and account</li>
                      <li>Provide customer support</li>
                      <li>Send you marketing communications (with your consent)</li>
                      <li>Improve our products and services</li>
                    </ul>

                    <h3 className="font-semibold text-neutral-dark">Information Sharing</h3>
                    <p>
                      We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.
                    </p>

                    <h3 className="font-semibold text-neutral-dark">Data Security</h3>
                    <p>
                      We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                    </p>

                    <h3 className="font-semibold text-neutral-dark">Your Rights</h3>
                    <p>
                      You have the right to access, update, or delete your personal information. You may also opt out of marketing communications at any time.
                    </p>

                    <h3 className="font-semibold text-neutral-dark">Contact Us</h3>
                    <p>
                      If you have questions about this Privacy Policy, please contact us at privacy@natureheal.com.
                    </p>
                  </div>
                </div>
              )}

              {/* Ghana Delivery Policy */}
              {activeSection === 'ghana-delivery' && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-neutral-dark mb-6">
                    Ghana Delivery Policy
                  </h2>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                    <div className="flex items-start">
                      <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 mt-1" />
                      <div>
                        <h3 className="font-semibold text-yellow-800 mb-2">Important Notice for Ghana Customers</h3>
                        <p className="text-yellow-700">
                          All orders to Ghana require mandatory confirmation calls and are subject to our no-refund policy after confirmation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="prose prose-lg max-w-none text-neutral-medium">
                    <h3 className="font-semibold text-neutral-dark">1. Mandatory Order Confirmation Call</h3>
                    <p>
                      <strong>All customers with delivery addresses in Ghana will receive a mandatory confirmation call within 24 hours of placing their order.</strong> This call serves to:
                    </p>
                    <ul>
                      <li>Verify your order details and delivery address</li>
                      <li>Confirm your contact information</li>
                      <li>Explain delivery timelines and procedures</li>
                      <li>Answer any questions about your order</li>
                      <li>Finalize your order for processing</li>
                    </ul>

                    <h3 className="font-semibold text-neutral-dark">2. Order Processing Timeline</h3>
                    <ul>
                      <li><strong>Order Placement:</strong> You place your order online</li>
                      <li><strong>Confirmation Call:</strong> We call you within 24 hours</li>
                      <li><strong>Order Confirmation:</strong> Your order is confirmed during the call</li>
                      <li><strong>Processing:</strong> Order enters fulfillment process</li>
                      <li><strong>Shipping:</strong> Products are shipped to Ghana</li>
                    </ul>

                    <h3 className="font-semibold text-neutral-dark">3. No Refund Policy After Confirmation</h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
                      <p className="text-red-800 font-semibold">
                        IMPORTANT: Once you confirm your order during our confirmation call, the order becomes final and non-refundable.
                      </p>
                    </div>
                    <p>
                      This policy exists because:
                    </p>
                    <ul>
                      <li>International shipping costs are non-recoverable</li>
                      <li>Products are specially prepared for Ghana delivery</li>
                      <li>Customs and import procedures cannot be reversed</li>
                      <li>Return shipping from Ghana is cost-prohibitive</li>
                    </ul>

                    <h3 className="font-semibold text-neutral-dark">4. Delivery Information</h3>
                    <ul>
                      <li><strong>Standard Delivery:</strong> 7-14 business days (Free)</li>
                      <li><strong>Express Delivery:</strong> 5-7 business days (Additional charges apply)</li>
                      <li><strong>Delivery Areas:</strong> All regions of Ghana</li>
                      <li><strong>Tracking:</strong> Full tracking provided once shipped</li>
                    </ul>

                    <h3 className="font-semibold text-neutral-dark">5. Quality Guarantee</h3>
                    <p>
                      While we maintain a no-refund policy after confirmation, we guarantee:
                    </p>
                    <ul>
                      <li>All products are authentic and as described</li>
                      <li>Products are properly packaged for international shipping</li>
                      <li>Replacement for damaged items during shipping (with proof)</li>
                      <li>Full customer support throughout the delivery process</li>
                    </ul>

                    <h3 className="font-semibold text-neutral-dark">6. Contact Information</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Phone className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-semibold text-blue-800">Ghana Customer Service</span>
                      </div>
                      <p className="text-blue-700">
                        Phone: +233 XX XXX XXXX<br />
                        Email: ghana@natureheal.com<br />
                        Hours: Monday-Friday, 9AM-6PM GMT
                      </p>
                    </div>

                    <h3 className="font-semibold text-neutral-dark">7. Before You Order</h3>
                    <p>
                      Please ensure you:
                    </p>
                    <ul>
                      <li>Carefully review all product details and descriptions</li>
                      <li>Verify your delivery address is correct</li>
                      <li>Understand our no-refund policy after confirmation</li>
                      <li>Have your phone available for our confirmation call</li>
                      <li>Are prepared to receive delivery within the specified timeframe</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Refund Policy */}
              {activeSection === 'refund' && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-neutral-dark mb-6">
                    Refund Policy
                  </h2>
                  <div className="prose prose-lg max-w-none text-neutral-medium">
                    <p className="text-sm text-gray-500 mb-6">Last updated: January 1, 2024</p>
                    
                    <h3 className="font-semibold text-neutral-dark">General Refund Policy</h3>
                    <p>
                      We want you to be completely satisfied with your purchase. Our refund policy varies based on your location and order status.
                    </p>

                    <h3 className="font-semibold text-neutral-dark">Domestic Orders (Non-Ghana)</h3>
                    <ul>
                      <li><strong>30-Day Money-Back Guarantee:</strong> Unopened products can be returned within 30 days</li>
                      <li><strong>Full Refund:</strong> Original purchase price minus shipping costs</li>
                      <li><strong>Return Shipping:</strong> Customer responsible unless item is defective</li>
                      <li><strong>Processing Time:</strong> 3-5 business days after we receive the return</li>
                    </ul>

                    <h3 className="font-semibold text-neutral-dark">Ghana Orders - Special Policy</h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
                      <h4 className="font-semibold text-red-800 mb-2">No Refunds After Order Confirmation</h4>
                      <p className="text-red-700">
                        Orders to Ghana are <strong>non-refundable</strong> once confirmed during our mandatory confirmation call. This policy is due to:
                      </p>
                      <ul className="text-red-700 mt-2">
                        <li>High international shipping costs</li>
                        <li>Customs and import procedures</li>
                        <li>Cost-prohibitive return shipping</li>
                        <li>Product preparation for international delivery</li>
                      </ul>
                    </div>

                    <h3 className="font-semibold text-neutral-dark">Exceptions to No-Refund Policy</h3>
                    <p>
                      Even for Ghana orders, we will provide refunds or replacements in these cases:
                    </p>
                    <ul>
                      <li><strong>Wrong Product Sent:</strong> We sent an incorrect item</li>
                      <li><strong>Damaged in Transit:</strong> Product arrived damaged (with photo proof)</li>
                      <li><strong>Quality Defect:</strong> Manufacturing defect or quality issue</li>
                      <li><strong>Order Cancellation:</strong> Before confirmation call is completed</li>
                    </ul>

                    <h3 className="font-semibold text-neutral-dark">How to Request a Refund</h3>
                    <ol>
                      <li>Contact our customer service team</li>
                      <li>Provide your order number and reason for return</li>
                      <li>Follow our return instructions (if applicable)</li>
                      <li>Ship the product back in original packaging</li>
                      <li>Receive confirmation and refund processing</li>
                    </ol>

                    <h3 className="font-semibold text-neutral-dark">Non-Refundable Items</h3>
                    <ul>
                      <li>Opened consumable products (for safety reasons)</li>
                      <li>Products damaged by misuse</li>
                      <li>Items returned after 30 days (domestic orders)</li>
                      <li>All Ghana orders after confirmation call</li>
                    </ul>

                    <h3 className="font-semibold text-neutral-dark">Refund Processing</h3>
                    <ul>
                      <li><strong>Mobile Money:</strong> Instant to 24 hours</li>
                      <li><strong>Credit/Debit Cards:</strong> 5-10 business days</li>
                      <li><strong>PayPal:</strong> 3-5 business days</li>
                    </ul>

                    <h3 className="font-semibold text-neutral-dark">Contact for Refunds</h3>
                    <p>
                      To request a refund or ask questions about our refund policy:
                    </p>
                    <ul>
                      <li>Email: refunds@natureheal.com</li>
                      <li>Phone: 1-800-NATURAL</li>
                      <li>Live Chat: Available on our website</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}