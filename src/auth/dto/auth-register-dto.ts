
import { IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword} from "class-validator";
import { role } from "src/enums/role.enum";

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

    @IsOptional()
    @IsEnum(role)
    role: string

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