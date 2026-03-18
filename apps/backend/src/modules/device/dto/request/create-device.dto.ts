export class CreateDeviceDto {
  deviceId: string
  browser?: string
  os?: string
  language?: string
  timezone?: string
  screenResolution?: string
  ipAddress?: string
}