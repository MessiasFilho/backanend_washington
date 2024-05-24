import { IsDate, IsNumber, IsString } from "class-validator";

export class agendarDto {
    @IsString()
    date: string

}