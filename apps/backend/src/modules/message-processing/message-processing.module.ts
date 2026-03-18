import { Module } from '@nestjs/common'
import { MessageProcessorService } from './message-processor.service'
import { IntentDetectorService } from './intent-detector'
import { MessageRouterService } from './message-router'
import { QuestionDecomposerService } from './question-decomposer'
import { ContextAugmenterService } from './context-augmenter'

@Module({
  providers: [
    MessageProcessorService,
    IntentDetectorService,
    MessageRouterService,
    QuestionDecomposerService,
    ContextAugmenterService,
  ],
  exports: [MessageProcessorService],
})
export class MessageProcessingModule {}