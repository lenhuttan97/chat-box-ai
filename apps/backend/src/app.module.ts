import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './modules/prisma/prisma.module'
import { UsersModule } from './modules/users/users.module'
import { ConversationsModule } from './modules/conversations/conversations.module'
import { AuthModule } from './modules/auth/auth.module'
import { DeviceModule } from './modules/device/device.module'
import { MessageProcessingModule } from './modules/message-processing/message-processing.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    ConversationsModule,
    AuthModule,
    DeviceModule,
    MessageProcessingModule,
  ],
})
export class AppModule {}