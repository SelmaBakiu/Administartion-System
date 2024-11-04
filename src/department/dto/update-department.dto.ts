import { IsOptional, IsString } from 'class-validator';

export class UpdateDepartmentDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  parentDepartmentId: string | null;

  @IsString()
  @IsOptional()
  description: string;
}
