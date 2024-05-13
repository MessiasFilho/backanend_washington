import { Body, Injectable } from "@nestjs/common";
import { createUserDto } from "./dto/createUserDto";


@Injectable()
export class userService {
    async validatePassword( @Body() {password,confpassword}: createUserDto ){
        
        if (password != confpassword ){
        return {Massege: 'password diferent'}
      }
    }
}