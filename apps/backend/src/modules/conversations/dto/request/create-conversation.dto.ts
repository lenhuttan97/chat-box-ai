import { IsString, IsOptional, IsNumber, IsUUID } from 'class-validator'

export class CreateConversationDto {
  @IsString()
  name: string

  @IsUUID()
  @IsOptional()
  userId?: string

  @IsString()
  @IsOptional()
  systemPrompt?: string

  @IsString()
  @IsOptional()
  autoPrompt?: string

  @IsNumber()
  @IsOptional()
  contextToken?: number

  @IsNumber()
  @IsOptional()
  temperature?: number

  @IsNumber()
  @IsOptional()
  maxTokens?: number

  @IsNumber()
  @IsOptional()
  messageCount?: number
}
