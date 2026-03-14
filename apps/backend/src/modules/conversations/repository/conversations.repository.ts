import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { Prisma, Conversation, Message } from '@prisma/client'

@Injectable()
export class ConversationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Conversation methods
  async createConversation(data: Prisma.ConversationCreateInput): Promise<Conversation> {
    return this.prisma.conversation.create({ data })
  }

  async findAllConversations(page: number = 1, size: number = 10): Promise<{ data: Conversation[]; total: number }> {
    const skip = (page - 1) * size
    const [data, total] = await Promise.all([
      this.prisma.conversation.findMany({
        skip,
        take: size,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.conversation.count(),
    ])
    return { data, total }
  }

  async findConversationsByUserId(userId: string, page: number = 1, size: number = 10): Promise<{ data: Conversation[]; total: number }> {
    const skip = (page - 1) * size
    const [data, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where: { userId },
        skip,
        take: size,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.conversation.count({ where: { userId } }),
    ])
    return { data, total }
  }

  async findConversationById(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: { messages: true },
    })
  }

  async updateConversation(id: string, data: Prisma.ConversationUpdateInput): Promise<Conversation> {
    return this.prisma.conversation.update({ where: { id }, data })
  }

  async deleteConversation(id: string): Promise<void> {
    await this.prisma.conversation.delete({ where: { id } })
  }

  // Message methods
  async createMessage(data: Prisma.MessageCreateInput): Promise<Message> {
    return this.prisma.message.create({ data })
  }

  async findMessagesByConversationId(conversationId: string, page: number = 1, size: number = 50): Promise<{ data: Message[]; total: number }> {
    const skip = (page - 1) * size
    const [data, total] = await Promise.all([
      this.prisma.message.findMany({
        where: { conversationId },
        skip,
        take: size,
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.message.count({ where: { conversationId } }),
    ])
    return { data, total }
  }

  async findMessagesByConversationIdNoPaginate(conversationId: string): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    })
  }

  async findMessageById(id: string): Promise<Message | null> {
    return this.prisma.message.findUnique({ where: { id } })
  }

  async updateMessage(id: string, data: Prisma.MessageUpdateInput): Promise<Message> {
    return this.prisma.message.update({ where: { id }, data })
  }

  async deleteMessage(id: string): Promise<void> {
    await this.prisma.message.delete({ where: { id } })
  }

  async deleteMessagesByConversationId(conversationId: string): Promise<void> {
    await this.prisma.message.deleteMany({ where: { conversationId } })
  }

  async countMessagesByConversationId(conversationId: string): Promise<number> {
    return this.prisma.message.count({ where: { conversationId } })
  }
}
