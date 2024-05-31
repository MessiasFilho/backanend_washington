import { BadRequestException, NestMiddleware } from "@nestjs/common";
import { Response, Request, NextFunction } from "express";

export class userIdCheckMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {
        
        console.log('User idCreked Antes');
        
        if(isNaN(Number(req.params.id)) || Number(req.params.id) <= 0 ){
            throw new BadRequestException('ID invalido')
        }

        console.log('User idCreked Depois');

        next()
    }
    
}