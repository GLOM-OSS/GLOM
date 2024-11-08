import {
  MailerService,
  ISendMailOptions,
} from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import * as Handlebars from 'handlebars';

import { IPlainTemplate, ISendMailPayload } from './glom-mailer.interface';

@Injectable()
export class GlomMailerService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly httpService: HttpService
  ) {}

  async sendEmail({
    to,
    from = 'LYNKR support@lynkr.net',
    subject,
    template,
    template: { template_name, messages },
  }: ISendMailPayload) {
    let mailObject: ISendMailOptions = {
      to,
      from,
      subject,
      html: `<p style="font-size: 1rem; font-family: arial;">${
        (template as IPlainTemplate).messages.message
      }</p>
        <div style="background-color: #232792; padding: 12px; color: #ffff;">
            <a href="https://pay.xafshop.com">Xafpay</a>, Get the best throughput at low cost.
        </div>
      </div>`,
    };
    if (template_name !== 'plain') {
      try {
        const { data: source } = await this.httpService.axiosRef.get(
          `/${template_name}.hbs`
        );
        const template = Handlebars.compile(source);
        mailObject = {
          to,
          from,
          subject,
          html: template(messages),
        };
      } catch (error) {
        Logger.error(
          `Failed to compile template: ${error}`,
          GlomMailerService.name
        );
      }
    }

    const result = await this.mailerService.sendMail(mailObject);
    Logger.log(result, GlomMailerService.name);
    return result;
  }
}
