import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { userModule } from "src/user/user.module";
import { prismaModule } from "src/prisma/prisma.module";
import { AuthService } from "./AuthService";
import { scheduleModule } from "src/schedule/schedule.module";

@Module({
    exports:[AuthService],
    imports:[JwtModule.register({
        secret:'I;fb>oATk}l_KJG91.7Y$9T*IC1&Yb2#'
    }),
     forwardRef(() => userModule), 
      forwardRef(() =>scheduleModule),
      prismaModule, 
    ], 
    providers:[AuthService], 
    controllers:[AuthController]
})
export class AuthModule{}