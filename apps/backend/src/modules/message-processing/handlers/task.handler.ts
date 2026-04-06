import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../../ai/ai.service';
import { MessageHandler, HandlerRequest, HandlerResponse } from './message-handler.interface';

@Injectable()
export class TaskHandler implements MessageHandler {
  private readonly logger = new Logger(TaskHandler.name);

  private taskPrompts = {
    write_code: 'Write clean, working code for: ',
    summarize: 'Summarize the following concisely: ',
    create: 'Create/Draft: ',
    analyze: 'Analyze and explain: ',
  };

  constructor(private readonly aiService: AiService) {}

  async handle(request: HandlerRequest): Promise<HandlerResponse> {
    try {
      this.logger.log(`TaskHandler processing message: ${request.message.substring(0, 50)}...`);

      const taskType = this.detectTaskType(request.message);
      const prompt = this.taskPrompts[taskType] + request.message;

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
      this.logger.error('TaskHandler failed', error);
      // Fallback response
      return {
        message: "I'm having trouble processing that task request. Please try again.",
        shouldSave: false,
      };
    }
  }

  private detectTaskType(message: string): keyof typeof this.taskPrompts {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('write') && 
        (lowerMessage.includes('code') || lowerMessage.includes('function') || 
         lowerMessage.includes('script') || lowerMessage.includes('program'))) {
      return 'write_code';
    }
    
    if (lowerMessage.includes('summarize') || lowerMessage.includes('summary')) {
      return 'summarize';
    }
    
    if (lowerMessage.includes('create') || lowerMessage.includes('draft') || 
        lowerMessage.includes('write') && lowerMessage.includes('email') ||
        lowerMessage.includes('write') && lowerMessage.includes('letter')) {
      return 'create';
    }
    
    // Default to analyze for other task-like requests
    return 'analyze';
  }
}