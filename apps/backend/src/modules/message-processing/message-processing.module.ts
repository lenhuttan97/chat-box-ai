import { Module } from '@nestjs/common'
import { MessageProcessorService } from './message-processor.service'
import { IntentDetectorService } from './intent-detector'
import { MessageRouterService } from './message-router'
import { QuestionDecomposerService } from './question-decomposer'
import { ContextAugmenterService } from './context-augmenter'
import { GeneralAIHandler } from './handlers/general-ai.handler'
import { TaskHandler } from './handlers/task.handler'
import { FileAnalyzerHandler } from './handlers/file-analyzer.handler'
import { ClarificationHandler } from './handlers/clarification.handler'

@Module({
  providers: [
    MessageProcessorService,
    IntentDetectorService,
    MessageRouterService,
    QuestionDecomposerService,
    ContextAugmenterService,
    GeneralAIHandler,
    TaskHandler,
    FileAnalyzerHandler,
    ClarificationHandler,
  ],
  exports: [MessageProcessorService],
})
export class MessageProcessingModule {}