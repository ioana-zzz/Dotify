
import * as express from 'express';
  import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersModule } from './users/users.module';
import{ValidationPipe} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(express.json({ limit: '20mb' })); 
  app.use(express.urlencoded({ limit: '20mb', extended: true }));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();