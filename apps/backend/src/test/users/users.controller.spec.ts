import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from '../../modules/users/users.controller'
import { UsersService } from '../../modules/users/users.service'
import { HttpStatus } from '@nestjs/common'

describe('UsersController', () => {
  let controller: UsersController
  let service: jest.Mocked<UsersService>

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    displayName: 'Test User',
    photoUrl: null,
    provider: 'firebase',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockService }],
    }).compile()

    controller = module.get<UsersController>(UsersController)
    service = module.get(UsersService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create user and return response', async () => {
      service.create.mockResolvedValue(mockUser as any)

      const result = await controller.create({ email: 'test@example.com' })

      expect(service.create).toHaveBeenCalledWith({ email: 'test@example.com' })
      expect(result.statusCode).toBe(HttpStatus.CREATED)
      expect(result.data).toEqual(mockUser)
    })
  })

  describe('findAll', () => {
    it('should return all users', async () => {
      service.findAll.mockResolvedValue([mockUser] as any)

      const result = await controller.findAll()

      expect(service.findAll).toHaveBeenCalled()
      expect(result.statusCode).toBe(HttpStatus.OK)
      expect(result.data).toHaveLength(1)
    })
  })

  describe('findById', () => {
    it('should return user by id', async () => {
      service.findById.mockResolvedValue(mockUser as any)

      const result = await controller.findById('user-1')

      expect(service.findById).toHaveBeenCalledWith('user-1')
      expect(result.statusCode).toBe(HttpStatus.OK)
      expect(result.data.id).toBe('user-1')
    })
  })

  describe('update', () => {
    it('should update user', async () => {
      service.update.mockResolvedValue({ ...mockUser, displayName: 'Updated' } as any)

      const result = await controller.update('user-1', { displayName: 'Updated' })

      expect(service.update).toHaveBeenCalledWith('user-1', { displayName: 'Updated' })
      expect(result.statusCode).toBe(HttpStatus.OK)
    })
  })

  describe('remove', () => {
    it('should delete user', async () => {
      service.remove.mockResolvedValue()

      const result = await controller.remove('user-1')

      expect(service.remove).toHaveBeenCalledWith('user-1')
      expect(result.statusCode).toBe(HttpStatus.NO_CONTENT)
    })
  })
})
