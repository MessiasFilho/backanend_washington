import { Module } from "@nestjs/common";
import { userController } from "./user.controller";

@Module({
    imports: [], 
    controllers:[userController], 
    providers: [], 
    exports:[]
})
export class userModule{}