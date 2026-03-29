import { Test, TestingModule } from '@nestjs/testing'
import { FilesService } from '../../modules/files/files.service'
import { PrismaService } from '../../modules/prisma/prisma.service'
import { ImageExtractor } from '../../modules/files/extractors/image.extractor'
import { PdfExtractor } from '../../modules/files/extractors/pdf.extractor'
import { DocxExtractor } from '../../modules/files/extractors/docx.extractor'
import { ExcelExtractor } from '../../modules/files/extractors/excel.extractor'
import { BadRequestException } from '@nestjs/common'

describe('FilesService', () => {
  let service: FilesService

  const mockFile = {
    id: 'file-uuid-1',
    filename: '123456-test.jpg',
    originalName: 'test.jpg',
    mimeType: 'image/jpeg',
    size: 1024,
    status: 'completed',
    extractedText: 'Image content',
    error: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(async () => {
    const mockPrisma: any = {
      file: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    }

    const mockImageExtractor: any = {
      extract: jest.fn(),
    }

    const mockPdfExtractor: any = {
      extract: jest.fn(),
    }

    const mockDocxExtractor: any = {
      extract: jest.fn(),
    }

    const mockExcelExtractor: any = {
      extract: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ImageExtractor, useValue: mockImageExtractor },
        { provide: PdfExtractor, useValue: mockPdfExtractor },
        { provide: DocxExtractor, useValue: mockDocxExtractor },
        { provide: ExcelExtractor, useValue: mockExcelExtractor },
      ],
    }).compile()

    service = module.get<FilesService>(FilesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('processFile', () => {
    it('should process a valid image file', async () => {
      const prisma = service['prisma'] as any
      const imageExtractor = service['imageExtractor'] as any
      const buffer = Buffer.from('test image content')
      
      prisma.file.create.mockResolvedValue(mockFile as any)
      prisma.file.update.mockResolvedValue(mockFile as any)
      imageExtractor.extract.mockResolvedValue('Extracted image text')

      const result = await service.processFile(buffer, 'test.jpg', 'image/jpeg')

      expect(prisma.file.create).toHaveBeenCalled()
      expect(imageExtractor.extract).toHaveBeenCalledWith(buffer)
      expect(result.status).toBe('completed')
    })

    it('should reject file that is too large', async () => {
      const buffer = Buffer.alloc(20 * 1024 * 1024)

      await expect(
        service.processFile(buffer, 'large.jpg', 'image/jpeg'),
      ).rejects.toThrow(BadRequestException)
    })

    it('should reject unsupported file type', async () => {
      const buffer = Buffer.from('test')

      await expect(
        service.processFile(buffer, 'test.exe', 'application/x-executable'),
      ).rejects.toThrow(BadRequestException)
    })

    it('should handle extraction failure', async () => {
      const prisma = service['prisma'] as any
      const pdfExtractor = service['pdfExtractor'] as any
      const buffer = Buffer.from('corrupted pdf')
      const error = new Error('Failed to extract')
      
      prisma.file.create.mockResolvedValue(mockFile as any)
      prisma.file.update.mockResolvedValue({ ...mockFile, status: 'failed' } as any)
      pdfExtractor.extract.mockRejectedValue(error)

      await expect(
        service.processFile(buffer, 'test.pdf', 'application/pdf'),
      ).rejects.toThrow()
    })
  })

  describe('getFile', () => {
    it('should return file when found', async () => {
      const prisma = service['prisma'] as any
      prisma.file.findUnique.mockResolvedValue(mockFile as any)

      const result = await service.getFile('file-uuid-1')

      expect(prisma.file.findUnique).toHaveBeenCalledWith({ where: { id: 'file-uuid-1' } })
      expect(result?.originalName).toBe('test.jpg')
    })

    it('should return null when not found', async () => {
      const prisma = service['prisma'] as any
      prisma.file.findUnique.mockResolvedValue(null)

      const result = await service.getFile('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('getFileContent', () => {
    it('should return extracted text for completed file', async () => {
      const prisma = service['prisma'] as any
      prisma.file.findUnique.mockResolvedValue(mockFile as any)

      const result = await service.getFileContent('file-uuid-1')

      expect(result).toBe('Image content')
    })

    it('should return null for failed file', async () => {
      const prisma = service['prisma'] as any
      const failedFile = { ...mockFile, status: 'failed' }
      prisma.file.findUnique.mockResolvedValue(failedFile as any)

      const result = await service.getFileContent('file-uuid-1')

      expect(result).toBeNull()
    })

    it('should return null when file not found', async () => {
      const prisma = service['prisma'] as any
      prisma.file.findUnique.mockResolvedValue(null)

      const result = await service.getFileContent('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('getFileStatus', () => {
    it('should return file status', async () => {
      const prisma = service['prisma'] as any
      prisma.file.findUnique.mockResolvedValue(mockFile as any)

      const result = await service.getFileStatus('file-uuid-1')

      expect(result).toBe('completed')
    })

    it('should return null when not found', async () => {
      const prisma = service['prisma'] as any
      prisma.file.findUnique.mockResolvedValue(null)

      const result = await service.getFileStatus('non-existent')

      expect(result).toBeNull()
    })
  })
})