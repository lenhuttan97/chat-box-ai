import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../../ai/ai.service';
import { FilesService } from '../../files/files.service';
import { MessageHandler, HandlerRequest, HandlerResponse } from './message-handler.interface';

@Injectable()
export class FileAnalyzerHandler implements MessageHandler {
  private readonly logger = new Logger(FileAnalyzerHandler.name);

  constructor(
    private readonly aiService: AiService,
    private readonly filesService: FilesService,
  ) {}

  async handle(request: HandlerRequest): Promise<HandlerResponse> {
    try {
      this.logger.log(`FileAnalyzerHandler processing message: ${request.message.substring(0, 50)}...`);

      // 1. Extract file references from message
      const files = this.extractFileReferences(request.message);

      // 2. Get file contents (simplified - in real implementation would get actual file IDs from context)
      // For now, we'll use a placeholder implementation since we don't have file IDs in the request
      const fileContents = await this.getFileContents(files);

      // 3. Build analysis prompt
      const prompt = fileContents 
        ? `Analyze these files:\n${fileContents}\n\nQuestion: ${request.message}`
        : request.message;

      // 4. Send to AI
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
        shouldSave: true,
        metadata: { analyzedFiles: files } 
      };
    } catch (error) {
      this.logger.error('FileAnalyzerHandler failed', error);
      // Fallback response
      return {
        message: "I'm having trouble analyzing those files. Please try again.",
        shouldSave: false,
      };
    }
  }

  private extractFileReferences(message: string): string[] {
    // Simple implementation - look for common file patterns
    const filePatterns = [
      /\b\w+\.(txt|md|js|ts|jsx|tsx|json|yaml|yml|xml|html|css|scss|sass)\b/g,
      /\b\w+\.(pdf|doc|docx|xls|xlsx|ppt|pptx)\b/g,
      /\b\w+\.(jpg|jpeg|png|gif|bmp|svg)\b/g
    ];

    const files = new Set<string>();
    for (const pattern of filePatterns) {
      let match;
      while ((match = pattern.exec(message)) !== null) {
        files.add(match[0]);
      }
    }

    return Array.from(files);
  }

  private async getFileContents(fileNames: string[]): Promise<string> {
    // In a real implementation, we would look up actual file IDs from the context
    // For MVP, we'll return a placeholder indicating files were detected
    if (fileNames.length === 0) {
      return '';
    }

    return `Files detected: ${fileNames.join(', ')}\n` +
           "(Note: Actual file content extraction would be implemented here in production)";
  }
}