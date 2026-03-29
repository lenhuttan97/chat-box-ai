import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common'
import { DeviceService } from './device.service'
import { DeviceResponseDto, DeviceListResponseDto } from './dto/response/device-response.dto'
import { UpdateDeviceDto } from './dto/request/update-device.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Request } from 'express'

interface AuthenticatedRequest extends Request {
  user: { userId: string }
}

@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getDevices(@Req() req: AuthenticatedRequest): Promise<DeviceListResponseDto> {
    const devices = await this.deviceService.findByUserId(req.user.userId)
    return new DeviceListResponseDto(devices, devices.length)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateDevice(
    @Param('id') id: string,
    @Body() dto: UpdateDeviceDto,
  ): Promise<DeviceResponseDto> {
    const device = await this.deviceService.updateDevice(id, dto.name)
    return new DeviceResponseDto(device)
  }
}