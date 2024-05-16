import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";


export class logInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const da = Date.now()

        return next.handle().pipe(tap( () =>{
            const  request = context.switchToHttp().getRequest()
            console.log('levol = ', Date.now() - da);
            console.log(`URL ${request.url}`);
            
        }))
    }

}