import { Injectable } from "@nestjs/common";
import { prismaService } from "src/prisma/prisma.service";
import { scheduleDto } from "./dto/schedule-dto";
import { isAfter, isBefore, parseISO, setHours, setMilliseconds, setMinutes, setSeconds} from "date-fns";
import {  formatToTimeZone} from "date-fns-timezone" ;

interface scheduleInterface {
    status: boolean, 
    message: string
}

@Injectable()
export class scheduleSevice{
    
    constructor(private readonly prisma: prismaService){}

    agendaUtf (agend: scheduleDto) {
        const formatUtf8 = "YYYY-MM-DDTHH:mm"
        const zone = 'America/Fortaleza'
        const horaCorrectUtf = formatToTimeZone( agend.date, formatUtf8, {timeZone: zone} )
        const startHour = formatToTimeZone(setHours(setMinutes(setSeconds(setMilliseconds(new Date(agend.date), 0), 0), 0), 4), formatUtf8, {timeZone:zone });
        const endHour = formatToTimeZone(setHours(setMinutes(setSeconds(setMilliseconds(new Date(agend.date), 0), 0), 0), 18), formatUtf8, {timeZone: zone} );
        const now = formatToTimeZone(new Date(), formatUtf8, {timeZone: zone})
        const date = new Date(agend.date)
        return { date: date ,userDate :horaCorrectUtf, startHour: startHour, endHour: endHour, now: now }
    }

    async getSchedule(id: number , user ): Promise<scheduleInterface>{
         await this.prisma.agenda.findFirst({
            where: user.id , 
            include: user
        })
        return {status: true, message:"success"}
    }

    async createSchedule (schedule: scheduleDto, user){
      
        const { userDate, startHour, endHour,  now, date} = this.agendaUtf(schedule)
            
        try{
        if (isBefore( userDate, now )){
            return {status: false, message: 'A data inserida e antes da data de hoje'}
        }
        
        if (isBefore(userDate, startHour) ){
           return {message:'funcionameto apois as 7:00',status: false}
        }
        if (isAfter(userDate, endHour)){
            return{message: 'funcionamento ate as 18 horas ', status: false}
        }

        const hInicial = new Date(date.getTime() - 2 * 60 * 60 * 1000) 
        const hFinal = new Date(date.getTime()  + 2 * 60 * 60 * 1000) 
        
        const conflict = await this.prisma.agenda.findMany({
            where:{
                date:{
                    gte: hInicial, 
                    lte: hFinal
                }
            }
        })
        
        const dateparse = parseISO(schedule.date )
        if (conflict.some(agenda => {
            const agedDate = new Date(agenda.date)
            const diffInMilliseconds = Math.abs(agedDate.getTime() - dateparse.getTime())
            return  diffInMilliseconds < 7200000;
        })){
            return {message: 'Cada compromisso deve ter um intervalo mínimo de 2 horas', status: false}
        }

        await this.prisma.agenda.create({
            data:{
                userId: user.id, 
                date: new Date(schedule.date), 
                name: user.name,
                email: user.email, 
                fone: user.fone,
            }
    
        })
        return {status: true , message: 'agenda criada'}
        }catch(error){
            console.log(error);    
            return {status: false , message: 'Erro ao criar agenda'}
        }
    }

    async UpdatedSchedule(id: number, schedule: scheduleDto ){
        const { userDate, startHour, endHour,  now, date} = this.agendaUtf(schedule)
            
        try{
        if (isBefore( userDate, now )){
            return {status: false, message: 'A data inserida e antes da data de hoje'}
        }
        
        if (isBefore(userDate, startHour) ){
           return {message:'funcionameto apois as 7:00',status: false}
        }
        if (isAfter(userDate, endHour)){
            return{message: 'funcionamento ate as 18 horas ', status: false}
        }

        const hInicial = new Date(date.getTime() - 2 * 60 * 60 * 1000) 
        const hFinal = new Date(date.getTime()  + 2 * 60 * 60 * 1000) 
        
        const conflict = await this.prisma.agenda.findMany({
            where:{
                date:{
                    gte: hInicial, 
                    lte: hFinal
                }
            }
        })
        
        const dateparse = parseISO(schedule.date )
        if (conflict.some(agenda => {
            const agedDate = new Date(agenda.date)
            const diffInMilliseconds = Math.abs(agedDate.getTime() - dateparse.getTime())
            return  diffInMilliseconds < 7200000;
        })){
            return {message: 'Cada compromisso deve ter um intervalo mínimo de 2 horas', status: false}
        }

        await this.prisma.agenda.update({
            where:{id},
            data:{
                date: new Date (schedule.date)
            }

        })
        return {status: true , message: 'Agenda Atualizada'}
        }catch(error){
            console.log(error);    
            return {status: false , message: 'Erro ao Atualizar agenda'}
        }
    }

    async getAllSchedules(){
        const agendaList = await this.prisma.agenda.findMany({
            orderBy: {
                screated_at: 'desc'
            }
           })  
            const formatAgedList = agendaList.map(agenda =>{
            const zoneDate = formatToTimeZone( agenda.date, 'DD/MM/YYYY HH:mm:ss', {timeZone: 'America/Fortaleza'})

            return {
                id:     agenda.id, 
                name:   agenda.name,
                email:  agenda.email, 
                fone:   agenda.fone,
                userId: agenda.userId,
                date:   zoneDate, 
                screated_at: formatToTimeZone(agenda.screated_at, 'DD/MM/YYYY HH:mm:s', {timeZone: 'America/Fortaleza'})
            }
        })
           return formatAgedList
    }

    async deleteSchedule(id: number, user): Promise <scheduleInterface>{
        try{
            const agenda = await this.prisma.agenda.findFirst({
                where:{id}
            })

            if (!agenda || (await agenda).userId !== user.id ){
               return {status: false, message: 'Permição negada para deletar a agenda'}
            }

            await this.prisma.agenda.delete({
                where: {id}
             })
             return {message: 'Agenda deletada', status: true}
        }catch(e){
            console.log(e);
            return {status: false, message: 'erro ao deletar a egenda'}
            
        }
    }

    async deleteScheduleAdmin(id: number, user): Promise<scheduleInterface>{
           
        try {
            await this.prisma.agenda.delete({
                where: {id}, 
                
            })
            return { status: false, message: 'Agenda Deletada' }
        }catch(e){
            return {status: false, message: 'erro ao deletar a egenda'}
        }
    }



}