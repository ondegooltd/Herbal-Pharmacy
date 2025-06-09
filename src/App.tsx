import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { WishlistProvider } from './context/WishlistContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingCartActions from './components/FloatingCartActions';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Categories from './pages/Categories';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import About from './pages/About';
import Contact from './pages/Contact';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import ForgotPassword from './pages/ForgotPassword';
import FAQ from './pages/FAQ';
import Support from './pages/Support';
import Blog from './pages/Blog';
import Policy from './pages/Policy';
import PaymentVerification from './pages/PaymentVerification';
import useScrollToTop from './hooks/useScrollToTop';

function ScrollToTopHandler() {
  useScrollToTop();
  return null;
}

function App() {
  return (
    <UserProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <ScrollToTopHandler />
            <div className="min-h-screen bg-white">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/policy" element={<Policy />} />
                  <Route path="/terms" element={<Policy />} />
                  <Route path="/privacy" element={<Policy />} />
                  <Route path="/payment/verify" element={<PaymentVerification />} />
                  
                  {/* Auth Routes */}
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route 
                    path="/signup" 
                    element={
                      <ProtectedRoute requireAuth={false}>
                        <Signup />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/signin" 
                    element={
                      <ProtectedRoute requireAuth={false}>
                        <Signin />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Protected Routes */}
                  <Route 
                    path="/checkout" 
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/account" 
                    element={
                      <ProtectedRoute>
                        <Account />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
              <FloatingCartActions />
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </WishlistProvider>
    </UserProvider>
  );
}

export default App;