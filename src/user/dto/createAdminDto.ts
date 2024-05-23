import { IsString } from "class-validator";
import { createUserDto } from "./createUserDto";

export class adminDto extends createUserDto{
    @IsString()
    role : string
}