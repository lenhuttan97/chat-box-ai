import { Injectable } from '@nestjs/common'

@Injectable()
export class ImageExtractor {
  async extract(buffer: Buffer): Promise<string> {
    const base64 = buffer.toString('base64')
    return `[Image data: ${base64.substring(0, 100)}...]`
  }
}
