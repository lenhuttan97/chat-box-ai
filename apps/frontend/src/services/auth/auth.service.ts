import { User, AuthResponse } from '../../types';
import { FirebaseAuthService } from '../firebase/firebaseService';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Gets the proper API endpoint considering the backend might have global prefix
 * If API_URL is something like 'http://localhost:3000', we need to add the full path
 * If API_URL already includes the prefix like 'http://localhost:3000/api/v1', we use it directly
 */
const getApiEndpoint = (path: string): string => {
  const apiUrl = API_URL || '';
  // Check if the API_URL already includes our expected path structure
  if (apiUrl.includes('/api/v1')) {
    // API URL already includes version (e.g., http://localhost:3000/api/v1), so just append the path
    return `${apiUrl}${path}`;
  } else {
    // API URL doesn't include version, so add /api/v1 prefix (e.g., http://localhost:3000 becomes http://localhost:3000/api/v1)
    return `${apiUrl}/api/v1${path}`;
  }
};

/**
 * Authentication Service for handling API calls to backend auth endpoints
 */
export class AuthService {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(getApiEndpoint('/auth/login'), {
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
    const response = await fetch(getApiEndpoint('/auth/register'), {
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
  async googleLogin(): Promise<AuthResponse> {
    try {
      // First, authenticate with Firebase to get the ID token
      const firebaseUser = await FirebaseAuthService.signInWithGoogle();
      const idToken = await FirebaseAuthService.getIdToken();

      // Then send the ID token to our backend to get our own JWT
      const response = await fetch(getApiEndpoint('/auth/google'), {
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
    } catch (error) {
      console.error('Google login error:', error);
      throw new Error('Google login failed');
    }
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
      const response = await fetch(getApiEndpoint('/auth/refresh-token'), {
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
      await fetch(getApiEndpoint('/auth/logout'), {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage regardless of API call success
      this.clearTokens();
      // Also sign out from Firebase
      try {
        await FirebaseAuthService.signOut();
      } catch (firebaseError) {
        console.error('Firebase sign out failed:', firebaseError);
      }
    }
  }

  /**
   * Update user password
   */
  async updatePassword(oldPassword: string, newPassword: string, token: string): Promise<void> {
    const response = await fetch(getApiEndpoint('/auth/password'), {
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
    const response = await fetch(getApiEndpoint('/auth/profile'), {
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
      const response = await fetch(getApiEndpoint('/auth/profile'), {
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
            const retryResponse = await fetch(getApiEndpoint('/auth/profile'), {
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
    return Cookies.get('token') || null;
  }

  getRefreshToken(): string | null {
    return Cookies.get('refresh_token') || null;
  }

  setToken(token: string): void {
    // Set cookie with same settings as backend (max age: 60 minutes)
    Cookies.set('token', token, {
      httpOnly: false, // Can be accessed by JS since we need to read it
      secure: location.protocol === 'https:',
      sameSite: 'lax',
      expires: new Date(Date.now() + 60 * 60 * 1000) // 60 minutes
    });
  }

  setTokens(token: string, refreshToken: string): void {
    // Set both tokens with appropriate expiration
    Cookies.set('token', token, {
      httpOnly: false, // Can be accessed by JS since we need to read it
      secure: location.protocol === 'https:',
      sameSite: 'lax',
      expires: new Date(Date.now() + 60 * 60 * 1000) // 60 minutes
    });

    Cookies.set('refresh_token', refreshToken, {
      httpOnly: false, // Can be accessed by JS since we need to read it
      secure: location.protocol === 'https:',
      sameSite: 'lax',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
  }

  clearTokens(): void {
    Cookies.remove('token');
    Cookies.remove('refresh_token');
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