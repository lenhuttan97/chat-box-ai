import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { Prisma, Device } from '@prisma/client'

@Injectable()
export class DeviceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByDeviceId(deviceId: string): Promise<Device | null> {
    return this.prisma.device.findUnique({
      where: { deviceId },
    })
  }

  async findByUserId(userId: string): Promise<Device[]> {
    return this.prisma.device.findMany({
      where: { userId },
      orderBy: { lastSeen: 'desc' },
    })
  }

  async findById(id: string): Promise<Device | null> {
    return this.prisma.device.findUnique({
      where: { id },
    })
  }

  async create(data: Prisma.DeviceCreateInput): Promise<Device> {
    return this.prisma.device.create({ data })
  }

  async update(id: string, data: Prisma.DeviceUpdateInput): Promise<Device> {
    return this.prisma.device.update({
      where: { id },
      data,
    })
  }

  async updateLastSeen(id: string): Promise<Device> {
    return this.prisma.device.update({
      where: { id },
      data: {
        lastSeen: new Date(),
        isOnline: true,
      },
    })
  }

  async linkToUser(deviceId: string, userId: string): Promise<Device> {
    return this.prisma.device.update({
      where: { id: deviceId },
      data: { userId },
    })
  }
}