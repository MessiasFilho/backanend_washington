import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { userController } from "./user.controller";
import { userService } from "./user.service";
import { prismaModule } from "src/prisma/prisma.module";
import { userIdCheckMiddleware } from "src/middlewares/user-id-check-middlewares";

@Module({
    imports: [prismaModule], 
    controllers:[userController], 
    providers: [userService], 
    exports:[userService]
})
export class userModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(userIdCheckMiddleware).forRoutes({
        path: 'users/:id',
        method: RequestMethod.ALL
      })
  }
}