import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { UsersRepository } from './repository/users.repository'
import { CreateUserDto } from './dto/request/create-user.dto'
import { UpdateUserDto } from './dto/request/update-user.dto'
import { UserResponseDto } from './dto/response/user-response.dto'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)

  constructor(private readonly usersRepository: UsersRepository) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Creating user with email: ${dto.email}`)
    const user = await this.usersRepository.create(dto)
    return this.toResponse(user)
  }

  async findAll(): Promise<UserResponseDto[]> {
    this.logger.log('Finding all users')
    const users = await this.usersRepository.findAll()
    return users.map(this.toResponse)
  }

  async findById(id: string): Promise<UserResponseDto> {
    this.logger.log(`Finding user by id: ${id}`)
    const user = await this.usersRepository.findById(id)
    if (!user) {
      throw new NotFoundException(`User ${id} not found`)
    }
    return this.toResponse(user)
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    this.logger.log(`Finding user by email: ${email}`)
    const user = await this.usersRepository.findByEmail(email)
    return user ? this.toResponse(user) : null
  }

  async findByFirebaseUid(firebaseUid: string): Promise<UserResponseDto | null> {
    this.logger.log(`Finding user by firebaseUid: ${firebaseUid}`)
    const user = await this.usersRepository.findByFirebaseUid(firebaseUid)
    return user ? this.toResponse(user) : null
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Updating user: ${id}`)
    const user = await this.usersRepository.update(id, dto)
    return this.toResponse(user)
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting user: ${id}`)
    await this.usersRepository.delete(id)
  }

  private toResponse(user: {
    id: string
    email: string | null
    displayName: string | null
    photoUrl: string | null
    provider: string | null
    createdAt: Date
    updatedAt: Date
  }): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      photoUrl: user.photoUrl,
      provider: user.provider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
