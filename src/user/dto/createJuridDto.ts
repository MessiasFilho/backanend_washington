import { IsString } from "class-validator";
import { createUserDto } from "./createUserDto";

export class createJuryDto extends createUserDto { 
    @IsString()
    cnpj: string
}