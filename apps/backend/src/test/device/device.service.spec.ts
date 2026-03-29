import { Test, TestingModule } from '@nestjs/testing'
import { DeviceService } from '../../modules/device/device.service'
import { DeviceRepository } from '../../modules/device/repository/device.repository'
import { UsersService } from '../../modules/users/users.service'

describe('DeviceService', () => {
  let service: DeviceService
  let repository: jest.Mocked<DeviceRepository>
  let usersService: jest.Mocked<UsersService>

  const mockDevice = {
    id: 'device-uuid-1',
    deviceId: 'test-device-123',
    browser: 'Chrome',
    os: 'MacOS',
    language: 'en',
    timezone: 'Asia/Ho_Chi_Minh',
    screenResolution: '1920x1080',
    ipAddress: '127.0.0.1',
    lastSeen: new Date(),
    isOnline: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user-uuid-1',
  }

  const mockVirtualUser = {
    id: 'user-uuid-1',
    displayName: 'Device test-device-123',
    provider: 'device',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(async () => {
    const mockRepository = {
      findByDeviceId: jest.fn(),
      findByUserId: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateLastSeen: jest.fn(),
      linkToUser: jest.fn(),
    }

    const mockUsersService = {
      create: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceService,
        { provide: DeviceRepository, useValue: mockRepository },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile()

    service = module.get<DeviceService>(DeviceService)
    repository = module.get(DeviceRepository)
    usersService = module.get(UsersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findOrCreate', () => {
    it('should return existing device when found', async () => {
      const dto = { deviceId: 'test-device-123', browser: 'Chrome' }
      repository.findByDeviceId.mockResolvedValue(mockDevice as any)
      repository.update.mockResolvedValue(mockDevice as any)

      const result = await service.findOrCreate(dto)

      expect(repository.findByDeviceId).toHaveBeenCalledWith('test-device-123')
      expect(repository.create).not.toHaveBeenCalled()
      expect(result.deviceId).toBe('test-device-123')
    })

    it('should create new device with virtual user when not found', async () => {
      const dto = { deviceId: 'new-device-456', browser: 'Firefox' }
      const newDevice = { ...mockDevice, id: 'new-device-uuid', deviceId: 'new-device-456' }
      const newUser = { ...mockVirtualUser, id: 'new-user-uuid' }
      const linkedDevice = { ...newDevice, userId: 'new-user-uuid' }
      
      repository.findByDeviceId.mockResolvedValue(null)
      repository.create.mockResolvedValue(newDevice as any)
      usersService.create.mockResolvedValue(newUser as any)
      repository.linkToUser.mockResolvedValue(linkedDevice as any)
      repository.findById.mockResolvedValue(linkedDevice as any)

      const result = await service.findOrCreate(dto)

      expect(repository.create).toHaveBeenCalled()
      expect(usersService.create).toHaveBeenCalledWith({
        displayName: 'Device new-device-456',
        provider: 'device',
      })
      expect(repository.linkToUser).toHaveBeenCalled()
      expect(result.deviceId).toBe('new-device-456')
    })
  })

  describe('findByUserId', () => {
    it('should return devices for user', async () => {
      const devices = [mockDevice]
      repository.findByUserId.mockResolvedValue(devices as any)

      const result = await service.findByUserId('user-uuid-1')

      expect(repository.findByUserId).toHaveBeenCalledWith('user-uuid-1')
      expect(result).toHaveLength(1)
    })
  })

  describe('findById', () => {
    it('should return device by id', async () => {
      repository.findById.mockResolvedValue(mockDevice as any)

      const result = await service.findById('device-uuid-1')

      expect(repository.findById).toHaveBeenCalledWith('device-uuid-1')
      expect(result?.deviceId).toBe('test-device-123')
    })

    it('should return null when not found', async () => {
      repository.findById.mockResolvedValue(null)

      const result = await service.findById('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('linkDeviceToUser', () => {
    it('should link device to user', async () => {
      const linkedDevice = { ...mockDevice, userId: 'real-user-id' }
      repository.linkToUser.mockResolvedValue(linkedDevice as any)

      const result = await service.linkDeviceToUser('device-uuid-1', 'real-user-id')

      expect(repository.linkToUser).toHaveBeenCalledWith('device-uuid-1', 'real-user-id')
      expect(result.userId).toBe('real-user-id')
    })
  })

  describe('updateLastSeen', () => {
    it('should update last seen', async () => {
      repository.findByDeviceId.mockResolvedValue(mockDevice as any)
      repository.updateLastSeen.mockResolvedValue(mockDevice as any)

      const result = await service.updateLastSeen('test-device-123')

      expect(repository.findByDeviceId).toHaveBeenCalledWith('test-device-123')
      expect(result).not.toBeNull()
    })

    it('should return null when device not found', async () => {
      repository.findByDeviceId.mockResolvedValue(null)

      const result = await service.updateLastSeen('non-existent')

      expect(result).toBeNull()
    })
  })
})