export class FileResponseDto {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  status: string
  extractedText: string | null
  error: string | null
  createdAt: Date
  updatedAt: Date
}
