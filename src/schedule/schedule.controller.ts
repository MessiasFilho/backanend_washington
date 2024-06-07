import { Controller, Get, UseGuards, Post, Request, Body, Res, HttpStatus, Delete, Put } from "@nestjs/common";
import { Roles } from "src/decorators/role.decorator";
import { role } from "src/enums/role.enum";
import { AuthGuard } from "src/guard/auth.guard";
import { RoleGuard } from "src/guard/role.guard";
import { scheduleDto } from "./dto/schedule-dto";
import { scheduleSevice } from "./schedule.service";
import { ParamIdcuston } from "src/decorators/param-id.decorator";
import { SkipThrottle } from "@nestjs/throttler";

@UseGuards(AuthGuard, RoleGuard)
@Controller('schedule')
export class scheduleController {
    constructor(private readonly schedduleSevice: scheduleSevice){}
  
    @Roles(role.admin, role.user)
    @Post('create')
    async agendar (@Request() req, @Body() body :scheduleDto, @Res() res  ){
       const agenda = await this.schedduleSevice.createSchedule(body, req.user)
       if (!agenda.status){
            return res.status(HttpStatus.BAD_REQUEST).json({error: agenda.message})
       }
         return res.status(HttpStatus.CREATED).json({message: agenda.message})
    }
    
    @SkipThrottle()
    @Roles(role.admin, role.user)
    @Get('list')
    async listAgendas(){
        return this.schedduleSevice.getAllSchedules()
    }

    @Roles(role.admin, role.user)
    @Delete('delete/:id')
    async deleteAgenda( @ParamIdcuston() id: number, @Request() req, @Res() res  ){
        const agenda = await this.schedduleSevice.deleteSchedule(id, req.user)

        if (!agenda.status){
            return res.status(HttpStatus.BAD_REQUEST).json({error: agenda.message})
        }
        return res.status(HttpStatus.OK).json({message: agenda.message})
    }

    @Roles(role.admin)
    @Delete('admdelete/:id')
    async adminDelete(@ParamIdcuston() id, @Request() req, @Res() res){
        const schedule = await this.schedduleSevice.deleteScheduleAdmin(id, req.user)
        if (!schedule.status){
            return res.status(HttpStatus.BAD_REQUEST).json({error: schedule.message})
        }
        return res.status(HttpStatus.OK).json({message: schedule.message})
    }

    @Roles(role.admin)
    @Put('updateschedule/:id')
    async updated(@ParamIdcuston() id, @Request() req, @Res() res){
        const schedule = await this.schedduleSevice.deleteScheduleAdmin(id, req.user)
        if (!schedule.status){
            return res.status(HttpStatus.BAD_REQUEST).json({error: schedule.message})
        }
        return res.status(HttpStatus.OK).json({message: schedule.message})
    }
    
}