import { Injectable, Logger } from '@nestjs/common'
import { DecompositionResult, SubQuestion } from './types'

@Injectable()
export class QuestionDecomposerService {
  private readonly logger = new Logger(QuestionDecomposerService.name)

  decompose(message: string): DecompositionResult {
    const canDecompose = this.checkCanDecompose(message)

    if (!canDecompose) {
      return {
        canDecompose: false,
        subQuestions: [],
      }
    }

    const subQuestions = this.ruleBasedDecompose(message)

    this.logger.log(`Decomposed into ${subQuestions.length} sub-questions`)

    return {
      canDecompose: true,
      subQuestions,
    }
  }

  private checkCanDecompose(message: string): boolean {
    const decompositionIndicators = [
      /\b(and|also|plus)\b/i,
      /,\s*(and|also)/i,
      /\bwith\b.*\b(both|all)\b/i,
    ]

    const hasMultipleParts = decompositionIndicators.some(pattern => pattern.test(message))
    const isLongEnough = message.length > 50

    return hasMultipleParts || (isLongEnough && message.includes('?'))
  }

  private ruleBasedDecompose(message: string): SubQuestion[] {
    const subQuestions: SubQuestion[] = []

    const parts = message.split(/\s+(?:and|also|plus|,)\s+/i)

    if (parts.length > 1) {
      parts.forEach((part, index) => {
        const cleaned = part.trim()
        if (cleaned && this.isQuestionLike(cleaned)) {
          subQuestions.push({
            subQuestion: this.normalizeQuestion(cleaned),
            priority: index + 1,
          })
        }
      })
    }

    if (subQuestions.length === 0 && message.includes('?')) {
      const questionWords = ['what', 'how', 'why', 'when', 'where', 'which', 'who']
      const words = message.split(/\s+/)
      
      const questionIndices = words
        .map((word, idx) => questionWords.includes(word.toLowerCase()) ? idx : -1)
        .filter(idx => idx !== -1)

      if (questionIndices.length > 1) {
        questionIndices.forEach((idx, i) => {
          const subQ = words.slice(idx).join(' ')
          if (subQ) {
            subQuestions.push({
              subQuestion: subQ,
              priority: i + 1,
            })
          }
        })
      }
    }

    if (subQuestions.length === 0) {
      subQuestions.push({
        subQuestion: message,
        priority: 1,
      })
    }

    return subQuestions
  }

  private isQuestionLike(text: string): boolean {
    const questionIndicators = [
      /\b(what|how|why|when|where|which|who)\b/i,
      /\?$/,
      /\b(explain|describe|show|compare)\b/i,
    ]
    return questionIndicators.some(pattern => pattern.test(text))
  }

  private normalizeQuestion(text: string): string {
    let normalized = text.trim()
    
    if (!normalized.endsWith('?') && !normalized.endsWith('.')) {
      normalized += '?'
    }
    
    return normalized
  }
}