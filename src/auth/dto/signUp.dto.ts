import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class SignUpDTO {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}