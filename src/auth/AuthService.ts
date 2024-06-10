import { Injectable, BadRequestException, NotFoundException, HttpException, HttpStatus, Response } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { users } from "@prisma/client";
import { prismaService } from "src/prisma/prisma.service";
import { registerDTO } from "./dto/auth-register-dto";
import * as bcrypt  from 'bcrypt'
import { createUserDto } from "src/user/dto/createUserDto";

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
            }
        });


        if (!user) {
            return {statusUser: false, message: 'email ou senha incorretos', token:''}
        }
        if(!await bcrypt.compare(password , user.password)){
            return {statusUser: false, message: 'email ou senha incorretos', token:''}
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
        where: {
            role: 'users'
        },
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

    async register({name,email,pessoa, cnpj ,fone,cpf, password, confpassword, role}: registerDTO): Promise <userInterface> {
        const salt = await bcrypt.genSalt()

        if ( password !== confpassword){
            return {statusUser: false, message: 'Senhas Diferentes'}
        }

        password = await bcrypt.hash(password, salt)
        confpassword = await bcrypt.hash(confpassword, salt)

        
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
            role,
            confpassword
        }
       })

       return { message: 'Usuario Criado com sucesso', statusUser: true }
    }

    async getUserId(id: number) {
        const user =  await this.prisma.users.findFirst({
            where: {id}
        })
        return user
    }

    async updateUser( id: number , {name,email,pessoa, cnpj ,fone,cpf, role} : registerDTO ):Promise <userInterface> {
       
        
            try{
                 await this.prisma.users.updateMany({
                    where: {id}, 
                    data:{
                        name, 
                        email,
                        pessoa,
                        cnpj: cnpj === '' ? null : cnpj, 
                        fone,
                        cpf: cpf === '' ? null : cpf,   
                        role,
                    }
                })
                return {statusUser: true, message:  'Usuario Atulizado'}
            }catch(e){
                return {statusUser: false, message:  'Error ao Atualizar usuario '}
                }
    }

    async DeleteUser (id: number ): Promise <userInterface>{
        try{
             await this.prisma.users.delete({
            where:{id}
        })
            return {statusUser: true, message:  'Usuario Deletado'}
        }catch(e){
            return {statusUser: true, message:  'Error Deletar usuario'}
        }
       
    }

}
