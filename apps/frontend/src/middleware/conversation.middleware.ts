import axios from 'axios'
import Cookies from 'js-cookie'
import { getDeviceInfo, getDeviceId } from '../utils/device'
import { Message,  Conversation} from '../types'

const API_URL = import.meta.env.VITE_API_URL || ''

const getApiEndpoint = (path: string): string => {
  // Check if the API_URL already includes our expected path structure
  if (API_URL.includes('/api/v')) {
    // API URL already includes version (e.g., http://localhost:3000/api/v1), so just append the path
    return `${API_URL}${path}`;
  } else {
    // API URL doesn't include version, so add /api/v1 prefix (e.g., http://localhost:3000 becomes http://localhost:3000/api/v1)
    return `${API_URL}/api/v1${path}`;
  }
}

const getDeviceHeader = () => {
  const deviceInfo = getDeviceInfo()
  return { 'X-Device-Info': JSON.stringify(deviceInfo) }
}

export const conversationService = {
  async getConversations(): Promise<Conversation[]> {
    const token = Cookies.get('token')
    const deviceId = getDeviceId()

    let url = ''
    let headers: Record<string, string> = {}

    if (token) {
      url = getApiEndpoint('/conversations')
      headers = { Authorization: `Bearer ${token}` }
    } else {
      url = getApiEndpoint(`/conversations/device/${deviceId}`)
      headers = getDeviceHeader()
    }

    const response = await axios.get(url, { headers })
    return response.data.data
  },

  async getConversation(id: string): Promise<Conversation> {
    const token = Cookies.get('token')
    const response = await axios.get(getApiEndpoint(`/conversations/${id}`), {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        ...getDeviceHeader()
      }
    })
    return response.data.data
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const token = Cookies.get('token')
    const response = await axios.get(getApiEndpoint(`/conversations/${conversationId}/messages`), {
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

    let url = ''
    let headers: Record<string, string> = {}
    let body: Record<string, unknown> = { ...data }

    if (token) {
      url = getApiEndpoint('/conversations')
      headers = { Authorization: `Bearer ${token}` }
    } else {
      url = getApiEndpoint('/conversations')
      headers = getDeviceHeader()
      body.deviceId = deviceId
    }

    const response = await axios.post(url, body, { headers })
    return response.data.data
  },

  async updateConversation(
    id: string,
    data: { name?: string; systemPrompt?: string; autoPrompt?: string; temperature?: number; maxTokens?: number; contextToken?: number }
  ): Promise<Conversation> {
    const token = Cookies.get('token')
    const response = await axios.put(getApiEndpoint(`/conversations/${id}`), data, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        ...getDeviceHeader()
      }
    })
    return response.data.data
  },

  async deleteConversation(id: string): Promise<void> {
    const token = Cookies.get('token')
    await axios.delete(getApiEndpoint(`/conversations/${id}`), {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        ...getDeviceHeader()
      }
    })
  },
}