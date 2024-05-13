
import { IsEmail, IsString, IsStrongPassword} from "class-validator";

export class createUserDto {
    
    @IsString()    
    name: string

    @IsEmail()
    email: string
    
    @IsString()
    fone: string

    @IsStrongPassword({
        minLength: 4, 
        minUppercase: 1, 
        minSymbols: 1, 
        minLowercase:0,
        minNumbers:2
    }) 
    password: string;

    @IsStrongPassword({
        minLength: 4, 
        minUppercase: 1, 
        minSymbols: 1, 
        minLowercase:0,
        minNumbers:2    
    }) 
    confpassword: string;
}
