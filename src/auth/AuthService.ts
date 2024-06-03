import { Injectable, BadRequestException, NotFoundException, HttpException, HttpStatus, Response } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { users } from "@prisma/client";
import { prismaService } from "src/prisma/prisma.service";
import { userService } from "src/user/user.service";
import { agendarDto } from "./dto/auth-agenda-dto";
import { registerDTO } from "./dto/auth-register-dto";
import { isAfter, isBefore, parseISO, setHours, setMilliseconds, setMinutes, setSeconds} from "date-fns";
import {  formatToTimeZone} from "date-fns-timezone" ;

interface agendaInterface {
    created: boolean, 
    message: string
}

interface userInterface{
    statusUser: boolean, 
    message: string, 
}

interface emailUser extends userInterface {
    token: string
}

@Injectable()
export class AuthService {
    constructor(private readonly jwtservice: JwtService,
        private readonly prisma: prismaService,
        private readonly userService: userService
    ) { }

    createToken(user: users) {
        return {
            accessToken: this.jwtservice.sign({
                id: user.id,
                name: user.name,
                email: user.email,
            }, {
                expiresIn: '7 days',
                subject: String(user.id),
                issuer: 'login',
                audience: 'users'
            })

        };
    }

    checkToken(token: string) {
        try {
            const data = this.jwtservice.verify(token, {
                audience: 'users',
                issuer: 'login',
            });
            return data;
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    isValidToken(token: string): boolean {
        try {
            this.checkToken(token);
            return true;
        } catch (e) {
            return false;

        }
    }

    async login(email: string, password: string): Promise <emailUser> {
        const user = await this.prisma.users.findFirst({
            where: {
                email,
                password
            }
        });
        if (!user) {
            return {statusUser: false, message: 'logado com sucesso', token:''}
        }
        const tokenuser = this.createToken(user);
        
        return {statusUser: true, message: 'logado com sucesso', token: tokenuser.accessToken }
    }

    async forget(email: string) {
        const user = await this.prisma.users.findFirst({
            where: {
                email,
            }
        });
        if (!user) {
            throw new NotFoundException('Email incorreto ');
        }
        //enviar o email 
        return true;
    }

    async showUsers(){
       return this.prisma.users.findMany({
        include: {agedas: true}
       })
    }

    async reset(password: string, token: string) {
        const id = 5;
        const user = await this.prisma.users.update({
            where: { id },
            data: {
                password
            }
        });
        return this.createToken(user);
    }

    async register({name,email,pessoa, cnpj ,fone,cpf, password, confpassword}: registerDTO): Promise <userInterface> {

        if ( password !== confpassword){
            return {statusUser: false, message: 'Senhas Diferentes'}
        }
        const cpfuser = await this.prisma.users.findFirst({
            where:{cpf}
          })
        const emailuser = await this.prisma.users.findFirst({
            where:{
                email: email
            }
          })
        const cnpjuser = await this.prisma.users.findFirst({
            where:{
                cnpj: cnpj,
            }
          })

          if (cpfuser){
                return {statusUser: false, message: 'CPF Já foi cadastrado'}
            }
          if (emailuser){
                 return {statusUser: false, message: 'Email Já foi cadastrado'}
            }
          if (cnpjuser){
            return {statusUser: false, message: 'CNPJ Já foi cadastrado'}
            }
          
        await this.prisma.users.create({
        data:{
            name, 
            email,
            pessoa,
            cnpj: cnpj === '' ? null : cnpj, 
            fone,
            cpf: cpf === '' ? null : cpf,   
            password, 
            confpassword
        }
       })

       return { message: 'Usuario Criado com sucesso', statusUser: true }
    }
    // d.M.YYYY HH:mm:ss.SSS [GMT]Z (z)
    agendaUtf (agend: agendarDto) {
        const formatUtf8 = "YYYY-MM-DDTHH:mm"
        const zone = 'America/Fortaleza'
        const horaCorrectUtf = formatToTimeZone( agend.date, formatUtf8, {timeZone: zone} )
        const startHour = formatToTimeZone(setHours(setMinutes(setSeconds(setMilliseconds(new Date(agend.date), 0), 0), 0), 4), formatUtf8, {timeZone:zone });
        const endHour = formatToTimeZone(setHours(setMinutes(setSeconds(setMilliseconds(new Date(agend.date), 0), 0), 0), 18), formatUtf8, {timeZone: zone} );
        const now = formatToTimeZone(new Date(), formatUtf8, {timeZone: zone})
        const date = new Date(agend.date)
        return { date: date ,userDate :horaCorrectUtf, startHour: startHour, endHour: endHour, now: now }
    }

    async agendar( agend: agendarDto, user ): Promise <agendaInterface> {
       
            const { userDate, startHour, endHour,  now, date} = this.agendaUtf(agend)
            
            try{
            if (isBefore( userDate, now )){
                return {created: false, message: 'A data inserida e antes da data de hoje'}
            }
            
            if (isBefore(userDate, startHour) ){
               return {message:'funcionameto apois as 7:00',created: false}
            }
            if (isAfter(userDate, endHour)){
                return{message: 'funcionamento ate as 18 horas ', created: false}
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
            
            const dateparse = parseISO(agend.date )
            if (conflict.some(agenda => {
                const agedDate = new Date(agenda.date)
                const diffInMilliseconds = Math.abs(agedDate.getTime() - dateparse.getTime())
                return  diffInMilliseconds < 7200000;
            })){
                return {message: 'Cada compromisso deve ter um intervalo mínimo de 2 horas', created: false}
            }

            await this.prisma.agenda.create({
                data:{
                    userId: user.id, 
                    date: new Date(agend.date), 
                    name: user.name
                }
        
            })
            return {created: true , message: 'agenda criada'}
            }catch(error){
                console.log(error);    
                return {created: false , message: 'Erro ao criar agenda'}
            }

            
    }

    async showAgenda() {
       const agendaList = await this.prisma.agenda.findMany({
        orderBy: {
            screated_at: 'desc'
        }
       })  
        const formatAgedList = agendaList.map(agenda =>{
        const zoneDate = formatToTimeZone( agenda.date, 'DD/MM/YYYY HH:mm:ss', {timeZone: 'America/Fortaleza'})
        
        return {
            id: agenda.id, 
            name: agenda.name,
            userId: agenda.userId,
            date: zoneDate
        }
    })
       return formatAgedList
    }

    async DeleteAgenda( id :number, user ): Promise <agendaInterface>{
        try{
            const agenda = await this.prisma.agenda.findFirst({
                where:{
                    id: id
                }
            })

            if (!agenda || (await agenda).userId !== user.id ){
               return {created: false, message: 'Permição negada para deletar a agenda'}
            }

            await this.prisma.agenda.delete({
                where: {
                 id: id
                }
             })
             return {message: 'Agenda deletada', created: true}
        }catch(e){
            console.log(e);
            return {created: false, message: 'erro ao deletar a egenda'}
            
        }
    }



}
