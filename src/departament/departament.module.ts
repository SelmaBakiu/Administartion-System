import { Module } from '@nestjs/common';
import { DepartamentController } from './departament.controller';
import { DepartamentService } from './departament.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departament } from 'src/common/entitys/departament.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Departament])],
  controllers: [DepartamentController],
  providers: [DepartamentService]

})
export class DepartamentModule {}
