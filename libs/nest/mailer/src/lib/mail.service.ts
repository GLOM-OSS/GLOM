import { MailerService as Mailer } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: Mailer) {}

  async sendResetPasswordMail(email: string, reset_link: string) {
    await this.mailerService.sendMail({
      to: email,
      from: 'glomexam@gmail.com',
      subject: 'PASSWORD RESET',
      text: `Hello 👋, your reset password link is ${reset_link}`,
      html: `<b>Hello 👋, your reset password link is ${reset_link}</b>`,
    });
  }
}
