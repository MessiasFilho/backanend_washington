import { Body, Controller, Post, Get, Headers, Request, Res,  UseGuards,Put, HttpException, HttpStatus, Delete, Param, ParseIntPipe, UseInterceptors, UploadedFile } from "@nestjs/common";
import { loginDto } from "./dto/auth-login-dto";
import { registerDTO } from "./dto/auth-register-dto";
import { forgetDTO } from "./dto/auth-forget-dto";
import { authResetDto } from "./dto/auth-reset-dto";
import { AuthService } from "./AuthService";
import { AuthGuard } from "src/guard/auth.guard";
import { userDecorator } from "src/decorators/user-decorator";
import { Roles } from "src/decorators/role.decorator";
import { role } from "src/enums/role.enum";
import { RoleGuard } from "src/guard/role.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { ParamIdcuston } from "src/decorators/param-id.decorator";
import { error } from "console";

@Controller('auth')
export class AuthController {
    constructor( private readonly authservice: AuthService){}
    
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

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(role.admin, role.user)
    @Get('user')
    async userAuth (@Request() req){
        return req.user
    } 

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(role.admin)
    @Get('showusers')
    async showUsers (){
        return this.authservice.showUsers()
    }

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(role.admin)
    @Get('user/:id')
    async getUser(@ParamIdcuston() id ){
        return await this.authservice.getUserId(id)
    }

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(role.admin)
    @Delete('delete/:id')
    async DeleteUser(@ParamIdcuston() id, @Res() res ){
        const deluser = await this.authservice.DeleteUser(id)
        if (!deluser.statusUser){
            return res.status(HttpStatus.BAD_REQUEST).json({error: deluser.message,})
        }
        return res.status(HttpStatus.OK).json({message: deluser.message})
    }

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(role.admin)
    @Put('update/:id')
    async updateUser (@ParamIdcuston() id, @Body() user , @Res() res ){
       
        const upUser = await this.authservice.updateUser(id, user)

        if(!upUser.statusUser){
            return res.status(HttpStatus.BAD_REQUEST).json({message: upUser.message})
        }
        return res.status(HttpStatus.OK).json({message: upUser.message})
    }



    @Post('forget')
    async forget(@Body() {email}: forgetDTO){
        // return this.auth.forget(email)
    }

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(role.admin, role.user)
    @Post('reset')
    async reset (@Body() {password, token}: authResetDto){
        // return this.auth.reset(password, token)
    }

    @UseGuards(AuthGuard, RoleGuard)
    @Roles(role.user)
    @Post('teste')
    async teste(@userDecorator('role') user){
        return {roles: user, data:'oi'}
    }
    
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(role.user)
    @Post('photo')
    async UploadFoto(@userDecorator() user, @UploadedFile() photho: Express.Multer.File){
        return  {img: photho ,users: user }
    }



}