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
        secret: process.env.JWT_SECRET
    }),
     forwardRef(() => userModule), 
      forwardRef(() =>scheduleModule),
      prismaModule, 
    ], 
    providers:[AuthService], 
    controllers:[AuthController]
})
export class AuthModule{}