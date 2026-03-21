import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { AiModule } from '../ai/ai.module'
import { DeviceModule } from '../device/device.module'
import { MessageProcessingModule } from '../message-processing/message-processing.module'
import { ConversationsController } from './conversations.controller'
import { ConversationsService } from './conversations.service'
import { ConversationsRepository } from './repository/conversations.repository'

@Module({
  imports: [PrismaModule, AiModule, DeviceModule, MessageProcessingModule],
  controllers: [ConversationsController],
  providers: [ConversationsService, ConversationsRepository],
  exports: [ConversationsService],
})
export class ConversationsModule {}
