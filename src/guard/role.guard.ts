import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/decorators/role.decorator";
import { Role } from "src/enums/role.enum";


@Injectable()
export class RoleGuard implements CanActivate{
   
    constructor(
        private readonly reflector: Reflector
    ) {}
    canActivate(context: ExecutionContext) {
        const requerdRules =  this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()] )
        
        if (!requerdRules){
            return true 
        }
        
        const {users} = context.switchToHttp().getRequest()
        
        
        
        console.log({requerdRules, users});

        return true
    }
    

}