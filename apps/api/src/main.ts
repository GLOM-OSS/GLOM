/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as csurf from 'csurf';
import helmet from 'helmet';

import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './errors/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: ['http://localhost:4200'],
      credentials: true,
    },
  });
  app.use(csurf());
  app.use(helmet());
  app.useStaticAssets('./assets');
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
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

  const port = process.env.APP_PORT || 3333;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
