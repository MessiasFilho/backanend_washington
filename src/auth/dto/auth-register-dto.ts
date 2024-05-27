
import { IsEmail, IsString, IsStrongPassword} from "class-validator";

export class registerDTO  {

    @IsString()    
    name: string

    @IsEmail()
    email: string

    @IsString()
    pessoa: string

    @IsString()
    fone: string

    @IsString()
    cpf: string

    @IsString()
    cnpj: string

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