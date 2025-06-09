import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

/**
 * Custom hook to handle authentication redirects
 */
export function useAuthRedirect() {
  const { isLoggedIn, isLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    const currentPath = location.pathname;
    const isAuthPage = currentPath === '/signin' || currentPath === '/signup';
    const isProtectedPage = currentPath === '/account' || currentPath === '/checkout';

    // If user is logged in and on auth pages, redirect to homepage
    if (isLoggedIn && isAuthPage) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }

    // If user is not logged in and on protected pages, redirect to signin
    if (!isLoggedIn && isProtectedPage) {
      navigate('/signin', { 
        state: { from: location },
        replace: true 
      });
    }
  }, [isLoggedIn, isLoading, location, navigate]);

  return {
    isLoggedIn,
    isLoading,
    shouldRedirect: isLoading ? false : (
      (isLoggedIn && (location.pathname === '/signin' || location.pathname === '/signup')) ||
      (!isLoggedIn && (location.pathname === '/account' || location.pathname === '/checkout'))
    )
  };
}

/**
 * Hook for handling post-login redirects
 */
export function usePostLoginRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectAfterLogin = () => {
    // Get the intended destination from location state
    const from = location.state?.from?.pathname || '/';
    
    // Always redirect to homepage for successful login
    navigate('/', { replace: true });
  };

  return { redirectAfterLogin };
}