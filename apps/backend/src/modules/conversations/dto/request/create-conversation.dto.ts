import { IsString, IsOptional, IsNumber, IsUUID, IsIn } from 'class-validator'

export class CreateConversationDto {
  @IsString()
  name: string

  @IsUUID()
  @IsOptional()
  userId?: string

  @IsUUID()
  @IsOptional()
  deviceId?: string

  @IsString()
  @IsOptional()
  @IsIn(['gemini', 'ollama'])
  provider?: string

  @IsString()
  @IsOptional()
  model?: string

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
