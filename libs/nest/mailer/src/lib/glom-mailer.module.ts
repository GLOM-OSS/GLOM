import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ILoginOptions } from './glom-mailer.interface';
import { GlomMailerService } from './glom-mailer.service';

@Global()
@Module({})
export class GlomMailerModule {
  /**
   * This is a Custom mailer module implementation of the `@nestjs-modules/mailer` package.
   *
   * The `forRoot` method gives you more control over the library.
   */
  static forRoot(mailerOptions: ILoginOptions) {
    const { templatesDir, user, host, pass } = mailerOptions;
    return {
      module: GlomMailerModule,
      imports: [
        HttpModule.register({ baseURL: templatesDir }),
        NestMailerModule.forRoot({
          transport: {
            host,
            port: 465,
            secure: true,
            auth: { user, pass },
          },
        }),
      ],
      providers: [GlomMailerService],
      exports: [GlomMailerService],
    };
  }
}
