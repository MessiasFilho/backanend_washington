import { Body, Controller, Post, Get, Headers, UseGuards, Request } from "@nestjs/common";
import { loginDto } from "./dto/auth-login-dto";
import { registerDTO } from "./dto/auth-register-dto";
import { forgetDTO } from "./dto/auth-forget-dto";
import { authResetDto } from "./dto/auth-reset-dto";
import { userService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { AuthGuard } from "src/guard/auth.guard";
import { userDecorator } from "src/decorators/user-decorator";

@Controller('auth')
export class AuthController {

    constructor(private readonly userservice: userService, 
                private readonly authservice: AuthService
    ){}
    
    @Post('login')
    async loginUser (@Body() {email, password}: loginDto){
         return this.authservice.login(email, password)
    } 

    @Post('register')
    async register (@Body() body: registerDTO){
        return this.userservice.create(body)
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
    @Post('teste')
    async teste(@userDecorator('password') user){
         return { user }

    }
}