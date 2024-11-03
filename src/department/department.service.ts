import { BadRequestException, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from 'src/common/entitys/department.entity';
import { Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDTO } from './dto/update-department.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    private userService: UserService,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const existingDepartment = await this.departmentRepository.findOne({
      where: {
        name: createDepartmentDto.name,
        parentDepartmentId: createDepartmentDto.parentDepartmentId,
        isDeleted: false,
      },
    });

    if (existingDepartment) {
      throw new ConflictException('Department with this name already exists in the specified parent department');
    }

    if (createDepartmentDto.parentDepartmentId) {
      const parentDepartment = await this.departmentRepository.findOne({
        where: { id: createDepartmentDto.parentDepartmentId, isDeleted: false },
      });
      
      if (!parentDepartment) {
        throw new NotFoundException('Parent department not found');
      }
    }

    const department = this.departmentRepository.create(createDepartmentDto);
    return await this.departmentRepository.save(department);
  }

  async update(id: string, updateDepartmentDTO: UpdateDepartmentDTO): Promise<Department> {
    const existingDepartment = await this.departmentRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!existingDepartment) {
      throw new NotFoundException('Department not found');
    }

    if (updateDepartmentDTO.parentDepartmentId) {
      const parentDepartment = await this.departmentRepository.findOne({
        where: { id: updateDepartmentDTO.parentDepartmentId, isDeleted: false },
      });

      if (!parentDepartment) {
        throw new NotFoundException('Parent department not found');
      }

      if (id === updateDepartmentDTO.parentDepartmentId) {
        throw new BadRequestException('Department cannot be its own parent');
      }
    }

    const updatedDepartment = await this.departmentRepository.save({
      ...existingDepartment,
      ...updateDepartmentDTO,
    });

    return updatedDepartment;
  }

  async getAllDepartments(): Promise<Department[]> {
    return this.departmentRepository.find({ 
      where: { isDeleted: false },
      order: { name: 'ASC' }
    });
  }

  async getDepartmentById(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  async getDepartmentTree(){
       

  }

  async deleteDepartment(id: string): Promise<void> {
    const department = await this.departmentRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const employees = await this.userService.findUserByDepartmentId(id);
    if (employees.length > 0) {
      throw new BadRequestException('Cannot delete department that has employees');
    }

    const children = await this.departmentRepository.find({
      where: { parentDepartmentId: id, isDeleted: false },
    });
    if(children.length > 0){
      throw new BadRequestException('Cannot delete department that has departments.')
    }

    await this.departmentRepository.update(id, { isDeleted: true });
  }
}