import { Injectable, Logger } from '@nestjs/common'
import { IntentResult } from '../intent-detector'
import { RouteResult, HandlerType, HANDLER_INTENT_MAP } from './types'

@Injectable()
export class MessageRouterService {
  private readonly logger = new Logger(MessageRouterService.name)

  route(message: string, intentResult: IntentResult): RouteResult {
    const handler = this.getHandler(intentResult.intent)

    this.logger.log(`Routing to: ${handler} (intent: ${intentResult.intent})`)

    return {
      handler,
      processedMessage: message,
      context: {
        intent: intentResult.intent,
        confidence: intentResult.confidence,
        entities: intentResult.entities,
      },
    }
  }

  private getHandler(intent: string): HandlerType {
    return HANDLER_INTENT_MAP[intent] || 'general_ai'
  }

  getHandlerConfig(handler: HandlerType): Record<string, unknown> {
    const configs: Record<HandlerType, Record<string, unknown>> = {
      general_ai: {
        temperature: 0.7,
        maxTokens: 2048,
        includeContext: true,
      },
      file_analyzer: {
        temperature: 0.3,
        maxTokens: 4096,
        includeFileContent: true,
      },
      web_search: {
        searchEnabled: true,
        maxResults: 5,
      },
      clarifier: {
        askClarification: true,
        maxRetries: 2,
      },
      task_handler: {
        temperature: 0.5,
        maxTokens: 4096,
        taskSpecificPrompt: true,
      },
    }

    return configs[handler] || configs.general_ai
  }
}