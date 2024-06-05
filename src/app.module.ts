import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { userModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { scheduleModule } from './schedule/schedule.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    userModule, 
    AuthModule, 
    scheduleModule,],

  controllers: [AppController],
  providers: [AppService , {
    provide: APP_GUARD, 
    useClass: ThrottlerGuard
  }]
})
export class AppModule {}
