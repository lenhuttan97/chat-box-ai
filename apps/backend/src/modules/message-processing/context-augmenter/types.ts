export type ContextSource = 'history' | 'file' | 'profile' | 'web'

export interface ContextItem {
  source: ContextSource
  content: string
  relevanceScore: number
}

export interface AugmentationResult {
  contextItems: ContextItem[]
  augmentedPrompt: string
}