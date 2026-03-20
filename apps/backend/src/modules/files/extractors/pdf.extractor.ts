import { Injectable, Logger } from '@nestjs/common'
import { PDFParse } from 'pdf-parse'

@Injectable()
export class PdfExtractor {
  private readonly logger = new Logger(PdfExtractor.name)

  async extract(buffer: Buffer): Promise<string> {
    try {
      const parser = new PDFParse({ data: buffer })
      const textResult = await parser.getText()
      return textResult.text || ''
    } catch (error) {
      this.logger.error('PDF extraction failed', error)
      throw new Error('Failed to extract text from PDF')
    }
  }
}
