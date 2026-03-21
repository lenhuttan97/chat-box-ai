import { Injectable, Logger } from '@nestjs/common'
import { DeviceRepository } from './repository/device.repository'
import { UsersService } from '../users/users.service'
import { CreateDeviceDto } from './dto/request/create-device.dto'
import { Device } from './models/device.model'

export interface DeviceInfo {
  deviceId: string
  browser?: string
  os?: string
  language?: string
  timezone?: string
  screenResolution?: string
  ipAddress?: string
}

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DeviceService.name)

  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly usersService: UsersService,
  ) {}

  async findOrCreate(dto: CreateDeviceDto): Promise<Device> {
    const existing = await this.deviceRepository.findByDeviceId(dto.deviceId)

    if (existing) {
      this.logger.log(`Device found: ${dto.deviceId}`)
      return this.deviceRepository.update(existing.id, {
        browser: dto.browser,
        os: dto.os,
        language: dto.language,
        timezone: dto.timezone,
        screenResolution: dto.screenResolution,
        ipAddress: dto.ipAddress,
        lastSeen: new Date(),
        isOnline: true,
      })
    }

    this.logger.log(`Creating new device: ${dto.deviceId}`)
    const device = await this.deviceRepository.create({
      deviceId: dto.deviceId,
      browser: dto.browser,
      os: dto.os,
      language: dto.language,
      timezone: dto.timezone,
      screenResolution: dto.screenResolution,
      ipAddress: dto.ipAddress,
      isOnline: true,
    })

    const virtualUser = await this.usersService.create({
      displayName: `Device ${dto.deviceId}`,
      provider: 'device',
    })

    await this.deviceRepository.linkToUser(device.id, virtualUser.id)

    return this.deviceRepository.findById(device.id)!
  }

  async findByUserId(userId: string): Promise<Device[]> {
    return this.deviceRepository.findByUserId(userId)
  }

  async findById(id: string): Promise<Device | null> {
    return this.deviceRepository.findById(id)
  }

  async updateDevice(id: string, name?: string): Promise<Device> {
    return this.deviceRepository.update(id, {
      browser: name ? undefined : undefined,
    })
  }

  async linkDeviceToUser(deviceId: string, userId: string): Promise<Device> {
    return this.deviceRepository.linkToUser(deviceId, userId)
  }

  async updateLastSeen(deviceId: string): Promise<Device | null> {
    const device = await this.deviceRepository.findByDeviceId(deviceId)
    if (!device) return null
    return this.deviceRepository.updateLastSeen(device.id)
  }
}