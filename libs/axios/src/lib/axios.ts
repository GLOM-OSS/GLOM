import { decrypt, encrypt } from '@squoolr/encrypter';
import axios, { AxiosInstance } from 'axios';

export async function getCurrentIp() {
  const { data: ip_address } = await axios.get('https://api.ipify.org');
  return ip_address as string;
}

function axiosInstance(): AxiosInstance {
  const app_lang = 'squoolr_active_language';

  const axiosInstance = axios.create({
    baseURL: process.env['NX_API_BASE_URL'],
    headers: {
      'Content-type': 'application/json',
    },
    withCredentials: true,
  });
  axiosInstance.interceptors.request.use(
    (request) => {
      request = {
        ...request,
        headers: {
          ...request.headers,
          lang: 'Fr',
        },
        params: request.params ? { data: encrypt(request.params) } : undefined,
        data: request.data ? { data: encrypt(request.data) } : undefined,
      };
      return request;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      response = {
        ...response,
        data: response.data ? decrypt(response.data) : {},
      };
      return response;
    },
    (error) => {
      if (error.response?.statusCode === 403 && location.pathname !== '/signin')
        location.href = '/signin';
      return Promise.reject(
        error.response?.data || 'Sorry, this error is not supposed to happen'
      );
    }
  );

  return axiosInstance;
}

export const http = axiosInstance();
