import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { FilesController } from './files.controller'
import { FilesService } from './files.service'
import { ImageExtractor } from './extractors/image.extractor'
import { PdfExtractor } from './extractors/pdf.extractor'
import { DocxExtractor } from './extractors/docx.extractor'
import { ExcelExtractor } from './extractors/excel.extractor'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
    PrismaModule,
  ],
  controllers: [FilesController],
  providers: [
    FilesService,
    ImageExtractor,
    PdfExtractor,
    DocxExtractor,
    ExcelExtractor,
  ],
  exports: [FilesService],
})
export class FilesModule {}
