import { CanActivate, ExecutionContext, Inject, Injectable, forwardRef } from "@nestjs/common";
import { AuthService } from "src/auth/AuthService";
import { userService } from "src/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate{
    
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authorService: AuthService, 
        private readonly userservice: userService
     ){} 

    async canActivate (context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()
        const {authorization} = request.headers;   
        try{
             const data =  this.authorService.checkToken((authorization ?? '').split(' ')[1]) 
             request.tokenPayload = data
             request.user = await this.userservice.showUserId(data.id)   
            return true
        }catch(e ){
            return false
        }
      
    }
}