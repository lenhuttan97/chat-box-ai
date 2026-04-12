import { User, AuthResponse } from '../../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Authentication Service for handling API calls to backend auth endpoints
 */
export class AuthService {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    this.setTokens(data.token, data.refreshToken);
    return data;
  }

  /**
   * Register a new user with email and password
   */
  async register(email: string, password: string, displayName?: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, displayName }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    this.setTokens(data.token, data.refreshToken);
    return data;
  }

  /**
   * Login with Google using Firebase ID token
   */
  async googleLogin(idToken: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Google login failed' }));
      throw new Error(errorData.message || 'Google login failed');
    }

    const data = await response.json();
    this.setTokens(data.token, data.refreshToken);
    return data;
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      this.setTokens(data.token, data.refreshToken);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage regardless of API call success
      this.clearTokens();
    }
  }

  /**
   * Update user password
   */
  async updatePassword(oldPassword: string, newPassword: string, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/auth/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Update password failed' }));
      throw new Error(errorData.message || 'Update password failed');
    }
  }

  /**
   * Update user profile information
   */
  async updateProfile(displayName: string, photoUrl?: string, token: string): Promise<User> {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ displayName, photoUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Update profile failed' }));
      throw new Error(errorData.message || 'Update profile failed');
    }

    const data = await response.json();
    return data.user;
  }

  /**
   * Get current user information using the stored token
   */
  async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Try to refresh token and retry
        const refreshed = await this.refreshToken();
        if (refreshed) {
          const newToken = this.getToken();
          if (newToken) {
            const retryResponse = await fetch(`${API_URL}/auth/profile`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${newToken}`,
              },
            });

            if (!retryResponse.ok) {
              return null;
            }

            const data = await retryResponse.json();
            return data.user;
          }
        }
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Get current user failed:', error);
      return null;
    }
  }

  /**
   * Helper methods for token management
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  setTokens(token: string, refreshToken: string): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  /**
   * Check if user is authenticated by verifying token existence and validity
   */
  async isAuthenticated(): Promise<boolean> {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Try to get current user to verify token validity
    const user = await this.getCurrentUser();
    return user !== null;
  }
}