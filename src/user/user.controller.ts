import { Body,Param ,Controller, Post,Get, Put, Patch, Delete, Req, Res, HttpException, HttpStatus } from "@nestjs/common";
import { createUserDto } from "./dto/createUserDto";
import { userService } from "./user.service";
import { ParseIntPipe } from "@nestjs/common"
import { createJury } from "./dto/createJuridDto";


@Controller('users')
export class userController{ 
    constructor(private readonly userservice: userService ){}

    @Post()
    async createUser(@Body() {name,email,pessoa,fone,cpf,password,confpassword}: createUserDto){
        if ( password !== confpassword){
             throw new HttpException('senhas diferentes', HttpStatus.BAD_REQUEST)
        }
        return this.userservice.create({name,email,pessoa,fone, cpf, password,confpassword})
    }

    @Post('legal')
    async createLegalUser(@Body() {name,email,cnpj,pessoa,fone,cpf,password,confpassword}:createJury){
        if ( password !== confpassword){
            throw new HttpException('senhas diferentes', HttpStatus.BAD_REQUEST)
       }
       return this.userservice.createJuri({name,email,cnpj,pessoa,fone,cpf,password,confpassword})
    }

    @Get()
    async showUsers(){
       return this.userservice.showUsers()
    }
    @Get(':id')
    async oneUser(@Param('id', ParseIntPipe) param: number ){
        return this.userservice.showUserId(param)
    }

    @Put(':id')
    async updateUser(@Body() user: createUserDto, @Param('id', ParseIntPipe ) id: number){
        return this.userservice.updateUser(id, user)
    }

    @Patch(':id')
    async updateParcialUser(@Body() user: createJury, @Param('id', ParseIntPipe ) id: number){
        return this.userservice.updateJury(id, user)
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe ) id: number){
         return this.userservice.deleteUser(id)
    }
}