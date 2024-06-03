import { Body, Controller, Post, Get, Headers, Request, Res,  UseGuards, HttpException, HttpStatus, Delete, Param, ParseIntPipe } from "@nestjs/common";
import { loginDto } from "./dto/auth-login-dto";
import { registerDTO } from "./dto/auth-register-dto";
import { forgetDTO } from "./dto/auth-forget-dto";
import { authResetDto } from "./dto/auth-reset-dto";
import { userService } from "src/user/user.service";
import { AuthService } from "./AuthService";
import { AuthGuard } from "src/guard/auth.guard";
import { userDecorator } from "src/decorators/user-decorator";

import { agendarDto } from "./dto/auth-agenda-dto";
import { Response } from "express";

@Controller('auth')
export class AuthController {
    constructor(private readonly userservice: userService, 
                private readonly authservice: AuthService
    ){}
    
    @Post('login')
    async loginUser (@Body() {email, password}: loginDto, @Res() res) {
         const emailuser = await this.authservice.login(email, password)
         if (!emailuser.statusUser){
            return res.status(HttpStatus.BAD_REQUEST).json({error: emailuser.message })
         }
         return res.status(HttpStatus.OK).json({message: emailuser.message, token: emailuser.token})
    } 

    @Post('register')
    async register (@Body() body: registerDTO, @Res() resp ) {   
        const user = await this.authservice.register(body)
        if(!user.statusUser){
          return resp.status(HttpStatus.BAD_REQUEST).json({error: user.message})
        }
        return resp.status(HttpStatus.OK).json({message: user.message, valid: user.statusUser})
    }

    @UseGuards(AuthGuard)
    @Get('user')
    async userAuth (@Request() req){
        return req.user
    } 

    @UseGuards(AuthGuard)
    @Get('showusers')
    async showUsers (){
        return this.authservice.showUsers()
    }

    @Post('forget')
    async forget(@Body() {email}: forgetDTO){
        // return this.auth.forget(email)
    }

    @Post('reset')
    async reset (@Body() {password, token}: authResetDto){
        // return this.auth.reset(password, token)
    }

    
    @UseGuards(AuthGuard)
    @Post('agendar')
    async agendar (@Request() req, @Body() body :agendarDto, @Res() res  ){
       const agenda = await this.authservice.agendar(body, req.user)
       if (!agenda.created){
            return res.status(HttpStatus.BAD_REQUEST).json({error: agenda.message})
       }
         return res.status(HttpStatus.CREATED).json({message: agenda.message})
    }

    @UseGuards(AuthGuard)
    @Get('listagenda')
    async listAgendas(){
        return this.authservice.showAgenda()
    }

    @UseGuards(AuthGuard)
    @Delete('deleteagenda/:id')
    async deleteAgenda(@Param('id', ParseIntPipe ) id: number, @Request() req, @Res() res  ){
        const agenda = await this.authservice.DeleteAgenda(id, req.user)

        if (!agenda.created){
            return res.status(HttpStatus.BAD_REQUEST).json({error: agenda.message})
        }
        return res.status(HttpStatus.OK).json({message: agenda.message})
    }

    @UseGuards(AuthGuard)
    @Post('teste')
    async teste(@userDecorator('password') user, @Request() req ){
        return {data: req.user}
    }
}