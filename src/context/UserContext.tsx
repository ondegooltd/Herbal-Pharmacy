import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { User, Address, Order } from '../types';

interface UserState {
  user: User | null;
  orders: Order[];
  addresses: Address[];
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UserContextType extends UserState {
  login: (email: string, password: string) => Promise<User>;
  signup: (userData: SignupData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => void;
  addAddress: (address: Address) => void;
  updateAddress: (id: string, address: Address) => void;
  deleteAddress: (id: string) => void;
  addOrder: (order: Order) => void;
  requestPasswordReset: (email: string) => Promise<void>;
  clearError: () => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> }
  | { type: 'ADD_ADDRESS'; payload: Address }
  | { type: 'UPDATE_ADDRESS'; payload: { id: string; address: Address } }
  | { type: 'DELETE_ADDRESS'; payload: string }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'CLEAR_ERROR' };

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
        isLoading: false,
        error: null
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        orders: [],
        addresses: [],
        isLoading: false,
        error: null
      };
    
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      };
    
    case 'ADD_ADDRESS':
      return {
        ...state,
        addresses: [...state.addresses, action.payload]
      };
    
    case 'UPDATE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.map(addr => 
          addr.id === action.payload.id ? action.payload.address : addr
        )
      };
    
    case 'DELETE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.filter(addr => addr.id !== action.payload)
      };
    
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders]
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
}

interface UserProviderProps {
  children: ReactNode;
}

// Enhanced User Database with proper persistence
const USER_STORAGE_KEY = 'natureheal_users_db';
const SESSION_STORAGE_KEY = 'natureheal_current_session';

