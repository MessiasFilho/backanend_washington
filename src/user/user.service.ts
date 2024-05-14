import { Body, Injectable } from "@nestjs/common";
import { createUserDto } from "./dto/createUserDto";

import { prismaService } from "src/prisma/prisma.service";

@Injectable()
export class userService {
  constructor(private prisma: prismaService ){} 
  
  async create( {name,email,fone,password,confpassword}:createUserDto){
    return await this.prisma.users.create({
      data: {
        name,
        email, 
        fone, 
        password, 
        confpassword
      },

    })
  }
       
}