import { User } from '../types'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export const userMiddleware = {
  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    
    if (!response.ok) {
      throw new Error('Failed to get user')
    }
    
    const data = await response.json()
    return data.data
  },

  async getUserProfile(userId: string, token: string): Promise<User> {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    
    if (!response.ok) {
      throw new Error('Failed to get profile')
    }
    
    const data = await response.json()
    return data.data
  },

  async updateUser(userId: string, data: Partial<User>, token: string): Promise<User> {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update user')
    }
    
    const result = await response.json()
    return result.data
  },

  async updateTheme(themeSetting: 'light' | 'dark' | 'auto', token: string): Promise<User> {
    const response = await fetch(`${API_URL}/users/me/theme`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ themeSetting }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update theme')
    }
    
    const result = await response.json()
    return result.data
  },
}