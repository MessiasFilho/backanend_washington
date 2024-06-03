import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { userModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    forwardRef(() => userModule), 
    forwardRef(() =>AuthModule)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
