import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ImageExtractor } from './extractors/image.extractor'
import { PdfExtractor } from './extractors/pdf.extractor'
import { DocxExtractor } from './extractors/docx.extractor'
import { ExcelExtractor } from './extractors/excel.extractor'
import { FileResponseDto } from './dto/file-response.dto'

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly imageExtractor: ImageExtractor,
    private readonly pdfExtractor: PdfExtractor,
    private readonly docxExtractor: DocxExtractor,
    private readonly excelExtractor: ExcelExtractor,
  ) {}

  async processFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
  ): Promise<FileResponseDto> {
    this.logger.log(`Processing file: ${originalName} (${mimeType})`)

    if (buffer.length > MAX_FILE_SIZE) {
      throw new BadRequestException(`File too large. Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB`)
    }

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new BadRequestException(`File type ${mimeType} is not supported`)
    }

    const filename = `${Date.now()}-${originalName}`

    const file = await this.prisma.file.create({
      data: {
        filename,
        originalName,
        mimeType,
        size: buffer.length,
        status: 'processing',
      },
    })

    try {
      const extractedText = await this.extractContent(buffer, mimeType)

      const updatedFile = await this.prisma.file.update({
        where: { id: file.id },
        data: {
          status: 'completed',
          extractedText,
        },
      })

      return this.toFileResponse(updatedFile)
    } catch (error) {
      this.logger.error(`Failed to process file ${file.id}`, error)

      await this.prisma.file.update({
        where: { id: file.id },
        data: {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      })

      throw error
    }
  }

  async getFile(id: string): Promise<FileResponseDto | null> {
    const file = await this.prisma.file.findUnique({ where: { id } })
    return file ? this.toFileResponse(file) : null
  }

  async getFileContent(id: string): Promise<string | null> {
    const file = await this.prisma.file.findUnique({ where: { id } })
    if (!file || file.status !== 'completed') {
      return null
    }
    return file.extractedText
  }

  async getFileStatus(id: string): Promise<string | null> {
    const file = await this.prisma.file.findUnique({ where: { id } })
    return file?.status || null
  }

  private async extractContent(buffer: Buffer, mimeType: string): Promise<string> {
    switch (mimeType) {
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
      case 'image/webp':
        return this.imageExtractor.extract(buffer)

      case 'application/pdf':
        return this.pdfExtractor.extract(buffer)

      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return this.docxExtractor.extract(buffer)

      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/vnd.ms-excel':
        return this.excelExtractor.extract(buffer)

      default:
        throw new BadRequestException(`Unsupported file type: ${mimeType}`)
    }
  }

  private toFileResponse(file: {
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
  }): FileResponseDto {
    return {
      id: file.id,
      filename: file.filename,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      status: file.status,
      extractedText: file.extractedText,
      error: file.error,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    }
  }
}
