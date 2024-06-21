import { IsString } from "class-validator"

export class uploadDto {
    @IsString()
    title: string

    @IsString()
    metros: string
    
    @IsString()
    aluguel: string 
    
    @IsString()
    venda: string 
   
    @IsString()
    andar: string 

    @IsString()
    sala: string
    
    @IsString()
    telefone: string 
    
    @IsString()
    description: string 
}