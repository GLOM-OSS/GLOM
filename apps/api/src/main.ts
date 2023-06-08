/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './errors/http-exception.filter';

async function bootstrap() {
  const origin =
    process.env.NODE_ENV === 'production'
      ? ['https://squoolr.com', /\.squoolr\.com$/]
      : [
          'http://localhost:3000', //landing
          'http://localhost:4200', //student
          'http://localhost:4201', //personnel
          'http://localhost:4202', //admin
        ];
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin,
      credentials: true,
    },
  });
  app.useStaticAssets('uploads', {
    setHeaders(res) {
      //TODO change cors restriction from * to <origin>
      res.set('Access-Control-Allow-Origin', '*');
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('Squoolr APIs')
    .setDescription('Detailed description of the services used on Squoolr.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.APP_PORT || 8080;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
