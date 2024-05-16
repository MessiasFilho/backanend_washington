import { IsEmail, IsStrongPassword  } from "class-validator";

export class loginDto {
    @IsEmail()
    email: string 

    @IsStrongPassword({
        minLength: 4, 
        minUppercase: 0 , 
        minSymbols: 0, 
        minLowercase:0,
        minNumbers:0
    })
    password: string

}