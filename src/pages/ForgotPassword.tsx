import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { requestPasswordReset, isLoading, error, clearError } = useUser();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    try {
      await requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled by the context
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-primary/5 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-primary to-green-600 p-3 rounded-xl shadow-lg">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <span className="font-heading font-bold text-2xl text-primary">NatureHeal</span>
          </Link>
          <h2 className="font-heading text-3xl font-bold text-neutral-dark">
            Reset Your Password
          </h2>
          <p className="mt-2 text-neutral-medium">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        {/* Success Message */}
        {isSubmitted && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <p className="text-green-800 text-sm flex items-center" role="alert">
              <CheckCircle className="h-4 w-4 mr-2" />
              Password reset instructions have been sent to your email
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <p className="text-red-800 text-sm flex items-center" role="alert">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        {!isSubmitted && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                    if (error) clearError();
                  }}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${
                    emailError ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                  style={{ minHeight: '48px' }}
                />
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              {emailError && (
                <p className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed"
              style={{ minHeight: '56px' }}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Sending Instructions...
                </div>
              ) : (
                'Send Reset Instructions'
              )}
            </button>

            {/* Back to Sign In */}
            <div className="text-center">
              <Link
                to="/signin"
                className="inline-flex items-center text-primary hover:text-green-600 font-semibold transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 