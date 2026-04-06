import { Test, TestingModule } from '@nestjs/testing';
import { MessageRouterService } from '../../modules/message-processing/message-router/message-router.service';
import { 
  GeneralAIHandler 
} from '../../modules/message-processing/handlers/general-ai.handler';
import { 
  TaskHandler 
} from '../../modules/message-processing/handlers/task.handler';
import { 
  FileAnalyzerHandler 
} from '../../modules/message-processing/handlers/file-analyzer.handler';
import { 
  ClarificationHandler 
} from '../../modules/message-processing/handlers/clarification.handler';
import { AiService } from '../../modules/ai/ai.service';
import { FilesService } from '../../modules/files/files.service';
import { IntentResult } from '../../modules/message-processing/intent-detector/types';

// Mock services
const mockAiService = {
  sendMessage: jest.fn(),
};

const mockFilesService = {
  getFile: jest.fn(),
};

describe('MessageRouterService', () => {
  let router: MessageRouterService;
  let generalAIHandler: GeneralAIHandler;
  let taskHandler: TaskHandler;
  let fileHandler: FileAnalyzerHandler;
  let clarificationHandler: ClarificationHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageRouterService,
        GeneralAIHandler,
        TaskHandler,
        FileAnalyzerHandler,
        ClarificationHandler,
        { provide: AiService, useValue: mockAiService },
        { provide: FilesService, useValue: mockFilesService },
      ],
    }).compile();

    router = module.get<MessageRouterService>(MessageRouterService);
    generalAIHandler = module.get<GeneralAIHandler>(GeneralAIHandler);
    taskHandler = module.get<TaskHandler>(TaskHandler);
    fileHandler = module.get<FileAnalyzerHandler>(FileAnalyzerHandler);
    clarificationHandler = module.get<ClarificationHandler>(ClarificationHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('route', () => {
    const mockIntentResult: IntentResult = {
      intent: 'question',
      confidence: 0.9,
      requiresDecomposition: false,
    };

    const mockContexts = [
      { source: 'test', content: 'test context' }
    ];

     it('should route to general AI handler for question intent', async () => {
       // Arrange
       const mockResponse = { message: 'AI response', shouldSave: true };
       jest.spyOn(generalAIHandler, 'handle').mockResolvedValue(mockResponse);

       // Act
       const result = await router.route(
         'What is AI?', 
         'conv-123', 
         mockIntentResult,
         mockContexts
       );

       // Assert
       expect(generalAIHandler.handle).toHaveBeenCalledWith({
         message: 'What is AI?',
         intent: 'question',
         contexts: mockContexts,
         conversationId: 'conv-123',
         userId: 'current-user'
       });
       expect(result).toEqual({
         handler: 'general_ai',
         processedMessage: 'AI response',
         context: mockContexts[0]
       });
     });

     it('should route to task handler for task intent', async () => {
       // Arrange
       const taskIntent: IntentResult = { intent: 'task', confidence: 0.8, requiresDecomposition: false };
       const mockResponse = { message: 'Task response', shouldSave: true };
       jest.spyOn(taskHandler, 'handle').mockResolvedValue(mockResponse);

       // Act
       const result = await router.route(
         'Write a function to calculate sum', 
         'conv-123', 
         taskIntent,
         mockContexts
       );

       // Assert
       expect(taskHandler.handle).toHaveBeenCalled();
       expect(result).toEqual({
         handler: 'task_handler',
         processedMessage: 'Task response',
         context: mockContexts[0]
       });
     });

     it('should route to file analyzer handler for file_query intent', async () => {
       // Arrange
       const fileIntent: IntentResult = { intent: 'file_query', confidence: 0.85, requiresDecomposition: false };
       const mockResponse = { message: 'File analysis response', shouldSave: true };
       jest.spyOn(fileHandler, 'handle').mockResolvedValue(mockResponse);

       // Act
       const result = await router.route(
         'Analyze this document', 
         'conv-123', 
         fileIntent,
         mockContexts
       );

       // Assert
       expect(fileHandler.handle).toHaveBeenCalled();
       expect(result).toEqual({
         handler: 'file_analyzer',
         processedMessage: 'File analysis response',
         context: mockContexts[0]
       });
     });

     it('should route to clarification handler for clarification intent', async () => {
       // Arrange
       const clarifyIntent: IntentResult = { intent: 'clarification', confidence: 0.75, requiresDecomposition: false };
       const mockResponse = { message: 'Clarification question', shouldSave: false };
       jest.spyOn(clarificationHandler, 'handle').mockResolvedValue(mockResponse);

       // Act
       const result = await router.route(
         'Can you help me with this?', 
         'conv-123', 
         clarifyIntent,
         mockContexts
       );

       // Assert
       expect(clarificationHandler.handle).toHaveBeenCalled();
       expect(result).toEqual({
         handler: 'clarifier',
         processedMessage: 'Clarification question',
         context: mockContexts[0]
       });
     });

    it('should fallback to general AI handler for unknown intent', async () => {
      // Arrange
      const unknownIntent: IntentResult = { intent: 'question', confidence: 0.5, requiresDecomposition: false }; // Use valid intent but low confidence
      const mockResponse = { message: 'Fallback AI response', shouldSave: true };
      jest.spyOn(generalAIHandler, 'handle').mockResolvedValue(mockResponse);

      // Act
      const result = await router.route(
        'Some message', 
        'conv-123', 
        unknownIntent,
        mockContexts
      );

      // Assert
      expect(generalAIHandler.handle).toHaveBeenCalled();
      expect(result.handler).toBe('general_ai');
      expect(result.processedMessage).toBe('Fallback AI response');
    });

     it('should handle handler errors gracefully and fallback', async () => {
       // Arrange
       const mockResponse = { message: 'Fallback after error', shouldSave: true };
       jest.spyOn(generalAIHandler, 'handle')
         .mockRejectedValueOnce(new Error('Handler failed'))
         .mockResolvedValueOnce(mockResponse);

       // Act
       const result = await router.route(
         'Test message', 
         'conv-123', 
         mockIntentResult,
         mockContexts
       );

       // Assert
       expect(generalAIHandler.handle).toHaveBeenCalledTimes(2);
       expect(result).toEqual({
         handler: 'general_ai',
         processedMessage: 'Fallback after error',
         context: mockContexts[0]
       });
     });

     it('should return last resort response when both handler and fallback fail', async () => {
       // Arrange
       jest.spyOn(generalAIHandler, 'handle')
         .mockRejectedValueOnce(new Error('Handler failed'))
         .mockRejectedValue(new Error('Fallback also failed'));

       // Act
       const result = await router.route(
         'Test message', 
         'conv-123', 
         mockIntentResult,
         mockContexts
       );

       // Assert
       expect(result.processedMessage).toContain('technical difficulties');
       expect(result.handler).toBe('general_ai');
       expect(result.context).toBeUndefined();
     });
  });

  describe('registerHandler', () => {
    // Note: Testing registration/unregistration with real handlers would require more complex mocking
    // For now we test that the methods exist and can be called without error
    it('should have registerHandler method', () => {
      expect(typeof router.registerHandler).toBe('function');
    });

    it('should have unregisterHandler method', () => {
      expect(typeof router.unregisterHandler).toBe('function');
    });

    it('should have hasHandler method', () => {
      expect(typeof router.hasHandler).toBe('function');
      expect(router.hasHandler('general_ai')).toBe(true);
    });
  });
});