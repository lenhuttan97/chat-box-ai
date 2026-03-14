import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { AiModule } from '../ai/ai.module'
import { ConversationsController } from './conversations.controller'
import { ConversationsService } from './conversations.service'
import { ConversationsRepository } from './repository/conversations.repository'

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [ConversationsController],
  providers: [ConversationsService, ConversationsRepository],
  exports: [ConversationsService],
})
export class ConversationsModule {}
