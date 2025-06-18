import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Leaf,
  Loader2,
  User,
  Globe
} from 'lucide-react';
import { useUser } from '../context/UserContext';

interface AuthFormProps {
  mode: 'signin' | 'signup';
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  countryCode: string;
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
  paymentMethod: string;
}

interface FormErrors {
  [key: string]: string;
}

const COUNTRY_CODES = [
  { code: '+233', country: 'Ghana', flag: '🇬🇭' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' }
];

const MOMO_NUMBER = "024XXXXXXX"; // or MoMoPay ID

export default function AuthForm({ mode }: AuthFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, loginWithGoogle, loginWithFacebook, isLoading, error, clearError } = useUser();
  
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    countryCode: '+233',
    agreeToTerms: false,
    subscribeNewsletter: true,
    paymentMethod: 'mobile-money'
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Redirect to homepage after successful authentication
  const from = '/';

  // Clear errors when switching modes or when user starts typing
  useEffect(() => {
    setFormErrors({});
    setTouchedFields(new Set());
    if (error) {
      clearError();
    }
  }, [mode, error, clearError]);

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouchedFields(prev => new Set(prev).add(field));
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear global error
    if (error) {
      clearError();
    }

    // Check password strength for signup
    if (field === 'password' && mode === 'signup' && typeof value === 'string') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation for signup
    if (mode === 'signup') {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      } else if (formData.firstName.length < 2) {
        newErrors.firstName = 'First name must be at least 2 characters';
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      } else if (formData.lastName.length < 2) {
        newErrors.lastName = 'Last name must be at least 2 characters';
      }
    }

    // Email/Phone validation based on login type
    if (loginType === 'email') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else {
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else {
        const phoneRegex = formData.countryCode === '+233' 
          ? /^[0-9]{9}$/ 
          : /^[0-9]{7,15}$/;
        
        if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
          newErrors.phone = 'Please enter a valid phone number';
        }
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (mode === 'signup' && passwordStrength < 3) {
      newErrors.password = 'Password is too weak. Include uppercase, lowercase, numbers, and special characters';
    }

    // Confirm password for signup
    if (mode === 'signup') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      // Terms agreement
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setShowSuccess(false);
    setLoginError(null); // Clear previous errors

    try {
      if (mode === 'signup') {
        await signup({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          countryCode: formData.countryCode,
          subscribeNewsletter: formData.subscribeNewsletter
        });
      } else {
        const loginIdentifier = loginType === 'email' ? formData.email : `${formData.countryCode}${formData.phone}`;
        const user = await login(loginIdentifier, formData.password);
        
        if (user) {
          setShowSuccess(true);
          // Redirect based on user role
          setTimeout(() => {
            if (user.role === 'admin') {
              navigate('/admin/dashboard', { replace: true });
            } else {
              navigate(from, { replace: true });
            }
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setLoginError(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      if (provider === 'google') {
        await loginWithGoogle();
      } else {
        await loginWithFacebook();
      }
      
      // Only navigate if there's no error
      if (!error) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      // Error is handled by the context
      console.error('Social login error:', error);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 2) return 'bg-yellow-500';
    if (passwordStrength <= 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 2) return 'Fair';
    if (passwordStrength <= 3) return 'Good';
    return 'Strong';
  };

  const formatPhonePlaceholder = () => {
    switch (formData.countryCode) {
      case '+233': return 'XX XXX XXXX';
      case '+1': return 'XXX XXX XXXX';
      case '+44': return 'XXXX XXX XXX';
      default: return 'Phone number';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-primary/5 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-primary to-green-600 p-3 rounded-xl shadow-lg">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <span className="font-heading font-bold text-2xl text-primary">NatureHeal</span>
          </Link>
          <h2 className="font-heading text-3xl font-bold text-neutral-dark">
            {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="mt-2 text-neutral-medium">
            {mode === 'signin' 
              ? 'Sign in to continue your wellness journey' 
              : 'Join thousands of customers on their wellness journey'
            }
          </p>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 border border-gray-100">
          {showSuccess ? (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {mode === 'signin' ? 'Successfully signed in!' : 'Account created successfully!'}
              </h3>
              <p className="text-sm text-gray-500">
                Redirecting you to the homepage...
              </p>
            </div>
          ) : (
            <>
              {/* Login Type Toggle */}
              <div className="bg-gray-50 rounded-xl p-1 grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setLoginType('email')}
                  className={`flex items-center justify-center px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    loginType === 'email'
                      ? 'bg-white text-primary shadow-md transform scale-105'
                      : 'text-neutral-medium hover:text-neutral-dark'
                  }`}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType('phone')}
                  className={`flex items-center justify-center px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    loginType === 'phone'
                      ? 'bg-white text-primary shadow-md transform scale-105'
                      : 'text-neutral-medium hover:text-neutral-dark'
                  }`}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Phone
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields for Signup */}
                {mode === 'signup' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName\" className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name *
                      </label>
                      <div className="relative">
                        <input
                          id="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => updateFormData('firstName', e.target.value)}
                          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${
                            formErrors.firstName ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          placeholder="John"
                          style={{ minHeight: '48px' }}
                        />
                        <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      </div>
                      {formErrors.firstName && touchedFields.has('firstName') && (
                        <p className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <div className="relative">
                        <input
                          id="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => updateFormData('lastName', e.target.value)}
                          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${
                            formErrors.lastName ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          placeholder="Doe"
                          style={{ minHeight: '48px' }}
                        />
                        <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      </div>
                      {formErrors.lastName && touchedFields.has('lastName') && (
                        <p className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {formErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Email or Phone Field */}
                {loginType === 'email' ? (
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${
                          formErrors.email ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="john.doe@example.com"
                        style={{ minHeight: '48px' }}
                      />
                      <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                    {formErrors.email && touchedFields.has('email') && (
                      <p className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="flex space-x-2">
                      {/* Country Code Selector */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className="flex items-center px-3 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                          style={{ minHeight: '48px' }}
                        >
                          <Globe className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-sm font-medium">
                            {COUNTRY_CODES.find(c => c.code === formData.countryCode)?.flag} {formData.countryCode}
                          </span>
                        </button>
                        
                        {showCountryDropdown && (
                          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[200px]">
                            {COUNTRY_CODES.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                onClick={() => {
                                  updateFormData('countryCode', country.code);
                                  setShowCountryDropdown(false);
                                }}
                                className="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                              >
                                <span className="mr-3">{country.flag}</span>
                                <span className="text-sm font-medium mr-2">{country.code}</span>
                                <span className="text-sm text-gray-500">{country.country}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Phone Input */}
                      <div className="flex-1 relative">
                        <input
                          id="phone"
                          type="tel"
                          autoComplete="tel"
                          value={formData.phone}
                          onChange={(e) => updateFormData('phone', e.target.value)}
                          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${
                            formErrors.phone ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          placeholder={formatPhonePlaceholder()}
                          style={{ minHeight: '48px' }}
                        />
                        <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {formErrors.phone && touchedFields.has('phone') && (
                      <p className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {formErrors.phone}
                      </p>
                    )}
                    {loginType === 'phone' && (
                      <p className="text-xs text-gray-500 mt-1">
                        We'll send you order updates via SMS
                      </p>
                    )}
                  </div>
                )}

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${
                        formErrors.password ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder={mode === 'signin' ? 'Enter your password' : 'Create a strong password'}
                      style={{ minHeight: '48px' }}
                    />
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator for Signup */}
                  {mode === 'signup' && formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-semibold ${
                          passwordStrength <= 1 ? 'text-red-500' :
                          passwordStrength <= 2 ? 'text-yellow-500' :
                          passwordStrength <= 3 ? 'text-blue-500' : 'text-green-500'
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {formErrors.password && touchedFields.has('password') && (
                    <p className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {formErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password for Signup */}
                {mode === 'signup' && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                        className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${
                          formErrors.confirmPassword ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Confirm your password"
                        style={{ minHeight: '48px' }}
                      />
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {formErrors.confirmPassword && touchedFields.has('confirmPassword') && (
                      <p className="text-red-500 text-sm mt-1 flex items-center" role="alert">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {formErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                {/* Terms and Newsletter for Signup */}
                {mode === 'signup' && (
                  <div className="space-y-4">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={(e) => updateFormData('agreeToTerms', e.target.checked)}
                        className="mt-1 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        I agree to the{' '}
                        <Link to="/terms" className="text-primary hover:underline font-semibold">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-primary hover:underline font-semibold">
                          Privacy Policy
                        </Link>
                        *
                      </span>
                    </label>
                    {formErrors.agreeToTerms && touchedFields.has('agreeToTerms') && (
                      <p className="text-red-500 text-sm flex items-center" role="alert">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {formErrors.agreeToTerms}
                      </p>
                    )}

                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={formData.subscribeNewsletter}
                        onChange={(e) => updateFormData('subscribeNewsletter', e.target.checked)}
                        className="mt-1 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        Subscribe to our newsletter for health tips and exclusive offers
                      </span>
                    </label>
                  </div>
                )}

                {/* Forgot Password for Signin */}
                {mode === 'signin' && (
                  <div className="flex items-center justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline font-semibold"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                {/* Error Display */}
                {loginError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-red-800 text-sm font-medium">{loginError}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    <>
                      {mode === 'signin' ? (
                        <>
                          <LogIn className="h-5 w-5 mr-2" />
                          Sign In
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-5 w-5 mr-2" />
                          Create Account
                        </>
                      )}
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    style={{ minHeight: '48px' }}
                  >
                    <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin('facebook')}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    style={{ minHeight: '48px' }}
                  >
                    <svg className="h-5 w-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continue with Facebook
                  </button>
                </div>

                {/* Switch Mode Link */}
                <div className="text-center">
                  <p className="text-neutral-medium">
                    {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <Link 
                      to={mode === 'signin' ? '/signup' : '/signin'} 
                      className="text-primary hover:underline font-semibold"
                    >
                      {mode === 'signin' ? 'Create one now' : 'Sign in here'}
                    </Link>
                  </p>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Benefits/Features for Signup */}
        {mode === 'signup' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="font-heading font-semibold text-lg text-neutral-dark mb-4 text-center">
              Why Join NatureHeal?
            </h3>
            <div className="space-y-3">
              {[
                'Exclusive member discounts',
                'Personalized health recommendations',
                'Order tracking and history',
                'Priority customer support'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <span className="text-sm text-neutral-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}