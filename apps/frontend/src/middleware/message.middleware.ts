import Cookies from 'js-cookie'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export interface Message {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export const messageService = {
  async sendMessageWithStream(
    message: string,
    conversationId: string | undefined,
    onChunk: (chunk: string, conversationId: string) => void,
    onDone: (conversationId: string) => void,
  ): Promise<string> {
    // Get token from cookie (set by Firebase auth service)
    const token = Cookies.get('token')
    
    const response = await fetch(`${API_URL}/v1/conversation/messages`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message, conversation_id: conversationId }),
    })

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let conversationIdResult = conversationId || ''
    let fullResponse = ''

    if (!reader) {
      throw new Error('No response body')
    }

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))

            if (data.conversationId) {
              conversationIdResult = data.conversationId
            }

            if (data.chunk) {
              fullResponse += data.chunk
              onChunk(data.chunk, conversationIdResult)
            }

            if (data.error) {
              throw new Error(data.error)
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }

    onDone(conversationIdResult)
    return conversationIdResult
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const { default: axios } = await import('axios')
    const token = Cookies.get('token')
    const response = await axios.get(`${API_URL}/v1/conversations/${conversationId}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },
}
