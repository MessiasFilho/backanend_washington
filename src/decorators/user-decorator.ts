import { ExecutionContext, NotFoundException, createParamDecorator } from "@nestjs/common"


export const userDecorator = createParamDecorator(( filter : string, context: ExecutionContext ) => {
    const request = context.switchToHttp().getRequest(); 
    if (request.user){

        if (filter){
            return request.user[filter]
        }else{
            return request.user    
        }

    }else {
        throw new NotFoundException('Usuario Não foi encontrado no request ')
    }
})

