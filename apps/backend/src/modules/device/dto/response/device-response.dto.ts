import { Device } from '../../models/device.model'

export class DeviceResponseDto {
  id: string
  deviceId: string
  browser: string | null
  os: string | null
  language: string | null
  timezone: string | null
  screenResolution: string | null
  ipAddress: string | null
  lastSeen: Date
  isOnline: boolean
  userId: string | null

  constructor(device: Device) {
    this.id = device.id
    this.deviceId = device.deviceId
    this.browser = device.browser
    this.os = device.os
    this.language = device.language
    this.timezone = device.timezone
    this.screenResolution = device.screenResolution
    this.ipAddress = device.ipAddress
    this.lastSeen = device.lastSeen
    this.isOnline = device.isOnline
    this.userId = device.userId
  }
}

export class DeviceListResponseDto {
  devices: DeviceResponseDto[]
  total: number

  constructor(devices: Device[], total: number) {
    this.devices = devices.map(d => new DeviceResponseDto(d))
    this.total = total
  }
}