import { Body,Param ,Controller, Post,Get, Put, Patch, Delete, HttpException, HttpStatus, UseInterceptors, UseGuards } from "@nestjs/common";
import { createUserDto } from "./dto/createUserDto";
import { userService } from "./user.service";
import { ParseIntPipe } from "@nestjs/common"
import { createJuryDto } from "./dto/createJuridDto";
import { logInterceptor } from "src/interceptors/log.interceptor";
import { ParamIdcuston } from "src/decorators/param-id.decorator";
import { AuthGuard } from "src/guard/auth.guard";

 @UseInterceptors(logInterceptor)
@Controller('users')
export class userController{ 
    constructor(private readonly userservice: userService ){}

   
    // @Post()
    // async createUser(@Body() {name,email,pessoa,fone,cpf,password,confpassword, admin}: createUserDto){
    //     if ( password !== confpassword){
    //          throw new HttpException('senhas diferentes', HttpStatus.BAD_REQUEST)
    //     }
    //     return this.userservice.create({name,email,pessoa,fone, cpf, password,confpassword , admin})
    // }

    // @Post('legal')
    //     async createLegalUser(@Body() {name,email,cnpj,pessoa,fone,cpf,password,confpassword , admin}:createJury){
    //     if ( password !== confpassword){
    //         throw new HttpException('senhas diferentes', HttpStatus.BAD_REQUEST)
    //    }
    //    return this.userservice.createJuri({name,email,cnpj,pessoa,fone,cpf,password,confpassword, admin})
    // }

    // @UseGuards(AuthGuard)
    @Get('showUsers')
    async showUsers(){
       return this.userservice.showUsers()
    }
    //uso de parametro customizado
    @Get(':id')
        async oneUser(@ParamIdcuston() param: number ){
        return this.userservice.showUserId(param)
    }

    @Put(':id')
        async updateUser(@Body() user: createUserDto, @Param('id', ParseIntPipe ) id: number){
        return this.userservice.updateUser(id, user)
    }

    @Patch(':id')
        async updateParcialUser(@Body() user: createJuryDto, @Param('id', ParseIntPipe ) id: number){
        return this.userservice.updateJury(id, user)
    }

    @Delete(':id')
        async deleteUser(@Param('id', ParseIntPipe ) id: number){
         return this.userservice.deleteUser(id)
    }
}