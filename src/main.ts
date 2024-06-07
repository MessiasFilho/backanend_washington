import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.enableCors({
      "origin": "*",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      "optionsSuccessStatus": 204, 
      
  })
  app.useGlobalPipes(new ValidationPipe)
  // app.useGlobalInterceptors( new logInterceptor())
  await app.listen(3001);
}
bootstrap();
