import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../../ai/ai.service';
import { MessageHandler, HandlerRequest, HandlerResponse } from './message-handler.interface';

@Injectable()
export class GeneralAIHandler implements MessageHandler {
  private readonly logger = new Logger(GeneralAIHandler.name);

  constructor(private readonly aiService: AiService) {}

  async handle(request: HandlerRequest): Promise<HandlerResponse> {
    try {
      this.logger.log(`GeneralAIHandler processing message: ${request.message.substring(0, 50)}...`);

      const prompt = this.buildPrompt(request);

      const stream = this.aiService.sendMessage({
        message: prompt,
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
        shouldSave: true 
      };
    } catch (error) {
      this.logger.error('GeneralAIHandler failed', error);
      return {
        message: "I'm having trouble processing that request. Please try again.",
        shouldSave: false,
      };
    }
  }

  private buildPrompt(request: HandlerRequest): string {
    const contextSection = request.contexts
      .filter(ctx => ctx.content)
      .map(ctx => `[${ctx.source || 'unknown'}]: ${ctx.content}`)
      .join('\n');

    if (contextSection) {
      return `${contextSection}\n\nQuestion: ${request.message}`;
    }
    return request.message;
  }
}
