import { Injectable, BadRequestException, NotFoundException, HttpException, HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { users } from "@prisma/client";
import { prismaService } from "src/prisma/prisma.service";
import { createUserDto } from "src/user/dto/createUserDto";
import { userService } from "src/user/user.service";
import { agendarDto } from "./dto/auth-agenda-dto";
import { registerDTO } from "./dto/auth-register-dto";
import { isAfter, isBefore, parseISO, setHours, setMilliseconds, setMinutes, setSeconds} from "date-fns";
const { listTimeZones } = require('timezone-support')
import {  formatToTimeZone} from "date-fns-timezone";

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

    async login(email: string, password: string) {
        const user = await this.prisma.users.findFirst({
            where: {
                email,
                password
            }
        });
        if (!user) {
            throw new NotFoundException('Email ou Senha incorreta ');
        }
        return this.createToken(user);
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

    async register({name,email,pessoa, cnpj ,fone,cpf, password,confpassword}: registerDTO) {
        
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
             const resp = new HttpException('CPF Já Cadastrado', HttpStatus.BAD_REQUEST)
                return {valid: false, resp}
            }
          if (emailuser){
             const resp = new HttpException('email Já Cadastrado', HttpStatus.BAD_REQUEST)
                return {valid: false, resp}
            }
          if (cnpjuser){
             const resp = new HttpException('CNPJ Já Cadastrado', HttpStatus.BAD_REQUEST)
                return {valid: false, resp}
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

       return { message: 'Usuario Criado com sucesso', valid: true }
    }
    // d.M.YYYY HH:mm:ss.SSS [GMT]Z (z)
    agendaUtf (agend: agendarDto) {
        const formatUtf8 = "YYYY-MM-DDTHH:mm"
        const zone = 'America/Fortaleza'
        const horaCorrectUtf = formatToTimeZone( agend.date, formatUtf8, {timeZone: zone} )
        const startHour = formatToTimeZone(setHours(setMinutes(setSeconds(setMilliseconds(new Date(agend.date), 0), 0), 0), 4), formatUtf8, {timeZone:zone });
        const endHour = formatToTimeZone(setHours(setMinutes(setSeconds(setMilliseconds(new Date(agend.date), 0), 0), 0), 18), formatUtf8, {timeZone: zone} );
        const now = formatToTimeZone(new Date(), formatUtf8, {timeZone: zone})
        return {userDate :horaCorrectUtf, startHour: startHour, endHour: endHour, now: now }
    }

    async agendar( agend: agendarDto, user ) {
       
            const { userDate, startHour, endHour,  now} = this.agendaUtf(agend)
            
            if (isBefore( userDate, now )){
                throw new HttpException('Voçe e um viajate do tempo?', HttpStatus.BAD_REQUEST,{cause: 'Voçe marcou antes da data ou hora atual'} )
            }
            
            if (isBefore(userDate, startHour) ){
                throw new HttpException('funcionameto apois as 7:00', HttpStatus.BAD_REQUEST,{cause: 'Voçe Marcou para entes das 7:00'} )
            }
            if (isAfter(userDate, endHour)){
                throw new HttpException('funcionameto ate as 18:00', HttpStatus.BAD_REQUEST,{cause: 'Voçe Marcou para entes das 7:00'} )
            }
            const horaInicial =  setHours(setMinutes(setSeconds(setMilliseconds(new Date(agend.date), 0), 0), 0), 7)
            const horaFinal = setHours(setMinutes(setSeconds(setMilliseconds(new Date(agend.date), 0), 0), 0), 18)
            
            const conflict = await this.prisma.agenda.findMany({
                where:{
                    userId: user.id,
                    date:{
                        gte: horaInicial, 
                        lte: horaFinal
                    }
                }
            })
            
            const dateparse = parseISO(agend.date )
            if (conflict.some(agenda => {
                const agedDate = new Date(agenda.date)
                const diffInMilliseconds = Math.abs(agedDate.getTime() - dateparse.getTime())
                return  diffInMilliseconds < 7200000;
            })){
                throw new HttpException('Cada compromisso deve ter um intervalo mínimo de 1 hora e máximo de 2 horas de outros compromissos.', HttpStatus.BAD_REQUEST,{cause: 'Voçe Marcou para entes das 7:00'} )
            }

            return this.prisma.agenda.create({
                data:{
                    userId: user.id, 
                    date: new Date(agend.date), 
                    name: user.name
                }
            })
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

    async UpdateAgenda (){
        try {
            
        } catch (error) {
            
        }
    }

    async DeleteAgenda( id :number, user ){
        try{
            const agenda = await this.prisma.agenda.findFirst({
                where:{
                    id: id
                }
            })

            if (!agenda || (await agenda).userId !== user.id ){
                throw new HttpException('Permissão negada para deletar este compromisso.', HttpStatus.BAD_REQUEST)
            }

            await this.prisma.agenda.delete({
                where: {
                 id: id
                }
             })

        }catch(e){
            throw new HttpException('error ao deletar agenda', HttpStatus.BAD_REQUEST)
            
        }
    }



}
