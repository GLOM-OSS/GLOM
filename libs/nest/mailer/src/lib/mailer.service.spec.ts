import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { MailerModule } from './mailer.module';
import { MailerService } from './mailer.service';

describe('MailerService', () => {
  let service: MailerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MailerService],
      imports: [
        HttpModule,
        ConfigModule.forRoot(),
        MailerModule.forRoot({
          authType: 'Login',
          user: String(process.env['APP_EMAIL']),
          host: String(process.env['EMAIL_HOST']),
          pass: String(process.env['EMAIL_PASS']),
          templatesDir: `${process.env['NX_API_BASE_URL']}/templates`,
        }),
      ],
    }).compile();

    service = module.get(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send email', async () => {
    const result = await service.sendEmail({
      to: 'kuidjamarco@gmail.com',
      subject: 'Welcome email',
      template: {
        messages: {
          title: 'Test title',
          object: 'Welcome email',
          call_to_action: 'Visit',
          subtitle: 'Test subtittle',
          message: 'Testing email service',
          action: 'https://pay.xafshop.com',
        },
        template_name: 'default',
      },
    });
    console.log(result);
  }, 60000);
});
