import axios from 'axios'
import Cookies from 'js-cookie'
import { getDeviceInfo, getDeviceId } from '../utils/device'
import { Message,  Conversation} from '../types'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const getDeviceHeader = () => {
  const deviceInfo = getDeviceInfo()
  return { 'X-Device-Info': JSON.stringify(deviceInfo) }
}

export const conversationService = {
  async getConversations(): Promise<Conversation[]> {
    const token = Cookies.get('token')
    const deviceId = getDeviceId()
    
    let url = `${API_URL}/v1/conversations`
    let headers: Record<string, string> = {}
    
    if (token) {
      headers = { Authorization: `Bearer ${token}` }
    } else {
      url = `${API_URL}/v1/conversations/device/${deviceId}`
      headers = getDeviceHeader()
    }
    
    const response = await axios.get(url, { headers })
    return response.data.data
  },

  async getConversation(id: string): Promise<Conversation> {
    const token = Cookies.get('token')
    const response = await axios.get(`${API_URL}/v1/conversations/${id}`, {
      headers: { 
        Authorization: token ? `Bearer ${token}` : '',
        ...getDeviceHeader()
      }
    })
    return response.data.data
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const token = Cookies.get('token')
    const response = await axios.get(`${API_URL}/v1/conversations/${conversationId}/messages`, {
      headers: { 
        Authorization: token ? `Bearer ${token}` : '',
        ...getDeviceHeader()
      }
    })
    return response.data.data
  },

  async createConversation(data: { name: string }): Promise<Conversation> {
    const token = Cookies.get('token')
    const deviceId = getDeviceId()
    
    let headers: Record<string, string> = {}
    let body: Record<string, unknown> = { ...data }
    
    if (token) {
      headers = { Authorization: `Bearer ${token}` }
    } else {
      headers = getDeviceHeader()
      body.deviceId = deviceId
    }
    
    const response = await axios.post(`${API_URL}/v1/conversations`, body, { headers })
    return response.data.data
  },

  async updateConversation(
    id: string,
    data: { name?: string; systemPrompt?: string; autoPrompt?: string; temperature?: number; maxTokens?: number; contextToken?: number }
  ): Promise<Conversation> {
    const token = Cookies.get('token')
    const response = await axios.put(`${API_URL}/v1/conversations/${id}`, data, {
      headers: { 
        Authorization: token ? `Bearer ${token}` : '',
        ...getDeviceHeader()
      }
    })
    return response.data.data
  },

  async deleteConversation(id: string): Promise<void> {
    const token = Cookies.get('token')
    await axios.delete(`${API_URL}/v1/conversations/${id}`, {
      headers: { 
        Authorization: token ? `Bearer ${token}` : '',
        ...getDeviceHeader()
      }
    })
  },
}
