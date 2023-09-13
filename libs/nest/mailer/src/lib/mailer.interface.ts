import { ReceiptTemplateMessages, TemplateMessages } from './messages/types';

interface IMailerOptions {
  user: string;
  authType: 'Login' | 'OAuth2';
  /**
   * location of your .hbs templates' parent directory. Please move your templates to your server static assets then provide a valid accessible link to it
   * and make sure static assets are well cofigured on your server
   * @example https://myexample.com/templates
   */
  templatesDir?: string;
}
export interface ILoginOptions extends IMailerOptions {
  authType: 'Login';
  host: string;
  pass: string;
}

export interface IOAuth2Options extends IMailerOptions {
  authType: 'OAuth2';
  service: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export interface IPlainTemplate {
  /**
   * template file name with `hbs` extension. extension shouldn't be precised
   */
  template_name: 'plain';
  messages: { message: string };
}

export interface IDefaultTemplate {
  /**
   * template file name with `hbs` extension. extension shouldn't be precised
   */
  template_name: 'default';
  messages: TemplateMessages;
}

export interface IReceiptTemplate {
  /**
   * template file name with `hbs` extension. extension shouldn't be precised
   */
  template_name: 'receipt-fr' | 'receipt-en';
  messages: ReceiptTemplateMessages;
}

export interface ISendMailPayload {
  from?: string;
  subject: string;
  to: string | string[];
  template: IPlainTemplate | IDefaultTemplate | IReceiptTemplate;
}
