import { Injectable, Logger } from '@nestjs/common'
import { ContextItem, AugmentationResult, ContextSource } from './types'

@Injectable()
export class ContextAugmenterService {
  private readonly logger = new Logger(ContextAugmenterService.name)
  private readonly maxContextItems = 5

  async augment(
    message: string,
    conversationId: string,
    history: Array<{ role: string; content: string }> = [],
  ): Promise<AugmentationResult> {
    const contextItems: ContextItem[] = []

    const historyItems = this.getRelevantHistory(message, history)
    contextItems.push(...historyItems)

    const sortedItems = contextItems
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, this.maxContextItems)

    const augmentedPrompt = this.buildAugmentedPrompt(message, sortedItems)

    this.logger.log(`Augmented with ${sortedItems.length} context items`)

    return {
      contextItems: sortedItems,
      augmentedPrompt,
    }
  }

  private getRelevantHistory(
    message: string,
    history: Array<{ role: string; content: string }>,
  ): ContextItem[] {
    if (!history || history.length === 0) return []

    const messageWords = new Set(message.toLowerCase().split(/\s+/))
    const relevantHistory: ContextItem[] = []

    const recentMessages = history.slice(-10)

    for (const msg of recentMessages) {
      const contentWords = msg.content.toLowerCase().split(/\s+/)
      const intersection = contentWords.filter(word => messageWords.has(word))
      const score = intersection.length / Math.max(messageWords.size, 1)

      if (score > 0.1) {
        relevantHistory.push({
          source: 'history',
          content: msg.content,
          relevanceScore: score,
        })
      }
    }

    return relevantHistory
  }

  private buildAugmentedPrompt(message: string, contextItems: ContextItem[]): string {
    if (contextItems.length === 0) return message

    const contextSection = contextItems
      .map(item => `[Context (${item.source})]: ${item.content}`)
      .join('\n')

    return `${contextSection}\n\n[User Message]: ${message}`
  }
}