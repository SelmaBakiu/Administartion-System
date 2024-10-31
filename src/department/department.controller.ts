import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { DepartmentService } from './department.service';
import { RolesGuard } from 'src/common/guards/role.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { UpdateDepartmentDTO } from './dto/update-department.dto';

@Controller('department')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMINISTRATOR)
export class DepartmentController {
  constructor(private readonly deparatmentService: DepartmentService) {}

  @Post()
  async createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.deparatmentService.create(createDepartmentDto);
  }

  @Patch(':id')
  async updateDepartment(
    @Body() updateDepartmentDto: UpdateDepartmentDTO,
    @Param('id') id: string,
  ) {
    return this.deparatmentService.update(id, updateDepartmentDto);
  }

  @Get()
  async getAllDepartment() {
    return this.deparatmentService.getAllDepartments();
  }

  @Get(':id')
  async getDepartmentById(@Param('id') id: string) {
    return this.deparatmentService.getDepartmentById(id);
  }

  @Delete(':id')
  async deleteDepartment(@Param('id') id: string) {
    return this.deparatmentService.deleteDepartment(id);
  }
}
