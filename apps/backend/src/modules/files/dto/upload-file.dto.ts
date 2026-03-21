import { IsString } from 'class-validator'

export class UploadFileDto {
  @IsString()
  filename: string

  @IsString()
  originalName: string

  @IsString()
  mimeType: string

  size: number
}
