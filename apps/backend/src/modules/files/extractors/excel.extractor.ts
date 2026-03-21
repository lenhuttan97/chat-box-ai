import { Injectable, Logger } from '@nestjs/common'
import * as XLSX from 'xlsx'

@Injectable()
export class ExcelExtractor {
  private readonly logger = new Logger(ExcelExtractor.name)

  async extract(buffer: Buffer): Promise<string> {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' })
      const sheets: string[] = []

      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName]
        const csv = XLSX.utils.sheet_to_csv(sheet)
        sheets.push(`=== Sheet: ${sheetName} ===\n${csv}`)
      }

      return sheets.join('\n\n')
    } catch (error) {
      this.logger.error('Excel extraction failed', error)
      throw new Error('Failed to extract text from Excel')
    }
  }
}
