import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from '../../modules/users/users.service'
import { UsersRepository } from '../../modules/users/repository/users.repository'
import { NotFoundException } from '@nestjs/common'

describe('UsersService', () => {
  let service: UsersService
  let repository: jest.Mocked<UsersRepository>

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    display_name: 'Test User',
    photo_url: null,
    provider: 'firebase',
    created_at: new Date(),
    updated_at: new Date(),
  }

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByFirebaseUid: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockRepository },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    repository = module.get(UsersRepository)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a user', async () => {
      const dto = { email: 'test@example.com', displayName: 'Test User' }
      repository.create.mockResolvedValue(mockUser as any)

      const result = await service.create(dto)

      expect(repository.create).toHaveBeenCalledWith(dto)
      expect(result.email).toBe('test@example.com')
    })
  })

  describe('findAll', () => {
    it('should return array of users', async () => {
      repository.findAll.mockResolvedValue([mockUser] as any)

      const result = await service.findAll()

      expect(repository.findAll).toHaveBeenCalled()
      expect(result).toHaveLength(1)
    })
  })

  describe('findById', () => {
    it('should return user by id', async () => {
      repository.findById.mockResolvedValue(mockUser as any)

      const result = await service.findById('user-1')

      expect(repository.findById).toHaveBeenCalledWith('user-1')
      expect(result.id).toBe('user-1')
    })

    it('should throw NotFoundException if user not found', async () => {
      repository.findById.mockResolvedValue(null)

      await expect(service.findById('invalid-id')).rejects.toThrow(NotFoundException)
    })
  })

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      repository.findByEmail.mockResolvedValue(mockUser as any)

      const result = await service.findByEmail('test@example.com')

      expect(repository.findByEmail).toHaveBeenCalledWith('test@example.com')
      expect(result?.email).toBe('test@example.com')
    })
  })

  describe('update', () => {
it('should update user', async () => {
       const updatedUser = { ...mockUser, display_name: 'Updated Name' }
       repository.update.mockResolvedValue(updatedUser as any)

       const result = await service.update('user-1', { display_name: 'Updated Name' })

       expect(repository.update).toHaveBeenCalledWith('user-1', { display_name: 'Updated Name' })
       expect(result.displayName).toBe('Updated Name')
     })
  })

  describe('remove', () => {
    it('should delete user', async () => {
      repository.delete.mockResolvedValue()

      await service.remove('user-1')

      expect(repository.delete).toHaveBeenCalledWith('user-1')
    })
  })
})
