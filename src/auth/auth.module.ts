import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { userModule } from "src/user/user.module";
import { prismaModule } from "src/prisma/prisma.module";
import { AuthService } from "./auth.service";
import { userService } from "src/user/user.service";

@Module({
    exports:[],
    imports:[JwtModule.register({
        secret:'I;fb>oATk}l_KJG91.7Y$9T*IC1&Yb2#'
    }),
    userModule, 
    prismaModule
    ], 
    providers:[AuthService], 
    controllers:[AuthController]
})
export class AuthModule{}