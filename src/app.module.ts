import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { userModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { scheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    userModule, 
    AuthModule, 
    scheduleModule,],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
