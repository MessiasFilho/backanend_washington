import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/decorators/role.decorator";
import { role } from "src/enums/role.enum";


@Injectable()
export class RoleGuard implements CanActivate{
   
    constructor(
        private readonly reflector: Reflector
    ) {}
    canActivate(context: ExecutionContext) {
        const requerdRules =  this.reflector.getAllAndOverride<role[]>('role', [context.getHandler(), context.getClass()] )
        
        if (!requerdRules){
            return true 
        }
        
        const {user} = context.switchToHttp().getRequest()
        
        const roulesfilted = requerdRules.filter(role => role == user.role )
        
        if(roulesfilted[0] === 'users') return true 
        if(roulesfilted[0] === 'admin') return true
        
         return false

        
       
    }
    

}