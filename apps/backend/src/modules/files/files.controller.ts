import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FilesService } from './files.service'

interface UploadedFileType {
  originalname: string
  mimetype: string
  buffer: Buffer
  size: number
}

@Controller('files')
export class FilesController {
  private readonly logger = new Logger(FilesController.name)

  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: UploadedFileType,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded')
    }

    this.logger.log(`Uploading file: ${file.originalname} (${file.mimetype})`)

    const result = await this.filesService.processFile(
      file.buffer,
      file.originalname,
      file.mimetype,
    )

    return {
      data: result,
      message: 'File uploaded and processing',
      statusCode: HttpStatus.CREATED,
    }
  }

  @Get(':id')
  async getFile(@Param('id') id: string) {
    const file = await this.filesService.getFile(id)
    if (!file) {
      return {
        data: null,
        message: 'File not found',
        statusCode: HttpStatus.NOT_FOUND,
      }
    }

    return {
      data: file,
      message: 'File retrieved',
      statusCode: HttpStatus.OK,
    }
  }

  @Get(':id/content')
  async getFileContent(@Param('id') id: string) {
    const content = await this.filesService.getFileContent(id)
    if (!content) {
      return {
        data: null,
        message: 'File not found or not ready',
        statusCode: HttpStatus.NOT_FOUND,
      }
    }

    return {
      data: { content },
      message: 'File content retrieved',
      statusCode: HttpStatus.OK,
    }
  }

  @Get(':id/status')
  async getFileStatus(@Param('id') id: string) {
    const status = await this.filesService.getFileStatus(id)
    if (!status) {
      return {
        data: null,
        message: 'File not found',
        statusCode: HttpStatus.NOT_FOUND,
      }
    }

    return {
      data: { status },
      message: 'File status retrieved',
      statusCode: HttpStatus.OK,
    }
  }
}
