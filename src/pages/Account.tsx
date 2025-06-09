import React, { useState } from 'react';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  CreditCard, 
  Settings,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  X,
  Save,
  LogOut,
  Calendar,
  Mail,
  Phone,
  Shield
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

export default function Account() {
  const { user, isLoggedIn, orders, addresses, updateProfile, addAddress, deleteAddress, logout } = useUser();
  const { items: wishlistItems } = useWishlist();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState('');
  
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [addressForm, setAddressForm] = useState({
    id: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Ghana',
    isDefault: false
  });

  const [addressErrors, setAddressErrors] = useState({});

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-neutral-light flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-card p-8 max-w-md w-full">
          <h2 className="font-heading text-2xl font-bold text-center mb-6">Sign In Required</h2>
          <p className="text-gray-600 text-center mb-6">
            Please sign in to access your account dashboard.
          </p>
          <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'orders', name: 'Orders', icon: Package },
    { id: 'wishlist', name: 'Wishlist', icon: Heart },
    { id: 'addresses', name: 'Addresses', icon: MapPin },
    { id: 'payment', name: 'Payment Methods', icon: CreditCard },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const handleUpdateProfile = () => {
    updateProfile(editForm);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutConfirm(false);
      // Navigation will be handled by the ProtectedRoute component
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // NEW: Handle View Order Details
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailsModal(true);
  };

  // NEW: Handle Download Invoice
  const handleDownloadInvoice = (order) => {
    try {
      setDownloadStatus('Generating invoice...');
      
      // Generate invoice content
      const invoiceContent = generateInvoiceContent(order);
      
      // Create blob and download
      const blob = new Blob([invoiceContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      // Create temporary download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${order.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
      
      setDownloadStatus('Invoice downloaded successfully!');
      setTimeout(() => setDownloadStatus(''), 3000);
      
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadStatus('Download failed. Please try again.');
      setTimeout(() => setDownloadStatus(''), 3000);
    }
  };

  // NEW: Generate invoice content
  const generateInvoiceContent = (order) => {
    const invoiceDate = new Date().toLocaleDateString();
    const orderDate = order.createdAt.toLocaleDateString();
    
    return `
NATUREHEAL INVOICE
==================

Invoice Date: ${invoiceDate}
Order Number: ${order.id}
Order Date: ${orderDate}
Status: ${order.status.toUpperCase()}

CUSTOMER INFORMATION
--------------------
Name: ${user?.name || 'N/A'}
Email: ${user?.email || 'N/A'}
Phone: ${user?.phone || 'N/A'}

SHIPPING ADDRESS
----------------
${order.shippingAddress.street}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
${order.shippingAddress.country}

ORDER ITEMS
-----------
${order.items.map(item => 
  `${item.product.name} x${item.quantity} - GH₵ ${(item.product.price * item.quantity * 6).toFixed(2)}`
).join('\n')}

ORDER SUMMARY
-------------
Subtotal: GH₵ ${(order.subtotal * 6).toFixed(2)}
Shipping: GH₵ ${(order.shippingCost * 6).toFixed(2)}
Tax: GH₵ ${(order.tax * 6).toFixed(2)}
Total: GH₵ ${(order.total * 6).toFixed(2)}

Payment Method: ${order.paymentMethod}
Tracking Number: ${order.trackingNumber || 'N/A'}

Thank you for your business!
NatureHeal - Your Natural Health Partner
    `.trim();
  };

  const validateAddressForm = () => {
    const errors = {};
    
    if (!addressForm.street.trim()) errors.street = 'Street address is required';
    if (!addressForm.city.trim()) errors.city = 'City is required';
    if (!addressForm.state.trim()) errors.state = 'State/Region is required';
    
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAddress = () => {
    if (!validateAddressForm()) return;
    
    const newAddress = {
      ...addressForm,
      id: Date.now().toString()
    };
    
    addAddress(newAddress);
    setShowAddressModal(false);
    setAddressForm({
      id: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Ghana',
      isDefault: false
    });
    setAddressErrors({});
  };

  const updateAddressForm = (field, value) => {
    setAddressForm(prev => ({ ...prev, [field]: value }));
    if (addressErrors[field]) {
      setAddressErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const ghanaRegions = [
    'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern', 'Volta',
    'Northern', 'Upper East', 'Upper West', 'Brong-Ahafo', 'Western North',
    'Ahafo', 'Bono', 'Bono East', 'Oti', 'Savannah', 'North East'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Format user's display name
  const getDisplayName = () => {
    if (!user?.name) return 'User';
    return user.name;
  };

  // Get user's first name for greeting
  const getFirstName = () => {
    if (!user?.name) return 'User';
    return user.name.split(' ')[0];
  };

  // Format join date
  const getJoinDate = () => {
    if (!user?.createdAt) return 'Recently';
    return new Date(user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header with User Info */}
        <div className="mb-8 bg-white rounded-lg shadow-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-green-600 rounded-full flex items-center justify-center">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={getDisplayName()}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-xl">
                    {getDisplayName().charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-dark">
                  Welcome back, {getFirstName()}!
                </h1>
                <p className="text-base sm:text-lg text-neutral-medium">
                  Manage your account and track your wellness journey
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-neutral-medium">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Member since {getJoinDate()}
                  </div>
                  {user?.emailVerified && (
                    <div className="flex items-center text-green-600">
                      <Shield className="h-4 w-4 mr-1" />
                      Verified Account
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start sm:items-end bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-neutral-medium">Account ID</p>
              <p className="font-mono text-sm text-neutral-dark break-all">{user?.id}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-dark">{getDisplayName()}</h3>
                  <p className="text-sm text-neutral-medium">{user?.email}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-white'
                          : 'text-neutral-dark hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
                
                {/* Logout Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-card p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading text-xl font-semibold">Profile Information</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <button
                        onClick={handleUpdateProfile}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <User className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-lg text-neutral-dark">{getDisplayName()}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <Mail className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-lg text-neutral-dark">{user?.email}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <Phone className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-lg text-neutral-dark">{user?.phone || 'Not provided'}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-lg text-neutral-dark">{getJoinDate()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Account Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <div className="bg-primary/10 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-primary">{orders.length}</div>
                          <div className="text-sm text-neutral-medium">Total Orders</div>
                        </div>
                        <div className="bg-secondary/10 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-secondary">{wishlistItems.length}</div>
                          <div className="text-sm text-neutral-medium">Wishlist Items</div>
                        </div>
                        <div className="bg-green-100 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">{addresses.length}</div>
                          <div className="text-sm text-neutral-medium">Saved Addresses</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="font-heading text-xl font-semibold mb-6">Order History</h2>
                  
                  {/* Download Status */}
                  {downloadStatus && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 text-sm">{downloadStatus}</p>
                    </div>
                  )}
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg text-neutral-medium">No orders yet</p>
                      <p className="text-neutral-medium">Start shopping to see your orders here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">Order #{order.id}</h3>
                              <p className="text-sm text-gray-500">
                                {order.createdAt.toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                              <p className="font-semibold mt-1">GH₵ {(order.total * 6).toFixed(2)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <button 
                              onClick={() => handleViewDetails(order)}
                              className="flex items-center text-primary hover:text-green-700"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </button>
                            <button 
                              onClick={() => handleDownloadInvoice(order)}
                              className="flex items-center text-primary hover:text-green-700"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download Invoice
                            </button>
                            {order.trackingNumber && (
                              <span className="text-sm text-gray-500">
                                Tracking: {order.trackingNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="font-heading text-xl font-semibold mb-6">My Wishlist</h2>
                  
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg text-neutral-medium">Your wishlist is empty</p>
                      <p className="text-neutral-medium">Save products you love for later</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistItems.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading text-xl font-semibold">Saved Addresses</h2>
                    <button 
                      onClick={() => setShowAddressModal(true)}
                      className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{address.street}</p>
                            <p className="text-gray-600">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className="text-gray-600">{address.country}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-primary hover:text-green-700">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => deleteAddress(address.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Methods Tab */}
              {activeTab === 'payment' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading text-xl font-semibold">Payment Methods</h2>
                    <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </button>
                  </div>
                  
                  <div className="text-center py-8">
                    <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-neutral-medium">No payment methods saved</p>
                    <p className="text-neutral-medium">Add a payment method for faster checkout</p>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="font-heading text-xl font-semibold mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" className="text-primary focus:ring-primary" defaultChecked />
                          <span className="ml-2">Email notifications for orders</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="text-primary focus:ring-primary" defaultChecked />
                          <span className="ml-2">SMS notifications for shipping updates</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="text-primary focus:ring-primary" />
                          <span className="ml-2">Marketing emails</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Privacy</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" className="text-primary focus:ring-primary" defaultChecked />
                          <span className="ml-2">Allow data collection for personalized recommendations</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="text-primary focus:ring-primary" />
                          <span className="ml-2">Share data with trusted partners</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Delete Account
                      </button>
                      <p className="text-sm text-gray-500 mt-2">
                        This action cannot be undone. All your data will be permanently deleted.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="font-heading text-xl font-semibold">Order Details - #{selectedOrder.id}</h3>
              <button
                onClick={() => setShowOrderDetailsModal(false)}
                className="text-neutral-medium hover:text-neutral-dark"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-lg">Order Status</h4>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-semibold">{selectedOrder.createdAt.toLocaleDateString()}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-lg mb-4">Items Ordered</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium">{item.product.name}</h5>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">GH₵ {(item.product.price * item.quantity * 6).toFixed(2)}</p>
                        <p className="text-sm text-gray-500">GH₵ {(item.product.price * 6).toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3">Shipping Address</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                    <p>{selectedOrder.shippingAddress.zipCode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-3">Delivery Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><span className="font-medium">Method:</span> {selectedOrder.shippingMethod || 'Standard'}</p>
                    <p><span className="font-medium">Tracking:</span> {selectedOrder.trackingNumber || 'N/A'}</p>
                    {selectedOrder.estimatedDelivery && (
                      <p><span className="font-medium">Estimated:</span> {selectedOrder.estimatedDelivery}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h4 className="font-semibold text-lg mb-3">Order Summary</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>GH₵ {((selectedOrder.subtotal || selectedOrder.total * 0.85) * 6).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>GH₵ {((selectedOrder.shippingCost || 0) * 6).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>GH₵ {((selectedOrder.tax || selectedOrder.total * 0.08) * 6).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-primary">GH₵ {(selectedOrder.total * 6).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h4 className="font-semibold text-lg mb-3">Payment Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                  <p><span className="font-medium">Payment Status:</span> <span className="text-green-600">Paid</span></p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 p-6 border-t">
              <button
                onClick={() => handleDownloadInvoice(selectedOrder)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </button>
              <button
                onClick={() => setShowOrderDetailsModal(false)}
                className="px-6 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xl font-semibold">Add New Address</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-neutral-medium hover:text-neutral-dark"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) => updateAddressForm('street', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    addressErrors.street ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="House number, street name, area"
                />
                {addressErrors.street && (
                  <p className="text-red-500 text-sm mt-1">{addressErrors.street}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => updateAddressForm('city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      addressErrors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Accra, Kumasi"
                  />
                  {addressErrors.city && (
                    <p className="text-red-500 text-sm mt-1">{addressErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region *
                  </label>
                  <select
                    value={addressForm.state}
                    onChange={(e) => updateAddressForm('state', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      addressErrors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Region</option>
                    {ghanaRegions.map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                  {addressErrors.state && (
                    <p className="text-red-500 text-sm mt-1">{addressErrors.state}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={addressForm.zipCode}
                  onChange={(e) => updateAddressForm('zipCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => updateAddressForm('isDefault', e.target.checked)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm">Set as default address</span>
                </label>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowAddressModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAddress}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xl font-semibold text-neutral-dark">Confirm Sign Out</h3>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="text-neutral-medium hover:text-neutral-dark"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-neutral-medium">
                Are you sure you want to sign out of your account? You'll need to sign in again to access your account features.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}