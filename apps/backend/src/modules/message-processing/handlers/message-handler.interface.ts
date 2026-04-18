export interface MessageHandler {
  handle(request: HandlerRequest): Promise<HandlerResponse>;
}

export interface HandlerRequest {
  message: string;
  intent: string;
  contexts: Record<string, unknown>[];
  conversationId: string;
  userId: string;
}

export interface HandlerResponse {
  message: string;
  shouldSave: boolean;
  metadata?: Record<string, any>;
}