import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export interface Message {
  id: string
  conversationId?: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface Conversation {
  id: string
  name: string
  userId?: string
  systemPrompt?: string
  autoPrompt?: string
  contextToken: number
  temperature: number
  maxTokens: number
  messageCount: number
  createdAt: string
  updatedAt: string
}

export const conversationService = {
  async getConversations(): Promise<Conversation[]> {
    const token = Cookies.get('token')
    const response = await axios.get(`${API_URL}/v1/conversations`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async getConversation(id: string): Promise<Conversation> {
    const token = Cookies.get('token')
    const response = await axios.get(`${API_URL}/v1/conversations/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const token = Cookies.get('token')
    const response = await axios.get(`${API_URL}/v1/conversations/${conversationId}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async createConversation(data: { name: string }): Promise<Conversation> {
    const token = Cookies.get('token')
    const response = await axios.post(`${API_URL}/v1/conversations`, data, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async updateConversation(
    id: string,
    data: { name?: string; systemPrompt?: string; autoPrompt?: string; temperature?: number; maxTokens?: number; contextToken?: number }
  ): Promise<Conversation> {
    const token = Cookies.get('token')
    const response = await axios.patch(`${API_URL}/v1/conversations/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async deleteConversation(id: string): Promise<void> {
    const token = Cookies.get('token')
    await axios.delete(`${API_URL}/v1/conversations/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  },
}
