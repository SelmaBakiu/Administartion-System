import { IsOptional, IsString } from "class-validator";

export class UpdateDepartamentDTO {

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    parentDepartamentId: string | null;

    @IsString()
    @IsOptional()
    description: string;

}