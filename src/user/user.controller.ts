import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMINISTRATOR)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Roles(Role.ADMINISTRATOR)
    @Get()
    async getUsers() {
      return await this.userService.getAllUsers();
    }

    @Roles(Role.ADMINISTRATOR, Role.EMPLOYEE)
    @Patch(':id')
    async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
      return await this.userService.updateUser(id, updateUserDto);
    }

    @Roles(Role.ADMINISTRATOR)
    @Delete(':id')
    async deleteUser(@Param('id') id: number) {
      return await this.userService.deleteUser(id);
    }
}
