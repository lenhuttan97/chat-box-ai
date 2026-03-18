export type IntentType = 'question' | 'clarification' | 'task' | 'conversation' | 'file_query'

export interface IntentResult {
  intent: IntentType
  confidence: number
  entities?: Record<string, string>
  requiresDecomposition: boolean
}

export interface IntentDetectorConfig {
  minConfidence: number
  useLLM: boolean
}