import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { userModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { scheduleModule } from './schedule/schedule.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { uploadModule } from './upload/upload.module';
import { supabseModule } from './upload/supabase.module';
import { noticeModule } from './notices/notice.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    userModule, 
    AuthModule, 
    scheduleModule,
    uploadModule,
    supabseModule,
    noticeModule,
  ],

  controllers: [AppController],
  providers: [AppService , {
    provide: APP_GUARD, 
    useClass: ThrottlerGuard
  }]
})
export class AppModule {}
