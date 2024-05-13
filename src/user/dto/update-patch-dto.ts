import { createUserDto } from "./createUserDto";
import { PartialType } from '@nestjs/swagger'
export class updatePatchUserDto extends PartialType(createUserDto) {}