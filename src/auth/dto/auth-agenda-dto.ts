import {  IsString } from "class-validator";

export class agendarDto {

    @IsString()
    date: string
    
}