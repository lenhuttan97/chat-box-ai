import { AuthResponse } from '../types'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export const authMiddleware = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }
    
    const data = await response.json()
    this.setTokens(data.token, data.refreshToken)
    return data
  },

  async register(email: string, password: string, displayName?: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Register failed')
    }
    
    const data = await response.json()
    this.setTokens(data.token, data.refreshToken)
    return data
  },

  async googleLogin(idToken: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Google login failed')
    }
    
    const data = await response.json()
    this.setTokens(data.token, data.refreshToken)
    return data
  },

  async refreshToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      return false
    }

    try {
      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()
      this.setTokens(data.token, data.refreshToken)
      return true
    } catch (_error) {
      return false
    }
  },

  async updatePassword(oldPassword: string, newPassword: string, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/auth/password`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Update password failed')
    }
  },

  async updateProfile(displayName: string, photoUrl: string, token: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ displayName, photoUrl }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Update profile failed')
    }
    
    return response.json()
  },

  logout(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token')
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token')
  },

  setToken(token: string): void {
    localStorage.setItem('auth_token', token)
  },

  setTokens(token: string, refreshToken: string): void {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('refresh_token', refreshToken)
  },
}