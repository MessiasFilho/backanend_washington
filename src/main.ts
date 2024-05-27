import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.useGlobalPipes(new ValidationPipe)
  // app.useGlobalInterceptors( new logInterceptor())
  await app.listen(3001, '192.168.1.10');
}
bootstrap();
