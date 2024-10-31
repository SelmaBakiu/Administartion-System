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
  Query,
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

  @Roles(Role.ADMINISTRATOR, Role.EMPLOYEE)
  @Post('/reset-password/:id')
  async resetPassword(
    @Param('id') id: string,
    @Body() newPassword: string,
  ): Promise<void> {
    return await this.userService.changePassword(id, newPassword);
  }

  @Get()
  @Roles(Role.ADMINISTRATOR)
  async getUsersByDepartment(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('departmentId') departmentId?: string,
  ) {
    return await this.userService.getAllUsersByDepartmentId(
      page,
      limit,
      firstName,
      lastName,
      departmentId,
    );
  }

  @Get('chat')
  @Roles(Role.ADMINISTRATOR, Role.EMPLOYEE)
  async getUserForChat() {
    return await this.userService.getUserForChat();
  }

  @Get(':id')
  @Roles(Role.ADMINISTRATOR, Role.EMPLOYEE)
  async getUserById(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMINISTRATOR, Role.EMPLOYEE)
  async updateUser(@Param('id') id: string, @Body() updateUserDto) {
    console.log('Update user', updateUserDto);
    return await this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMINISTRATOR)
  async deleteUser(@Param('id') id: string) {
    console.log('Delete user', id);
    return await this.userService.deleteUser(id);
  }

  @Post('upload-image/:id')
  @Roles(Role.ADMINISTRATOR, Role.EMPLOYEE)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.uploadImage(file, id);
  }
}
