import { Module, forwardRef } from "@nestjs/common";
import { noticeService } from "./notice.service";
import { noticeController } from "./notice.controller";
import { AuthModule } from "src/auth/auth.module";
import { userModule } from "src/user/user.module";
import { prismaModule } from "src/prisma/prisma.module";

@Module({
    controllers:[noticeController], 
    exports:[noticeService], 
    imports:[prismaModule, 
        forwardRef(() => AuthModule), 
        forwardRef(() => userModule)], 
    providers:[noticeService]
})
export class noticeModule {}