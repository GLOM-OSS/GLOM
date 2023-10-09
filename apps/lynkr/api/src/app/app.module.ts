import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlomAuthModule } from '@glom/nest-auth';
import { GlomPrismaModule } from '@glom/prisma';
import { GlomMailerModule } from '@glom/nest-mailer';
import { RoleEnum } from './app.decorators';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    GlomAuthModule.forRoot<RoleEnum>({
      useGlobalDeps: true,
      strategies: ['google', 'facebook'],
      roles: [
        {
          role_name: RoleEnum.Client,
          origin: process.env.CLIENT_ORIGIN,
        },
        {
          role_name: RoleEnum.Admin,
          origin: process.env.ADMIN_ORIGIN,
        },
        {
          role_name: RoleEnum.Merchant,
          origin: process.env.MERCHANT_ORIGIN,
        },
        {
          role_name: RoleEnum.Technician,
          origin: process.env.TECHNICIAN_ORIGIN,
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
