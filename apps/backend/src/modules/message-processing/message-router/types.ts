export type HandlerType = 'general_ai' | 'file_analyzer' | 'web_search' | 'clarifier' | 'task_handler'

export interface RouteResult {
  handler: HandlerType
  processedMessage: string
  context?: Record<string, unknown>
}

export const HANDLER_INTENT_MAP: Record<string, HandlerType> = {
  question: 'general_ai',
  clarification: 'clarifier',
  task: 'task_handler',
  conversation: 'general_ai',
  file_query: 'file_analyzer',
}