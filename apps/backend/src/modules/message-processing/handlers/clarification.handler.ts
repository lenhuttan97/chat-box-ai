import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../../ai/ai.service';
import { MessageHandler, HandlerRequest, HandlerResponse } from './message-handler.interface';

@Injectable()
export class ClarificationHandler implements MessageHandler {
  private readonly logger = new Logger(ClarificationHandler.name);

  constructor(private readonly aiService: AiService) {}

  async handle(request: HandlerRequest): Promise<HandlerResponse> {
    try {
      this.logger.log(`ClarificationHandler processing message: ${request.message.substring(0, 50)}...`);

      // Generate clarifying questions
      const clarificationPrompt = `The user's message is unclear or ambiguous. Ask a specific, helpful question to clarify what they need: "${request.message}"`;

      const stream = this.aiService.sendMessage({
        message: clarificationPrompt,
        conversationId: request.conversationId,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        if (chunk.chunk) {
          fullResponse += chunk.chunk;
        }
      }

      return { 
        message: fullResponse, 
        shouldSave: false,  // Don't save clarification to history
      };
    } catch (error) {
      this.logger.error('ClarificationHandler failed', error);
      // Fallback response
      return {
        message: "I'm not sure I understand. Could you please clarify what you're asking for?",
        shouldSave: false,
      };
    }
  }
}