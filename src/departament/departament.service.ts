import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Departament } from 'src/common/entitys/departament.entity';
import { IsNull, Repository, UpdateResult } from 'typeorm';
import { CreateDepartamentDto } from './dto/create-departament.dto';
import { UpdateDepartamentDTO } from './dto/update-departament.dto';

@Injectable()
export class DepartamentService {
  constructor(
    @InjectRepository(Departament)
    private departamentRepository: Repository<Departament>,
  ) {}

  async create(
    createDepartamentDto: CreateDepartamentDto,
  ): Promise<Departament> {
    try {
      if (
        await this.departamentRepository.findOne({
          where: {
            name: createDepartamentDto.name,
            parentDepartamentId: createDepartamentDto.parentDepartamentId,
            isDeleted: false,
          },
        })
      ) {
        throw new Error('Departament already exists');
      }
      const departament =
        this.departamentRepository.create(createDepartamentDto);
      return await this.departamentRepository.save(departament);
    } catch (err) {
      throw new Error(err);
    }
  }

  async update(
    id: string,
    updateDepartamentDTO: UpdateDepartamentDTO,
  ): Promise<Departament> {
    try {
      const existingDepartament = await this.departamentRepository.findOne({
        where: { id },
      });
      if (!existingDepartament) {
        throw new Error('Departament not found');
      }
      if (existingDepartament.isDeleted) {
        throw new Error('Departament is deleted');
      }
        return await this.departamentRepository.save({
            ...existingDepartament,
            ...updateDepartamentDTO,
        });
    } catch (err) {
      throw new Error(err);
    }
  }

  async getAllDepartaments() {
    try {
      return this.departamentRepository.find({ where: { isDeleted: false } });
    } catch (err) {
      throw new Error(err);
    }
  }

  async getDepartamentById(id: string) {
    try {
      const departament = await this.departamentRepository.findOne({
        where: { id, isDeleted: false },
      });
      if (!departament) {
        throw new Error('Departament not found');
      }
      return departament;
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteDepartament(id: string): Promise<void> {
    try {
      const departament = await this.departamentRepository.findOne({
        where: { id },
      });
      if (!departament) {
        throw new Error('Departament not found');
      }
      const children = await this.departamentRepository.find({
        where: { parentDepartamentId: id, isDeleted: false },
      });
        for (const child of children) {
          await this.departamentRepository.update(child.id, { parentDepartamentId: null });
        }
        await this.departamentRepository.update(id, { isDeleted: true });
    } catch (err) {
      throw new Error(err);
    }
  }
  async getDepartamentChildren(id: string) {
    try {
      return await this.departamentRepository.find({
        where: { parentDepartamentId: id, isDeleted: false },
      });
    } catch (err) {
      throw new Error(err);
    }
  }
  async getParentDepartament() {
    try {
      return await this.departamentRepository.find({
        where: { parentDepartamentId: IsNull(), isDeleted: false },
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}
