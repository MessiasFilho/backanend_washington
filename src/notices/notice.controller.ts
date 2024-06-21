import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { Roles } from "src/decorators/role.decorator";
import { role } from "src/enums/role.enum";
import { AuthGuard } from "src/guard/auth.guard";
import { RoleGuard } from "src/guard/role.guard";
import { noticeService } from "./notice.service";
import { noticeDTO } from "./notices-dto/notice-dto";

@Controller('notice')
export class noticeController{
    constructor(private readonly noticeservice:noticeService){}

   @UseGuards(AuthGuard, RoleGuard)
   @Roles(role.admin)
   @Post('create')
   async createNotice(@Body() notice: noticeDTO ){
        return {data: notice}
   }

}