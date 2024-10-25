import { Module } from '@nestjs/common';
import { DepartamentController } from './departament.controller';
import { DepartamentService } from './departament.service';

@Module({
  controllers: [DepartamentController],
  providers: [DepartamentService]
})
export class DepartamentModule {}
