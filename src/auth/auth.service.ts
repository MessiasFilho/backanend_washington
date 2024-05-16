import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { prismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
    constructor (private readonly jwtservice: JwtService, private readonly prisma: prismaService){   }
    async createToken(){
        // return this.jwtservice.sign()
    }
    async checkToken(){
        // return this.jwtservice.verify()
    }

    async login(email: string , password: string ){
        const user = await this.prisma.users.findFirst({
            where:{
                email, 
                password
            }
        })
        if (!user){
            throw new NotFoundException('Email ou Senha incorreta ')
        }
        return user 
    }
    
    async forget(email: string ){
        const user = await this.prisma.users.findFirst({
            where:{
                email, 
              
            }
        })
        if (!user){
            throw new NotFoundException('Email incorreto ')
        }
        //enviar o email 
        return true 
    }
    
    async reset( password: string,  token: string ){
        //to do validar o token.......
        const id = 5 
        await this.prisma.users.update({
            where:{id}, 
            data:{
                password
            }
        })
        return true
    }
    
}