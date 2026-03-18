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
  displayName?: string

  @IsString()
  @IsOptional()
  firebaseUid?: string

  @IsString()
  @IsOptional()
  photoUrl?: string

  @IsString()
  @IsOptional()
  provider?: string

  @IsString()
  @IsOptional()
  themeSetting?: string
}
