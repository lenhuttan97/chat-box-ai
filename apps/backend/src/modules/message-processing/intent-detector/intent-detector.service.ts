import { Injectable, Logger } from '@nestjs/common'
import { IntentResult, IntentType, IntentDetectorConfig } from './types'

@Injectable()
export class IntentDetectorService {
  private readonly logger = new Logger(IntentDetectorService.name)

  private readonly config: IntentDetectorConfig = {
    minConfidence: 0.7,
    useLLM: false,
  }

  private readonly intentPatterns: Record<IntentType, RegExp[]> = {
    question: [
      /\b(what|how|why|when|where|who|which)\b/i,
      /\b(explain|describe|define|clarify)\b/i,
      /\b(is it|are there|can you|do you)\b/i,
      /\?\s*$/,
    ],
    clarification: [
      /\b(what do you mean|i don't understand|not clear|confused)\b/i,
      /^\s*(repeat|again|say again)\b/i,
      /\b(excuse me|pardon)\b/i,
    ],
    task: [
      /\b(write|create|generate|build|make|do)\b/i,
      /\b(summarize|convert|translate|fix|debug)\b/i,
      /\b(schedule|send|tell)\b/i,
    ],
    conversation: [
      /^(hi|hello|hey|thanks|thank you|ok|okay|bye|goodbye)\b/i,
      /^(yes|no|sure|please)\b$/i,
    ],
    file_query: [
      /\b(file|document|pdf|code|source)\b/i,
      /\b(analyze|review|check)\b.*\b(file|code)\b/i,
      /\b(this file|that file|the file)\b/i,
    ],
  }

  detect(message: string): IntentResult {
    const trimmedMessage = message.trim().toLowerCase()

    const scores = this.calculateScores(trimmedMessage)

    const sortedIntents = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)

    const [topIntent, topScore] = sortedIntents[0]

    if (topScore < this.config.minConfidence) {
      return {
        intent: 'conversation',
        confidence: 0.5,
        requiresDecomposition: false,
      }
    }

    const requiresDecomposition = this.checkRequiresDecomposition(trimmedMessage, topIntent as IntentType)

    this.logger.log(`Detected intent: ${topIntent} (${topScore.toFixed(2)})`)

    return {
      intent: topIntent as IntentType,
      confidence: topScore,
      requiresDecomposition,
    }
  }

  private calculateScores(message: string): Record<IntentType, number> {
    const scores: Record<IntentType, number> = {
      question: 0,
      clarification: 0,
      task: 0,
      conversation: 0,
      file_query: 0,
    }

    for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(message)) {
          scores[intent as IntentType] += 1
        }
      }
    }

    const maxScore = Math.max(...Object.values(scores), 1)
    for (const intent of Object.keys(scores) as IntentType[]) {
      scores[intent] = scores[intent] / maxScore
    }

    return scores
  }

  private checkRequiresDecomposition(message: string, intent: IntentType): boolean {
    if (intent !== 'question') return false

    const decompositionIndicators = [
      /\band\b/i,
      /\balso\b/i,
      /\bplus\b/i,
      /\bwith\b/i,
      /,\s*(and|also)/i,
    ]

    const hasMultipleParts = decompositionIndicators.some(pattern => pattern.test(message))
    const isLongMessage = message.length > 100

    return hasMultipleParts || isLongMessage
  }
}