import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { DeviceService, DeviceInfo } from '../device/device.service'

export interface DeviceRequest extends Request {
  device?: DeviceInfo
}

@Injectable()
export class DeviceMiddleware implements NestMiddleware {
  constructor(private readonly deviceService: DeviceService) {}

  async use(req: DeviceRequest, res: Response, next: NextFunction) {
    const deviceInfoHeader = req.headers['x-device-info'] as string

    if (deviceInfoHeader) {
      try {
        const deviceInfo = JSON.parse(deviceInfoHeader) as DeviceInfo
        req.device = deviceInfo
      } catch (error) {
        // Ignore parse errors, device info is optional
      }
    }

    next()
  }
}