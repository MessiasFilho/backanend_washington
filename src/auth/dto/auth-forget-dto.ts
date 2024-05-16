import { IsEmail } from "class-validator";

export class forgetDTO {
    @IsEmail()
    email: string
}