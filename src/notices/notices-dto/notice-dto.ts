import { IsString } from "class-validator";

export class noticeDTO{
    @IsString()
    title: string 

    @IsString()
    url: string

    @IsString()
    description: string

}