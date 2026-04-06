import { Injectable, Logger } from '@nestjs/common';
import { IntentResult } from '../intent-detector/types';
import { 
  MessageHandler, 
  HandlerRequest, 
  HandlerResponse 
} from '../handlers/message-handler.interface';
import { 
  GeneralAIHandler 
} from '../handlers/general-ai.handler';
import { 
  TaskHandler 
} from '../handlers/task.handler';
import { 
  FileAnalyzerHandler 
} from '../handlers/file-analyzer.handler';
import { 
  ClarificationHandler 
} from '../handlers/clarification.handler';

export type HandlerType = 'general_ai' | 'file_analyzer' | 'web_search' | 'clarifier' | 'task_handler';

export interface RouteResult {
  handler: HandlerType;
  processedMessage: string;
  context?: Record<string, unknown>;
}

@Injectable()
export class MessageRouterService {
  private readonly logger = new Logger(MessageRouterService.name);
  
  // Handler registry for dynamic registration
  private handlerRegistry: Map<HandlerType, MessageHandler> = new Map();

  constructor(
    private readonly generalAIHandler: GeneralAIHandler,
    private readonly taskHandler: TaskHandler,
    private readonly fileHandler: FileAnalyzerHandler,
    private readonly clarificationHandler: ClarificationHandler,
  ) {
    // Register default handlers
    this.registerHandler('general_ai', this.generalAIHandler);
    this.registerHandler('task_handler', this.taskHandler);
    this.registerHandler('file_analyzer', this.fileHandler);
    this.registerHandler('clarifier', this.clarificationHandler);
  }

  /**
   * Register a handler dynamically
   */
  registerHandler(type: HandlerType, handler: MessageHandler): void {
    this.logger.log(`Registering handler for type: ${type}`);
    this.handlerRegistry.set(type, handler);
  }

  /**
   * Unregister a handler
   */
  unregisterHandler(type: HandlerType): void {
    this.logger.log(`Unregistering handler for type: ${type}`);
    this.handlerRegistry.delete(type);
  }

  /**
   * Check if a handler type is registered
   */
  hasHandler(type: HandlerType): boolean {
    return this.handlerRegistry.has(type);
  }

   /**
    * Route a message to the appropriate handler based on intent
    */
   async route(
     message: string, 
     conversationId: string, 
     intentResult: IntentResult,
     contexts: Record<string, unknown>[] = []
   ): Promise<RouteResult> {
     try {
       this.logger.log(`Routing message: ${message.substring(0, 50)}...`);
       
       // Create handler request
       const request: HandlerRequest = {
         message,
         intent: intentResult.intent,
         contexts,
         conversationId,
         userId: 'current-user', // In real implementation, this would come from auth context
       };

       // Get handler type for intent
       const handlerType = this.getHandlerType(intentResult.intent);
       
       // Get handler from registry
       const handler = this.handlerRegistry.get(handlerType);
       
       let handlerResponse: HandlerResponse;
       let usedHandlerType: HandlerType = handlerType;
       
       if (!handler) {
         this.logger.warn(`No handler registered for type: ${handlerType}, falling back to general_ai`);
         usedHandlerType = 'general_ai';
         handlerResponse = await this.generalAIHandler.handle(request);
       } else {
         this.logger.log(`Routing to handler: ${handlerType}`);
         
         // Handle the request
         handlerResponse = await handler.handle(request);
       }

       // Return route result with handler info and processed message
       return {
         handler: usedHandlerType,
         processedMessage: handlerResponse.message,
         context: contexts.length > 0 ? contexts[0] : undefined
       };
     } catch (error) {
       // Graceful error handling - fallback to general AI handler
       this.logger.error(`Routing failed: ${error.message}`, error.stack);
       
       try {
         // Try to use general AI handler as fallback
         const fallbackRequest: HandlerRequest = {
           message,
           intent: 'question', // Default intent for fallback
           contexts,
           conversationId,
           userId: 'current-user',
         };
         
         const fallbackResponse = await this.generalAIHandler.handle(fallbackRequest);
         
         // Return route result with fallback handler info
         return {
           handler: 'general_ai',
           processedMessage: fallbackResponse.message,
           context: contexts.length > 0 ? contexts[0] : undefined
         };
       } catch (fallbackError) {
         this.logger.error('Fallback handler also failed', fallbackError);
         
         // Last resort response
         return {
           handler: 'general_ai',
           processedMessage: "I'm experiencing technical difficulties. Please try again later.",
           context: undefined
         };
       }
     }
   }

  /**
   * Map intent to handler type
   */
  private getHandlerType(intent: string): HandlerType {
    const intentMap: Record<string, HandlerType> = {
      question: 'general_ai',
      conversation: 'general_ai',
      clarification: 'clarifier',
      task: 'task_handler',
      file_query: 'file_analyzer',
    };
    
    return intentMap[intent] || 'general_ai';
  }
}