import { Injectable, BadRequestException, NotFoundException, HttpException, HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { users } from "@prisma/client";
import { prismaService } from "src/prisma/prisma.service";
import { createUserDto } from "src/user/dto/createUserDto";
import { userService } from "src/user/user.service";
import { agendarDto } from "./dto/auth-agenda-dto";
import { registerDTO } from "./dto/auth-register-dto";
import { fromZonedTime } from 'date-fns-tz';
import { addHours, isAfter, isBefore, parse, parseISO, setHours, setMinutes, setSeconds, startOfToday, subHours} from "date-fns";
const { listTimeZones } = require('timezone-support')
import { parseFromTimeZone, formatToTimeZone,convertToLocalTime,convertToTimeZone  } from "date-fns-timezone";
import { agent } from "supertest";


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
    agendaUtf (agend: string) {
        const format = "d.M.yyyy HH:mm:ss.SSS 'GMT'XXX (z)"
        const formatUtf8 = 'YYYY-MM-ddTHH:mm:ssZ'
        const horaCorrectUtf = formatToTimeZone( agend, formatUtf8, {timeZone:'America/Fortaleza'} )
        
        const parceDate = parse(horaCorrectUtf, format, new Date())
        // const formatutf = "yyyy-MM-dd'T'HH:mm:ss.SSSX"
        // const endPointDate = formatToTimeZone( agend, format, {timeZone:'America/Fortaleza'} )
        // const startHour = formatToTimeZone(String(setHours(startOfToday(), 7)), format, {timeZone:'America/Fortaleza' });
        const endHour = String(setHours(startOfToday(), 20));
        // if (isNaN(parceDate)) {
        //     throw new Error('Invalid date format');
        //   }
        
        return {info :horaCorrectUtf}
    }

    convertISO(){

    }

    async agendar( agend: agendarDto, user ) {
       
        try {
            const now = new Date()
            console.log( 'Antes de formatar',parseISO(agend.date));
            const {info} = this.agendaUtf(agend.date)
            console.log('apos formatar', info);
            const startHour = String(setHours(startOfToday(), 7));
            const endHour = String(setHours(startOfToday(), 20));
            
            // console.log('hora Inicial', startHour,' hora final', endHour, 'info', info);
            console.log('info', info);
            
            
          
    
            // return this.prisma.agenda.create({
            //     data:{
            //         userId: user.id, 
            //         date: new Date(info), 
            //         name: user.name
            //     }
            // })


        }catch(error){
            throw new HttpException('Erro ao criar compromisso', HttpStatus.BAD_REQUEST,{ cause: 'teste'})
        }
      
       

      
    
    }

    async showAgenda() {
       const agenda = await this.prisma.agenda.findMany({
        
       })  
       return agenda 
    }

}
