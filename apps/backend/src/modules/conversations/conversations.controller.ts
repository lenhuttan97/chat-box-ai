import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Res,
  HttpCode,
  HttpStatus,
  Logger,
  Req,
  Headers
} from '@nestjs/common'
import { Response, Request } from 'express'
import { ConversationsService } from './conversations.service'
import { AiService } from '../ai/ai.service'
import { DeviceService } from '../device/device.service'
import { MessageProcessorService } from '../message-processing/message-processor.service'
import { CreateConversationDto } from './dto/request/create-conversation.dto'
import { UpdateConversationDto } from './dto/request/update-conversation.dto'
import { CreateMessageDto } from './dto/request/create-message.dto'

interface DeviceInfo {
  deviceId: string
  browser?: string
  os?: string
  language?: string
  timezone?: string
  screenResolution?: string
  ipAddress?: string
}

interface DeviceInfo {
  deviceId: string
  browser?: string
  os?: string
  language?: string
  timezone?: string
  screenResolution?: string
  ipAddress?: string
}

@Controller()
export class ConversationsController {
  private readonly logger = new Logger(ConversationsController.name)

  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly aiService: AiService,
    private readonly deviceService: DeviceService,
    private readonly messageProcessor: MessageProcessorService,
  ) {}

  @Post('conversations')
  async createConversation(@Body() dto: CreateConversationDto) {
    const conversation = await this.conversationsService.createConversation(dto)
    return { data: conversation, message: 'Conversation created', statusCode: HttpStatus.CREATED }
  }

  @Get('conversations')
  async findAllConversations(
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
  ) {
    const pageNum = parseInt(page, 10) || 1
    const sizeNum = parseInt(size, 10) || 10
    const result = await this.conversationsService.findAllConversations(pageNum, sizeNum)
    return { data: result.data, message: 'Conversations retrieved', statusCode: HttpStatus.OK, totalElement: result.totalElement }
  }

  @Get('conversations/user/:userId')
  async findConversationsByUserId(
    @Param('userId') userId: string,
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
  ) {
    const pageNum = parseInt(page, 10) || 1
    const sizeNum = parseInt(size, 10) || 10
    const result = await this.conversationsService.findConversationsByUserId(userId, pageNum, sizeNum)
    return { data: result.data, message: 'User conversations retrieved', statusCode: HttpStatus.OK, totalElement: result.totalElement }
  }

  @Get('conversations/device/:deviceId')
  async findConversationsByDeviceId(
    @Param('deviceId') deviceId: string,
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
  ) {
    const pageNum = parseInt(page, 10) || 1
    const sizeNum = parseInt(size, 10) || 10
    const result = await this.conversationsService.findConversationsByDeviceId(deviceId, pageNum, sizeNum)
    return { data: result.data, message: 'Device conversations retrieved', statusCode: HttpStatus.OK, totalElement: result.totalElement }
  }

  @Get('conversations/:id')
  async findConversationById(@Param('id') id: string) {
    const conversation = await this.conversationsService.findConversationById(id)
    return { data: conversation, message: 'Conversation retrieved', statusCode: HttpStatus.OK }
  }

  @Put('conversations/:id')
  async updateConversation(@Param('id') id: string, @Body() dto: UpdateConversationDto) {
    const conversation = await this.conversationsService.updateConversation(id, dto)
    return { data: conversation, message: 'Conversation updated', statusCode: HttpStatus.OK }
  }

  @Delete('conversations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteConversation(@Param('id') id: string) {
    await this.conversationsService.deleteConversation(id)
    return { data: null, message: 'Conversation deleted', statusCode: HttpStatus.NO_CONTENT }
  }

  @Get('conversations/:id/messages')
  async findMessagesByConversationId(
    @Param('id') conversationId: string,
    @Query('page') page: string = '1',
    @Query('size') size: string = '50',
  ) {
    const pageNum = parseInt(page, 10) || 1
    const sizeNum = parseInt(size, 10) || 50
    const result = await this.conversationsService.findMessagesByConversationId(conversationId, pageNum, sizeNum)
    return { data: result.data, message: 'Messages retrieved', statusCode: HttpStatus.OK, totalElement: result.totalElement }
  }

  @Post('conversation/messages')
  async sendMessage(
    @Body() body: { message: string; conversation_id?: string },
    @Headers('x-device-info') deviceInfoHeader: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { message, conversation_id } = body

    if (!message) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        message: 'Message is required',
        statusCode: HttpStatus.BAD_REQUEST,
      })
    }

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    let deviceInfo: DeviceInfo | null = null
    let deviceId: string | undefined

    if (deviceInfoHeader) {
      try {
        deviceInfo = JSON.parse(deviceInfoHeader) as DeviceInfo
        deviceId = deviceInfo.deviceId

        const device = await this.deviceService.findOrCreate({
          deviceId: deviceInfo.deviceId,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          language: deviceInfo.language,
          timezone: deviceInfo.timezone,
          screenResolution: deviceInfo.screenResolution,
          ipAddress: req.ip || undefined,
        })
        deviceId = device.id
      } catch (error) {
        this.logger.warn('Failed to parse device info', error)
      }
    }

    let conversationId = conversation_id
    let conversationSettings = {
      systemPrompt: undefined as string | undefined,
      temperature: undefined as number | undefined,
      maxTokens: undefined as number | undefined,
    }

    if (!conversationId) {
      const createDto: CreateConversationDto = {
        name: message.substring(0, 50),
        deviceId: deviceId,
      }
      const conversation = await this.conversationsService.createConversation(createDto)
      conversationId = conversation.id
      res.write(`data: ${JSON.stringify({ conversationId })}\n\n`)
    } else {
      const conversation = await this.conversationsService.findConversationById(conversationId)
      if (conversation) {
        conversationSettings = {
          systemPrompt: conversation.systemPrompt ?? undefined,
          temperature: conversation.temperature ?? undefined,
          maxTokens: conversation.maxTokens ?? undefined,
        }
      }
    }

    const existingMessages = await this.conversationsService.findMessagesByConversationIdNoPaginate(conversationId)
    const history = existingMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    await this.conversationsService.createMessage({
      conversationId,
      role: 'user',
      content: message,
    })

    const userMessageCount = existingMessages.filter(m => m.role === 'user').length + 1
    const shouldAutoAnalyze = userMessageCount === 1 || userMessageCount % 10 === 0
    
    this.logger.log(`User message count: ${userMessageCount}, shouldAutoAnalyze: ${shouldAutoAnalyze}`)

    if (shouldAutoAnalyze) {
      this.logger.log('Starting auto-analyze...')
      try {
        const allMessagesForAnalysis = [...history, { role: 'user', content: message }]
        const analysis = await this.aiService.analyzeContext(allMessagesForAnalysis)
        
        const conversation = await this.conversationsService.findConversationById(conversationId)
        const userHasSetSystemPrompt = conversation?.systemPrompt && conversation.systemPrompt.trim() !== ''
        const userHasSetContextToken = conversation?.contextToken && conversation.contextToken !== 4096
        const userHasSetTemperature = conversation?.temperature && conversation.temperature !== 0.7
        const userHasSetMaxTokens = conversation?.maxTokens && conversation.maxTokens !== 2048

        const updateData: Record<string, unknown> = {}

        if (analysis.context) {
          updateData['autoPrompt'] = analysis.context
        }

        if (!userHasSetContextToken) {
          updateData['contextToken'] = analysis.contextToken
        }

        if (!userHasSetTemperature) {
          updateData['temperature'] = analysis.temperature
        }

        if (!userHasSetMaxTokens) {
          updateData['maxTokens'] = analysis.maxTokens
        }

        if (Object.keys(updateData).length > 0) {
          await this.conversationsService.updateConversation(conversationId, updateData as any)
          this.logger.log('Auto-prompt updated:', updateData)
          
          const updatedConversation = await this.conversationsService.findConversationById(conversationId)
          if (updatedConversation) {
            const mergedSystemPrompt = userHasSetSystemPrompt 
              ? `${updatedConversation.systemPrompt}\n\n${analysis.context}`
              : analysis.context
            
            conversationSettings = {
              systemPrompt: mergedSystemPrompt || undefined,
              temperature: updatedConversation.temperature ?? undefined,
              maxTokens: updatedConversation.maxTokens ?? undefined,
            }
          }
        }
      } catch (error) {
        this.logger.error('Auto-analyze failed', error)
      }
    } else {
      this.logger.log('Skipping auto-analyze')
    }

    let processedMessage = message
    try {
      const processingResult = await this.messageProcessor.process(
        message,
        conversationId,
        history,
      )
      processedMessage = processingResult.processedMessage
      this.logger.log(`Intent: ${processingResult.intent.intent}, Handler: ${processingResult.route.handler}`)
    } catch (error) {
      this.logger.warn('Message processing failed, using original message', error)
    }

    let fullResponse = ''

    try {
      for await (const chunk of this.aiService.sendMessage({ 
        message: processedMessage, 
        conversationId, 
        history,
        ...conversationSettings,
      })) {
        if (chunk.chunk) {
          fullResponse += chunk.chunk
          res.write(`data: ${JSON.stringify({ chunk: chunk.chunk })}\n\n`)
        }
        if (chunk.done) {
          await this.conversationsService.createMessage({
            conversationId,
            role: 'assistant',
            content: fullResponse,
          })
          const count = await this.conversationsService.countMessages(conversationId)
          await this.conversationsService.updateConversation(conversationId, { messageCount: count })
        }
      }
    } catch (error) {
      res.write(`data: ${JSON.stringify({ error: 'AI service unavailable' })}\n\n`)
    }

    res.end()
  }
}
