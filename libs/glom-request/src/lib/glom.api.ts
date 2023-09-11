import { GlomRequest, RequestParams } from './glom-request';

export const GLOM_HOSTS = {
  lynkr: 'https://api.lynkr.net',
};
export const getURI = (app: keyof typeof GLOM_HOSTS) => {
  const DEV_PORT = 5000;

  const host =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:${DEV_PORT}`
      : GLOM_HOSTS[app];

  return { host };
};

export class GlomApi {
  constructor(public params?: Partial<RequestParams>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const lynkrRequest = new GlomRequest({
      ...params,
      prefix: '/',
    });
  }
}
