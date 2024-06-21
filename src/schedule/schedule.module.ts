import { Module, forwardRef } from "@nestjs/common";
import { scheduleController } from "./schedule.controller";
import { scheduleSevice } from "./schedule.service";
import { prismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";
import { userModule } from "src/user/user.module";

@Module({
    imports:[prismaModule, 
        forwardRef(() => AuthModule), 
        forwardRef(() => userModule)
    ], 
    exports:[scheduleSevice], 
    providers:[scheduleSevice],
    controllers:[scheduleController]
})

export class scheduleModule{}