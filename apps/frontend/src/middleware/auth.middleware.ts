const API_URL = import.meta.env.VITE_API_URL || '/api'

export interface AuthResponse {
  user: {
    id: string
    email: string | null
    displayName: string | null
    photoUrl: string | null
  }
  token: string
}

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
    
    return response.json()
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
    
    return response.json()
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
    
    return response.json()
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
    localStorage.removeItem('user')
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token')
  },

  setToken(token: string): void {
    localStorage.setItem('auth_token', token)
  },
}