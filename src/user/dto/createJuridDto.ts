import { IsString } from "class-validator";
import { createUserDto } from "./createUserDto";

export class createJury extends createUserDto { 
    @IsString()
    cnpj: string
}