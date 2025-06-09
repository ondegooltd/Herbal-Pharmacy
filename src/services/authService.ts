import { User } from '../types';

// OAuth Configuration
const OAUTH_CONFIG = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
    redirectUri: `${window.location.origin}/auth/google/callback`,
    scope: 'openid profile email'
  },
  facebook: {
    appId: import.meta.env.VITE_FACEBOOK_APP_ID || 'your-facebook-app-id',
    redirectUri: `${window.location.origin}/auth/facebook/callback`,
    scope: 'email,public_profile'
  }
};

// Session management
const SESSION_KEY = 'natureheal_session';
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export interface AuthSession {
  token: string;
  user: User;
  expiresAt: number;
  provider?: 'google' | 'facebook' | 'email';
}

export interface SocialProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'facebook';
}

class AuthService {
  private session: AuthSession | null = null;

  constructor() {
    this.loadSession();
  }

  // Session Management
  private loadSession(): void {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session.expiresAt > Date.now()) {
          this.session = session;
        } else {
          this.clearSession();
        }
      }
    } catch (error) {
      console.error('Error loading session:', error);
      this.clearSession();
    }
  }

  private saveSession(session: AuthSession): void {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      this.session = session;
      this.logAuthEvent('session_created', { provider: session.provider });
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  private clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
    this.session = null;
  }

  private generateToken(): string {
    return btoa(Math.random().toString(36).substring(2) + Date.now().toString(36));
  }

  // Authentication Event Logging
  private logAuthEvent(event: string, data?: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      data,
      userAgent: navigator.userAgent,
      ip: 'client-side' // In production, this would be logged server-side
    };
    
    console.log('Auth Event:', logEntry);
    
    // In production, send to logging service
    // await fetch('/api/auth/log', { method: 'POST', body: JSON.stringify(logEntry) });
  }

  // Google OAuth
  async loginWithGoogle(): Promise<User> {
    try {
      this.logAuthEvent('google_login_initiated');
      
      // Load Google OAuth library
      await this.loadGoogleOAuth();
      
      const response = await new Promise<any>((resolve, reject) => {
        (window as any).google.accounts.oauth2.initTokenClient({
          client_id: OAUTH_CONFIG.google.clientId,
          scope: OAUTH_CONFIG.google.scope,
          callback: (response: any) => {
            if (response.error) {
              reject(new Error(response.error));
            } else {
              resolve(response);
            }
          }
        }).requestAccessToken();
      });

      // Get user profile
      const profileResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.access_token}`
      );
      
      if (!profileResponse.ok) {
        throw new Error('Failed to fetch Google profile');
      }

      const profile = await profileResponse.json();
      
      const socialProfile: SocialProfile = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
        provider: 'google'
      };

      return await this.handleSocialLogin(socialProfile);
    } catch (error) {
      this.logAuthEvent('google_login_failed', { error: error.message });
      throw error;
    }
  }

  // Facebook OAuth
  async loginWithFacebook(): Promise<User> {
    try {
      this.logAuthEvent('facebook_login_initiated');
      
      // Load Facebook SDK
      await this.loadFacebookSDK();
      
      const response = await new Promise<any>((resolve, reject) => {
        (window as any).FB.login((response: any) => {
          if (response.authResponse) {
            resolve(response);
          } else {
            reject(new Error('Facebook login cancelled'));
          }
        }, { scope: OAUTH_CONFIG.facebook.scope });
      });

      // Get user profile
      const profile = await new Promise<any>((resolve, reject) => {
        (window as any).FB.api('/me', { fields: 'id,name,email,picture' }, (response: any) => {
          if (response.error) {
            reject(new Error(response.error.message));
          } else {
            resolve(response);
          }
        });
      });

      const socialProfile: SocialProfile = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        picture: profile.picture?.data?.url,
        provider: 'facebook'
      };

      return await this.handleSocialLogin(socialProfile);
    } catch (error) {
      this.logAuthEvent('facebook_login_failed', { error: error.message });
      throw error;
    }
  }

  // Handle social login (create or link account)
  private async handleSocialLogin(socialProfile: SocialProfile): Promise<User> {
    try {
      // Check if user exists by email
      const existingUser = await this.findUserByEmail(socialProfile.email);
      
      let user: User;
      
      if (existingUser) {
        // Link social account to existing user
        user = await this.linkSocialAccount(existingUser, socialProfile);
        this.logAuthEvent('social_account_linked', { 
          provider: socialProfile.provider,
          userId: user.id 
        });
      } else {
        // Create new user account
        user = await this.createUserFromSocial(socialProfile);
        this.logAuthEvent('user_created_social', { 
          provider: socialProfile.provider,
          userId: user.id 
        });
      }

      // Create session
      const session: AuthSession = {
        token: this.generateToken(),
        user,
        expiresAt: Date.now() + TOKEN_EXPIRY,
        provider: socialProfile.provider
      };

      this.saveSession(session);
      return user;
    } catch (error) {
      this.logAuthEvent('social_login_error', { 
        provider: socialProfile.provider,
        error: error.message 
      });
      throw error;
    }
  }

  // User management methods
  private async findUserByEmail(email: string): Promise<User | null> {
    // In production, this would query your database
    const users = this.getStoredUsers();
    return users.find(user => user.email === email) || null;
  }

  private async createUserFromSocial(socialProfile: SocialProfile): Promise<User> {
    const user: User = {
      id: this.generateUserId(),
      name: socialProfile.name,
      email: socialProfile.email,
      phone: '',
      profilePicture: socialProfile.picture,
      socialAccounts: {
        [socialProfile.provider]: {
          id: socialProfile.id,
          email: socialProfile.email
        }
      },
      address: {
        id: '',
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

    await this.saveUser(user);
    return user;
  }

  private async linkSocialAccount(user: User, socialProfile: SocialProfile): Promise<User> {
    const updatedUser = {
      ...user,
      socialAccounts: {
        ...user.socialAccounts,
        [socialProfile.provider]: {
          id: socialProfile.id,
          email: socialProfile.email
        }
      },
      lastLoginAt: new Date()
    };

    await this.saveUser(updatedUser);
    return updatedUser;
  }

  // Storage methods (in production, these would be API calls)
  private getStoredUsers(): User[] {
    try {
      const users = localStorage.getItem('natureheal_users');
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  }

  private async saveUser(user: User): Promise<void> {
    const users = this.getStoredUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem('natureheal_users', JSON.stringify(users));
  }

  private generateUserId(): string {
    return 'user_' + Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // OAuth library loaders
  private async loadGoogleOAuth(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).google?.accounts) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google OAuth'));
      document.head.appendChild(script);
    });
  }

  private async loadFacebookSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Define fbAsyncInit before checking if FB exists or loading the script
      (window as any).fbAsyncInit = () => {
        (window as any).FB.init({
          appId: OAUTH_CONFIG.facebook.appId,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
        
        // Wait for FB to be fully ready before resolving
        (window as any).FB.getLoginStatus(() => {
          resolve();
        });
      };

      if ((window as any).FB) {
        // If FB already exists, check if it's initialized
        try {
          (window as any).FB.getLoginStatus(() => {
            resolve();
          });
        } catch (error) {
          // If FB exists but not initialized, call fbAsyncInit manually
          (window as any).fbAsyncInit();
        }
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.onerror = () => reject(new Error('Failed to load Facebook SDK'));
      document.head.appendChild(script);
    });
  }

  // Public methods
  getCurrentUser(): User | null {
    return this.session?.user || null;
  }

  isAuthenticated(): boolean {
    return this.session !== null && this.session.expiresAt > Date.now();
  }

  getToken(): string | null {
    return this.session?.token || null;
  }

  async logout(): Promise<void> {
    this.logAuthEvent('user_logout', { userId: this.session?.user?.id });
    this.clearSession();
  }

  async refreshSession(): Promise<void> {
    if (this.session) {
      this.session.expiresAt = Date.now() + TOKEN_EXPIRY;
      this.saveSession(this.session);
    }
  }
}

export const authService = new AuthService();