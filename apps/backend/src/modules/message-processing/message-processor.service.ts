import { Injectable, Logger } from '@nestjs/common'
import { IntentDetectorService } from './intent-detector'
import { MessageRouterService, RouteResult } from './message-router'
import { QuestionDecomposerService } from './question-decomposer'
import { ContextAugmenterService } from './context-augmenter'
import { IntentResult } from './intent-detector/types'
import { DecompositionResult } from './question-decomposer/types'
import { AugmentationResult } from './context-augmenter/types'

export interface ProcessingResult {
  originalMessage: string
  processedMessage: string
  intent: IntentResult
  decomposition: DecompositionResult
  route: RouteResult
  augmentation: AugmentationResult
}

@Injectable()
export class MessageProcessorService {
  private readonly logger = new Logger(MessageProcessorService.name)

  constructor(
    private readonly intentDetector: IntentDetectorService,
    private readonly router: MessageRouterService,
    private readonly decomposer: QuestionDecomposerService,
    private readonly contextAugmenter: ContextAugmenterService,
  ) {}

   async process(
    message: string,
    conversationId: string,
    history: Array<{ role: string; content: string }> = [],
  ): Promise<ProcessingResult> {
    this.logger.log('Processing message through pipeline')

    const intent = this.intentDetector.detect(message)

    const route = await this.router.route(message, conversationId, intent, [])

    const decomposition = intent.requiresDecomposition
      ? this.decomposer.decompose(message)
      : { canDecompose: false, subQuestions: [] }

    const augmentation = await this.contextAugmenter.augment(
      message,
      conversationId,
      history,
    )

    const processedMessage = decomposition.canDecompose
      ? decomposition.subQuestions.map(sq => sq.subQuestion).join(' | ')
      : augmentation.augmentedPrompt

    return {
      originalMessage: message,
      processedMessage,
      intent,
      decomposition,
      route,
      augmentation,
    }
  }
}