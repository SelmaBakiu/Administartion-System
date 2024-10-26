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
import { CreateDepartamentDto } from './dto/create-departament.dto';
import { DepartamentService } from './departament.service';
import { RolesGuard } from 'src/common/guards/role.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { UpdateDepartamentDTO } from './dto/update-departament.dto';

@Controller('departament')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMINISTRATOR)
export class DepartamentController {
  constructor(private readonly deparatmentService: DepartamentService) {}

  @Post()
  async createDepartament(@Body() createDepartamentDto: CreateDepartamentDto) {
    return this.deparatmentService.create(createDepartamentDto);
  }

  @Patch(':id')
  async updateDepartament(
    @Body() updateDepartamentDto: UpdateDepartamentDTO,
    @Param('id') id: string,
  ) {
    return this.deparatmentService.update(id, updateDepartamentDto);
  }

  @Get()
  async getAllDepartament() {
    return this.deparatmentService.getAllDepartaments();
  }

  @Get('parent')
  async getParentDepartaments() {
    return this.deparatmentService.getParentDepartament();
  }
  @Get(':id')
  async getDepartamentById(@Param('id') id: string) {
    return this.deparatmentService.getDepartamentById(id);
  }

  @Get(':id/children')
  async getDepartamentChildren(@Param('id') id: string) {
    return this.deparatmentService.getDepartamentChildren(id);
  }

  @Delete(':id')
  async deleteDepartament(@Param('id') id: string) {
    return this.deparatmentService.deleteDepartament(id);
  }
}
