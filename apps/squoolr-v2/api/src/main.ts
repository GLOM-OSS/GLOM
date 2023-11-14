/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import path = require('path');
import { GlomExceptionsFilter } from '@glom/execeptions';

async function bootstrap() {
  const origin =
    process.env.NODE_ENV === 'production' ? /\.squoolr\.com$/ : /localhost:420/;
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin,
      credentials: true,
    },
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useStaticAssets(path.join(__dirname, './assets'));
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Squoolr APIs')
      .setDescription('Detailed description of Squoolr internal APIs.')
      .setVersion('1.0')
      .addCookieAuth(process.env.SESSION_NAME)
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      customfavIcon: '/squoolr_favicon.png',
      customSiteTitle: 'Squoolr APIs docs',
      customCss: `
        img[alt="Swagger UI"] {  
          content: url('/squoolr_logo.png') 
        }
        .swagger-ui .topbar {
          background: #D9DBE9
        }
        .swagger-ui .opblock {
          border: none
        }
      `,
    });
  }
  const port = process.env.APP_PORT || 3333;
  await app.listen(port);
  const apiUrl = await app.getUrl();
  Logger.log(`🚀 Application is running on: ${apiUrl}/v1`);
}

bootstrap();
