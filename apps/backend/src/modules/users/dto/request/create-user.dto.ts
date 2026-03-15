import { IsString, IsOptional, IsEmail } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  password?: string

  @IsString()
  @IsOptional()
  display_name?: string

  @IsString()
  @IsOptional()
  firebase_uid?: string

  @IsString()
  @IsOptional()
  photo_url?: string

  @IsString()
  @IsOptional()
  provider?: string
}
