import { Module, forwardRef } from "@nestjs/common";
import { uploadService } from "./upload.service";
import { uploadController } from "./upload.controller";
import { prismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";
import { userModule } from "src/user/user.module";

@Module({
    imports:[prismaModule, 
        forwardRef(() => AuthModule), 
        forwardRef(() => userModule)
    ], 
    controllers:[uploadController],
    providers:[uploadService],
    exports:[uploadService]
})
export class uploadModule{}