import { IsJWT, IsString, IsStrongPassword } from "class-validator";

export class authResetDto {
    
    @IsString()
    @IsStrongPassword({
        minLength: 4, 
        minUppercase: 0 , 
        minSymbols: 0, 
        minLowercase:0,
        minNumbers:0
    })
    password: string
    
    @IsString()
    @IsStrongPassword({
        minLength: 4, 
        minUppercase: 0 , 
        minSymbols: 0, 
        minLowercase:0,
        minNumbers:0
    })
    confpassword: string

    @IsJWT()
    token: string

}