import { Injectable, NotFoundException } from "@nestjs/common";
import { createUserDto } from "./dto/createUserDto";
import { prismaService } from "src/prisma/prisma.service";
import { createJury } from "./dto/createJuridDto";

@Injectable()
export class userService {
  constructor(private prisma: prismaService ){} 
  
  async create( {name,email,pessoa ,fone,cpf, password,confpassword}: createUserDto){
    return await this.prisma.users.create({
      data: {
        name,
        email, 
        pessoa,
        fone, 
        cpf,
        password, 
        confpassword
      },
    })
  }

  async createJuri( {name,email,pessoa,fone,cnpj,confpassword,cpf,password}:createJury){
    return this.prisma.users.create({
      data: {
        name, 
        email,
        pessoa, 
        cnpj, 
        fone,
        cpf,
        password,
        confpassword,
      }
    })
  }

 async showUsers(){
    const users = await this.prisma.users.findMany({
      include: {agedas: true}
    })
    return users

 }

 async showUserId(id: number){

    const user = await this.prisma.users.findUnique({
      where: {
        id: id
      }
    })
    if (!user){
      throw new NotFoundException('Usuario não encontrado')
    }


    return user
 }

 async updateUser(id:number, user :createUserDto){

  const use = await this.prisma.users.findUnique({
    where:{id}
  })

  if (!use){ 
    throw new NotFoundException('Usuario Não encontrado')
  }

  return this.prisma.users.update({
    where: {id}, 
    data: user
  })

 }

 async updateJury( id:number, body: createJury ){
    const user = await this.prisma.users.findUnique({
      where: {id}
    })
    if (!user){
      throw new NotFoundException('Usuario não encontrado')
    }
    return this.prisma.users.update({
      where:{id}, 
      data: body

    })
 }
 
 async deleteUser(id: number){
    const user = await this.prisma.users.findUnique({
      where: {id}
    })
    if (!user){
      throw new NotFoundException('Usuario não encontrado')
    }

    return this.prisma.users.delete({
      where:{id}
    })
 }
}