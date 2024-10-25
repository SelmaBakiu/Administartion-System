import { IsOptional, IsString } from "class-validator";

export class UpdateDepartamentDTO {

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    parentDepartamentId: string;

    @IsString()
    @IsOptional()
    description: string;

}