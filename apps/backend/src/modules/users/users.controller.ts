import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/request/create-user.dto'
import { UpdateUserDto } from './dto/request/update-user.dto'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto)
    return { data: user, message: 'User created', statusCode: HttpStatus.CREATED }
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll()
    return { data: users, message: 'Users retrieved', statusCode: HttpStatus.OK }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const user = await this.usersService.findById(id)
    return { data: user, message: 'User retrieved', statusCode: HttpStatus.OK }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.update(id, dto)
    return { data: user, message: 'User updated', statusCode: HttpStatus.OK }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id)
    return { data: null, message: 'User deleted', statusCode: HttpStatus.NO_CONTENT }
  }
}
