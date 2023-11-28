/* eslint-disable @typescript-eslint/no-explicit-any */
import { decrypt, encrypt } from '@glom/encrypter';
import axios, { AxiosRequestConfig } from 'axios';

export const filterEmptyKeys = <T extends Record<string, any>>(
  object: T
): T => {
  return Object.entries(object).reduce((acc: any, [key, value]) => {
    if (value !== null || value !== undefined) acc[key] = value;
    return acc;
  }, {});
};

const DEFAULT_HOST = 'http://api.lynkr.com';
const DEFAULT_VERSION: RequestParams['version'] = 'v1';

type RequestType = 'get' | 'post' | 'patch' | 'put' | 'delete';

/* TODO: Needs to be removed */
export interface RequestOptions extends AxiosRequestConfig {
  credentials: boolean;
}

export interface RequestParams {
  host: string;
  version: 'v1';
  prefix?: string;
}

export interface RequestFunctionParams<
  Body,
  QueryParams = Record<string | number, any>
> {
  method: RequestType;
  version?: 'v1';
  host?: string;
  body?: Body;
  queryParams?: QueryParams;
  requestConfig?: AxiosRequestConfig;
}

export interface RequestData {
  params?: object;
  body?: object;
}

const glomAxios = axios.create();

export class GlomRequest {
  private DEFAULT_REQUEST_OPTIONS: AxiosRequestConfig = {
    withCredentials: true,
  };

  public params: RequestParams;

  constructor(params?: Partial<RequestParams>) {
    this.params = { host: DEFAULT_HOST, version: DEFAULT_VERSION, ...params };
  }

  request<T>(path: string, params: RequestFunctionParams<T, any>) {
    const host = params?.host || this.params.host;
    const version = params?.version || this.params.version;
    const url = `${host}${this.params.prefix}/${version}${path}`;
    const response = glomAxios.request<T>({
      url,
      withCredentials: true,
      method: params.method,
      ...params.requestConfig,
      // xsrfCookieName: 'csrftoken',
      // xsrfHeaderName: 'X-CSRFTOKEN',
      ...this.DEFAULT_REQUEST_OPTIONS,
      transformResponse: (data) =>
        !data || data.includes('error') ? data : decrypt<T>(data),
      params: params.queryParams
        ? { data: encrypt(params.queryParams) }
        : undefined,
      data: params.body ? { data: encrypt(params.body as object) } : undefined,
    });
    return response;
  }

  /**
   * Get request
   * @param path URL path denoting the resource to request EX. /users
   */
  get<T, Q = unknown>(
    path: string,
    queryParams?: Q,
    requestOptions?: Partial<RequestOptions>
  ) {
    if (queryParams) queryParams = filterEmptyKeys(queryParams) as Q;

    return this.request<T>(path, {
      method: 'get',
      queryParams,
      requestConfig: {
        ...requestOptions,
        withCredentials: requestOptions?.credentials,
      },
    });
  }

  post<T, Q = unknown>(
    path: string,
    body?: any,
    params?: Q,
    requestConfig?: AxiosRequestConfig
  ) {
    return this.request<T>(path, {
      method: 'post',
      body,
      queryParams: params,
      requestConfig,
    });
  }

  patch<T>(path: string, body: any, params?: object) {
    return this.request<T>(path, {
      method: 'patch',
      queryParams: params,
      body,
    });
  }

  put<T>(path: string, body: any, params?: object) {
    return this.request<T>(path, { method: 'put', queryParams: params, body });
  }

  delete<ResponseBody, RequestQuery = any>(
    path: string,
    params?: Omit<RequestFunctionParams<ResponseBody, RequestQuery>, 'method'>
  ) {
    return this.request<ResponseBody>(path, {
      method: 'delete',
      body: params?.body,
      queryParams: params?.queryParams,
      requestConfig: { ...params?.requestConfig },
    });
  }
}
