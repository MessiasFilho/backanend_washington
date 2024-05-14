import { Module } from "@nestjs/common";
import { userController } from "./user.controller";
import { userService } from "./user.service";
import { prismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [prismaModule], 
    controllers:[userController], 
    providers: [userService], 
    exports:[]
})
export class userModule{}