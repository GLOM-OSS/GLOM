/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { GlomExceptionsFilter } from '@glom/execeptions';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const origin =
    process.env.NODE_ENV === 'production'
      ? ['https://lynkr.net', /\.lynkr\.net$/]
      : [
          'http://localhost:3000', //landing
          'http://localhost:4200', //client
          'http://localhost:4201', //technician
          'http://localhost:4202', //admin
        ];
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin,
      credentials: true,
    },
  });
  app.useGlobalFilters(new GlomExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    })
  );
  const config = new DocumentBuilder()
    .setTitle('Lynkr APIs')
    .setDescription("Detailed description of Lynkr's APIs.")
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.APP_PORT || 3333;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
