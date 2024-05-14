
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
        minUppercase: 0 , 
        minSymbols: 0, 
        minLowercase:0,
        minNumbers:0
    }) 
    password: string;

    @IsStrongPassword({
        minLength: 4, 
        minUppercase: 0, 
        minSymbols: 0, 
        minLowercase:0,
        minNumbers: 0    
    }) 
    confpassword: string;
}
