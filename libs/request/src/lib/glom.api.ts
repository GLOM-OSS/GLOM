import { DemandsApi, InquiriesApi } from '../squoolr';
import { GlomRequest, RequestParams } from './glom-request';

export const GLOM_HOSTS = {
  lynkr: 'https://api.lynkr.net',
  squoolr: 'https://api.squoolr.com',
};
export const getURI = (app: keyof typeof GLOM_HOSTS) => {
  const DEV_PORT = 8000;

  const host =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:${DEV_PORT}`
      : GLOM_HOSTS[app];

  return { host };
};

export class GlomApi {
  public squoolr: {
    demands: DemandsApi;
    inquiries: InquiriesApi;
  };

  constructor(public params?: Partial<RequestParams>) {
    const { host } = getURI('squoolr');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const squoolrRequest = new GlomRequest({
      ...params,
      host,
    });

    this.squoolr = {
      demands: new DemandsApi(squoolrRequest),
      inquiries: new InquiriesApi(squoolrRequest),
    };
  }
}
