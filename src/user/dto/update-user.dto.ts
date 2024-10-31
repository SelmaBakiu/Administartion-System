import { IsString, IsEnum, IsOptional, IsEmail, IsUUID } from 'class-validator';
import { Role } from '../../common/enums/role.enum';
import { UUID } from 'crypto';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  departmentId: string;

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
