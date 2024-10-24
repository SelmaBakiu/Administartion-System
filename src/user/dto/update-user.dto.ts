import { IsString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  employeeId: string;

  @IsString()
  @IsOptional()
  department: string;

  @IsString()
  @IsOptional()
  position: string;

  @IsString()
  @IsOptional()
  dateOfBirth: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
