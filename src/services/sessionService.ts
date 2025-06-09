import { User } from '../types';

// Session configuration
const SESSION_CONFIG = {
  key: 'natureheal_session',
  tokenKey: 'natureheal_token',
  expiryHours: 24,
  refreshThresholdHours: 2
};

export interface SessionData {
  user: User;
  token: string;
  expiresAt: number;
  createdAt: number;
  lastActivity: number;
}

class SessionService {
  private sessionData: SessionData | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.loadSession();
    this.startSessionMonitoring();
  }

  /**
   * Create a new session
   */
  createSession(user: User, token?: string): SessionData {
    const now = Date.now();
    const expiresAt = now + (SESSION_CONFIG.expiryHours * 60 * 60 * 1000);
    
    const sessionData: SessionData = {
      user,
      token: token || this.generateSecureToken(),
      expiresAt,
      createdAt: now,
      lastActivity: now
    };

    this.sessionData = sessionData;
    this.saveSession(sessionData);
    this.scheduleRefresh();
    
    this.logSessionEvent('session_created', { userId: user.id });
    return sessionData;
  }

  /**
   * Load session from storage
   */
  private loadSession(): void {
    try {
      const stored = localStorage.getItem(SESSION_CONFIG.key);
      if (stored) {
        const sessionData = JSON.parse(stored) as SessionData;
        
        if (this.isSessionValid(sessionData)) {
          this.sessionData = sessionData;
          this.updateLastActivity();
          this.scheduleRefresh();
        } else {
          this.clearSession();
        }
      }
    } catch (error) {
      console.error('Error loading session:', error);
      this.clearSession();
    }
  }

  /**
   * Save session to storage
   */
  private saveSession(sessionData: SessionData): void {
    try {
      localStorage.setItem(SESSION_CONFIG.key, JSON.stringify(sessionData));
      localStorage.setItem(SESSION_CONFIG.tokenKey, sessionData.token);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  /**
   * Validate session
   */
  private isSessionValid(sessionData: SessionData): boolean {
    const now = Date.now();
    return sessionData.expiresAt > now;
  }

  /**
   * Update last activity timestamp
   */
  updateLastActivity(): void {
    if (this.sessionData) {
      this.sessionData.lastActivity = Date.now();
      this.saveSession(this.sessionData);
    }
  }

  /**
   * Refresh session (extend expiry)
   */
  refreshSession(): void {
    if (this.sessionData) {
      const now = Date.now();
      this.sessionData.expiresAt = now + (SESSION_CONFIG.expiryHours * 60 * 60 * 1000);
      this.sessionData.lastActivity = now;
      
      this.saveSession(this.sessionData);
      this.scheduleRefresh();
      
      this.logSessionEvent('session_refreshed', { 
        userId: this.sessionData.user.id,
        newExpiry: this.sessionData.expiresAt 
      });
    }
  }

  /**
   * Schedule automatic session refresh
   */
  private scheduleRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    if (this.sessionData) {
      const refreshTime = SESSION_CONFIG.refreshThresholdHours * 60 * 60 * 1000;
      const timeUntilRefresh = this.sessionData.expiresAt - Date.now() - refreshTime;
      
      if (timeUntilRefresh > 0) {
        this.refreshTimer = setTimeout(() => {
          this.refreshSession();
        }, timeUntilRefresh);
      }
    }
  }

  /**
   * Start monitoring session activity
   */
  private startSessionMonitoring(): void {
    // Monitor user activity for session extension
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    let lastActivityUpdate = 0;
    const throttleMs = 30000; // Update activity at most every 30 seconds

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastActivityUpdate > throttleMs) {
        this.updateLastActivity();
        lastActivityUpdate = now;
      }
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Check session validity periodically
    setInterval(() => {
      if (this.sessionData && !this.isSessionValid(this.sessionData)) {
        this.clearSession();
        this.logSessionEvent('session_expired');
        
        // Redirect to login if on protected page
        if (window.location.pathname.includes('/account') || window.location.pathname.includes('/checkout')) {
          window.location.href = '/signin';
        }
      }
    }, 60000); // Check every minute
  }

  /**
   * Clear session
   */
  clearSession(): void {
    if (this.sessionData) {
      this.logSessionEvent('session_cleared', { userId: this.sessionData.user.id });
    }

    this.sessionData = null;
    localStorage.removeItem(SESSION_CONFIG.key);
    localStorage.removeItem(SESSION_CONFIG.tokenKey);
    
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Get current session
   */
  getCurrentSession(): SessionData | null {
    return this.sessionData;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.sessionData?.user || null;
  }

  /**
   * Get session token
   */
  getToken(): string | null {
    return this.sessionData?.token || null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.sessionData !== null && this.isSessionValid(this.sessionData);
  }

  /**
   * Get session info
   */
  getSessionInfo(): {
    isActive: boolean;
    expiresAt: number | null;
    timeRemaining: number | null;
    lastActivity: number | null;
  } {
    if (!this.sessionData) {
      return {
        isActive: false,
        expiresAt: null,
        timeRemaining: null,
        lastActivity: null
      };
    }

    const now = Date.now();
    return {
      isActive: this.isSessionValid(this.sessionData),
      expiresAt: this.sessionData.expiresAt,
      timeRemaining: Math.max(0, this.sessionData.expiresAt - now),
      lastActivity: this.sessionData.lastActivity
    };
  }

  /**
   * Generate secure token
   */
  private generateSecureToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Log session events
   */
  private logSessionEvent(event: string, data?: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      data,
      sessionId: this.sessionData?.token?.substring(0, 8) || 'none',
      userAgent: navigator.userAgent
    };
    
    console.log('Session Event:', logEntry);
    
    // In production, send to logging service
    // await fetch('/api/session/log', { method: 'POST', body: JSON.stringify(logEntry) });
  }

  /**
   * Force logout (for security reasons)
   */
  forceLogout(reason: string): void {
    this.logSessionEvent('force_logout', { reason });
    this.clearSession();
    
    // Redirect to login
    window.location.href = '/signin';
  }
}

export const sessionService = new SessionService();