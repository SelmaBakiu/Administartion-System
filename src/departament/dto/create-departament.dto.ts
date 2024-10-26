import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDepartamentDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    parentDepartamentId: string;

    @IsString()
    @IsOptional()
    description: string;

}

