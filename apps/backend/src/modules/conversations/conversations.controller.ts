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
} from '@nestjs/common'
import { Response } from 'express'
import { ConversationsService } from './conversations.service'
import { AiService } from '../ai/ai.service'
import { CreateConversationDto } from './dto/request/create-conversation.dto'
import { UpdateConversationDto } from './dto/request/update-conversation.dto'
import { CreateMessageDto } from './dto/request/create-message.dto'

@Controller()
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly aiService: AiService,
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
  async sendMessage(@Body() body: { message: string; conversation_id?: string }, @Res() res: Response) {
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

    let conversationId = conversation_id

    if (!conversationId) {
      const conversation = await this.conversationsService.createConversation({
        name: message.substring(0, 50),
      })
      conversationId = conversation.id
      res.write(`data: ${JSON.stringify({ conversationId })}\n\n`)
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

    let fullResponse = ''

    try {
      for await (const chunk of this.aiService.sendMessage({ message, conversationId, history })) {
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
