import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import type {
  CancelPaymentResponse,
  CompletePaymentPayload,
  CompletePaymentResponse,
  InitializePaymentResponse,
  InitiatePaymentPayload,
  NotchPayConfigOptions,
  VerifyPaymentResponse,
} from './notchpay.type';

@Injectable()
export class NotchPayService {
  private axiosInstance: AxiosInstance;

  constructor({ apiKey, endpoint }: NotchPayConfigOptions) {
    this.axiosInstance = axios.create({
      baseURL: endpoint,
      headers: { Authorization: apiKey },
    });
  }

  async initiatePayment({
    currency = 'XAF',
    ...payload
  }: InitiatePaymentPayload) {
    const { data } = await this.axiosInstance.post<InitializePaymentResponse>(
      '/payments/initialize',
      { currency, ...payload }
    );
    return data.transaction;
  }

  async verifyPayment(reference: string) {
    const { data } = await this.axiosInstance.get<VerifyPaymentResponse>(
      `/payments/${reference}`
    );
    return data.transaction;
  }

  async completePayment(reference: string, payload: CompletePaymentPayload) {
    const { data } = await this.axiosInstance.put<CompletePaymentResponse>(
      `/payments/${reference}`,
      payload
    );
    return data;
  }

  async cancelPayment(reference: string) {
    await this.axiosInstance.delete<CancelPaymentResponse>(
      `/payments/${reference}`
    );
  }
}
