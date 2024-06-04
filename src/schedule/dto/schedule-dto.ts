import { IsString } from "class-validator";

export class scheduleDto {
    @IsString()
    date: string
}