class UserDatabase {
  private getUsers(): User[] {
    try {
      const users = localStorage.getItem(USER_STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
  }

  private generateUserId(): string {
    return 'user_' + Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const users = this.getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findUserByPhone(phone: string): Promise<User | null> {
    const users = this.getUsers();
    return users.find(user => user.phone === phone) || null;
  }

  async findUserById(id: string): Promise<User | null> {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  async createUser(userData: SignupData): Promise<User> {
    const users = this.getUsers();
    
    // Check if user already exists by email
    const existingUserByEmail = await this.findUserByEmail(userData.email);
    if (existingUserByEmail) {
      throw new Error('An account with this email already exists');
    }

    // Check if user already exists by phone (if provided)
    if (userData.phone) {
      const existingUserByPhone = await this.findUserByPhone(userData.phone);
      if (existingUserByPhone) {
        throw new Error('An account with this phone number already exists');
      }
    }

    const newUser: User = {
      id: this.generateUserId(),
      name: `${userData.firstName.trim()} ${userData.lastName.trim()}`,
      email: userData.email.toLowerCase().trim(),
      phone: userData.phone.trim(),
      password: userData.password,
      address: {
        id: 'default',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Ghana'
      },
      createdAt: new Date(),
      lastLoginAt: new Date(),
      emailVerified: false,
      preferences: {
        newsletter: userData.subscribeNewsletter,
        smsNotifications: false,
        emailNotifications: true
      }
    };

    users.push(newUser);
    this.saveUsers(users);
    
    return newUser;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return null;
    }

    // Preserve the original name format when updating
    if (updates.name) {
      updates.name = updates.name.trim();
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    this.saveUsers(users);
    
    return users[userIndex];
  }

  async authenticateUser(identifier: string, password: string): Promise<User> {
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email or phone
    let user: User | null = null;
    
    if (identifier.includes('@')) {
      user = await this.findUserByEmail(identifier);
    } else {
      user = await this.findUserByPhone(identifier);
    }
    
    if (!user) {
      throw new Error('No account found with this email or phone number');
    }

    // Verify password
    if (!user.password || user.password !== password) {
      throw new Error('Invalid password');
    }
    
    // Update last login and return the updated user
    const updatedUser = await this.updateUser(user.id, {
      lastLoginAt: new Date()
    });

    if (!updatedUser) {
      throw new Error('Failed to update user session');
    }

    return updatedUser;
  }

  async createSocialUser(socialData: {
    name: string;
    email: string;
    provider: 'google' | 'facebook';
    providerId: string;
    picture?: string;
  }): Promise<User> {
    const users = this.getUsers();
    
    // Check if user already exists by email
    const existingUser = await this.findUserByEmail(socialData.email);
    if (existingUser) {
      // Link social account to existing user
      const updatedUser = await this.updateUser(existingUser.id, {
        socialAccounts: {
          ...existingUser.socialAccounts,
          [socialData.provider]: {
            id: socialData.providerId,
            email: socialData.email
          }
        },
        profilePicture: socialData.picture || existingUser.profilePicture,
        lastLoginAt: new Date()
      });
      return updatedUser || existingUser;
    }

    // Create new user
    const newUser: User = {
      id: this.generateUserId(),
      name: socialData.name.trim(),
      email: socialData.email.toLowerCase().trim(),
      phone: '',
      profilePicture: socialData.picture,
      socialAccounts: {
        [socialData.provider]: {
          id: socialData.providerId,
          email: socialData.email
        }
      },
      address: {
        id: 'default',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Ghana'
      },
      createdAt: new Date(),
      lastLoginAt: new Date(),
      emailVerified: true, // Social accounts are pre-verified
      preferences: {
        newsletter: true,
        smsNotifications: false,
        emailNotifications: true
      }
    };

    users.push(newUser);
    this.saveUsers(users);
    
    return newUser;
  }
}

const userDB = new UserDatabase();

export function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(userReducer, {
    user: null,
    orders: [],
    addresses: [],
    isLoggedIn: false,
    isLoading: true,
    error: null
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
        if (sessionData) {
          const { userId, expiresAt } = JSON.parse(sessionData);
          
          // Check if session is still valid
          if (Date.now() < expiresAt) {
            const user = await userDB.findUserById(userId);
            
            if (user) {
              // Ensure we have the latest user data
              const updatedUser = await userDB.updateUser(user.id, {
                lastLoginAt: new Date()
              });
              
              if (updatedUser) {
                dispatch({ type: 'LOGIN_SUCCESS', payload: updatedUser });
                return;
              }
            }
          }
          
          // Clear invalid session
          localStorage.removeItem(SESSION_STORAGE_KEY);
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem(SESSION_STORAGE_KEY);
        dispatch({ type: 'LOGOUT' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  const createSession = (user: User) => {
    const sessionData = {
      userId: user.id,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
  };

  const clearSession = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    dispatch({ type: 'LOGOUT' });
  };

  const login = async (identifier: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const user = await userDB.authenticateUser(identifier, password);
      
      // Create session and update state only if authentication was successful
      if (user) {
        createSession(user);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        
        // Wait for state to be updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Double check that the session was created
        const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
        if (!sessionData) {
          throw new Error('Failed to create session');
        }
        
        return user;
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
      dispatch({ type: 'SET_LOADING', payload: false });
      clearSession(); // Clear any existing session on error
      throw error; // Re-throw the error to be handled by the component
    }
  };

  const signup = async (userData: SignupData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const user = await userDB.createUser(userData);
      createSession(user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Signup failed' });
    }
  };

  const loginWithGoogle = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockSocialData = {
        name: 'Google User',
        email: 'google.user@gmail.com',
        provider: 'google' as const,
        providerId: 'google_123456',
        picture: 'https://via.placeholder.com/150'
      };
      
      const user = await userDB.createSocialUser(mockSocialData);
      createSession(user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Google login failed' });
    }
  };

  const loginWithFacebook = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      // Simulate Facebook OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockSocialData = {
        name: 'Facebook User',
        email: 'facebook.user@facebook.com',
        provider: 'facebook' as const,
        providerId: 'facebook_123456',
        picture: 'https://via.placeholder.com/150'
      };
      
      const user = await userDB.createSocialUser(mockSocialData);
      createSession(user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Facebook login failed' });
    }
  };

  const logout = async () => {
    try {
      clearSession();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Logout failed' });
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!state.user) return;
    
    try {
      const updatedUser = await userDB.updateUser(state.user.id, userData);
      if (updatedUser) {
        dispatch({ type: 'UPDATE_PROFILE', payload: userData });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update profile' });
    }
  };

  const addAddress = (address: Address) => {
    dispatch({ type: 'ADD_ADDRESS', payload: address });
  };

  const updateAddress = (id: string, address: Address) => {
    dispatch({ type: 'UPDATE_ADDRESS', payload: { id, address } });
  };

  const deleteAddress = (id: string) => {
    dispatch({ type: 'DELETE_ADDRESS', payload: id });
  };

  const addOrder = (order: Order) => {
    dispatch({ type: 'ADD_ORDER', payload: order });
  };

  const requestPasswordReset = async (email: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // In a real app, this would make an API call to your backend
      // For now, we'll simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate checking if the email exists
      const user = await userDB.findUserByEmail(email);
      if (!user) {
        throw new Error('No account found with this email address');
      }

      // In a real app, you would:
      // 1. Generate a password reset token
      // 2. Store it in the database with an expiration time
      // 3. Send an email with a reset link
      
      // For demo purposes, we'll just show a success message
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to send reset instructions' 
      });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (!state.user) return;

    try {
      // Update order in local storage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const orderIndex = userData.orders.findIndex((order: Order) => order.id === orderId);
      
      if (orderIndex !== -1) {
        userData.orders[orderIndex].status = status;
        localStorage.setItem('user', JSON.stringify(userData));
        dispatch({ type: 'UPDATE_PROFILE', payload: { orders: userData.orders } });
      }

      // Update order in backend if available
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
          },
          body: JSON.stringify({ status })
        });
      } catch (error) {
        console.error('Failed to update order status in backend:', error);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{
      ...state,
      login,
      signup,
      loginWithGoogle,
      loginWithFacebook,
      logout,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      addOrder,
      requestPasswordReset,
      clearError,
      updateOrderStatus
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}