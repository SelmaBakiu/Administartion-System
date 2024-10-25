import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.ADMINISTRATOR)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Get()
  @Roles(Role.ADMINISTRATOR)
  async getAllUsers(
    @Param('page') page: number,
    @Param('limit') limit: number,
    @Param('firstName') firstName?: string,
    @Param('lastName') lastName?: string,
  ) {
    return await this.userService.getAllUsers(
      page,
      limit,
      firstName,
      lastName,
    );
  }

  @Get(':id')
  @Roles(Role.ADMINISTRATOR, Role.EMPLOYEE)
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMINISTRATOR, Role.EMPLOYEE)
  async updateUser(@Param('id') id: string, @Body() updateUserDto) {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMINISTRATOR)
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
  
  @Post('upload-image/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.uploadImage(file, id);
  }
}
