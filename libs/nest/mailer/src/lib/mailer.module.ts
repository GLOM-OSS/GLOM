import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ILoginOptions } from './mailer.interface';
import { MailerService } from './mailer.service';

@Global()
@Module({})
export class MailerModule {
  /**
   * This is a Custom mailer module implementation of the `@nestjs-modules/mailer` package.
   *
   * The `forRoot` method gives you more control over the library.
   */
  static forRoot(mailerOptions: ILoginOptions) {
    const { templatesDir, user, host, pass } = mailerOptions;
    return {
      module: MailerModule,
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
      providers: [MailerService],
      exports: [MailerService],
    };
  }
}
