/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

import path = require('path');
import * as shell from 'shelljs';

const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  shell.exec(
    `npx prisma migrate deploy`
    // `npx prisma migrate reset --force && npx prisma migrate dev --name deploy && npx prisma migrate deploy`
  );
}

async function bootstrap() {
  const allowedOrigins = isProduction ? /squoolr\.com$/ : /localhost:420[0-2]$/;
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useStaticAssets(path.join(__dirname, 'assets'), {
    setHeaders(res) {
      const requestedOrigin = res.get('host') || '';
      if (allowedOrigins.test(requestedOrigin)) {
        res.set('Access-Control-Allow-Origin', requestedOrigin);
      }
    },
  });
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
