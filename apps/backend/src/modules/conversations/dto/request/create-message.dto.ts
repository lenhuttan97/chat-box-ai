import { IsString, IsOptional, IsUUID } from 'class-validator'

export class CreateMessageDto {
  @IsUUID()
  @IsOptional()
  conversationId?: string

  @IsString()
  role: string

  @IsString()
  content: string
}
