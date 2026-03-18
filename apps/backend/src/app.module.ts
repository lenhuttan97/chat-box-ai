import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './modules/prisma/prisma.module'
import { UsersModule } from './modules/users/users.module'
import { ConversationsModule } from './modules/conversations/conversations.module'
import { AuthModule } from './modules/auth/auth.module'
import { DeviceModule } from './modules/device/device.module'

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
  ],
})
export class AppModule {}
