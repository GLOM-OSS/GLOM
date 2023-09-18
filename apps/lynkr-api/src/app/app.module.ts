import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlomAuthModule } from '@glom/nest-auth';
import { GlomPrismaModule } from '@glom/prisma';
import { GlomMailerModule } from '@glom/nest-mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.lynkr',
    }),
    GlomPrismaModule.forRoot({
      isGlobal: true,
    }),
    GlomMailerModule.forRoot({
      authType: 'Login',
      user: process.env.APP_EMAIL,
      host: process.env.EMAIL_HOST,
      pass: process.env.EMAIL_PASS,
      templatesDir: `${process.env.NX_API_BASE_URL}/templates`,
    }),
    GlomAuthModule.forRoot({
      useGlobalDeps: true,
      strategies: ['google', 'facebook'],
      roles: [
        { origin: process.env.CLIENT_ORIGIN, role_name: 'Client' },
        {
          origin: process.env.ADMIN_ORIGIN,
          role_name: 'Admin',
        },
        {
          origin: process.env.MERCHANT_ORIGIN,
          role_name: 'Merchant',
        },
        {
          origin: process.env.TECHNICIAN_ORIGIN,
          role_name: 'Technician',
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
