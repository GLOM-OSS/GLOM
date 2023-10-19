import { Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import type {
  CancelPaymentResponse,
  CompletePaymentPayload,
  CompletePaymentResponse,
  InitializePaymentResponse,
  InitiatePaymentPayload,
  VerifyPaymentResponse,
} from './notchpay.type';

@Injectable()
export class NotchPayService {
  constructor(private axiosInstance: AxiosInstance) {}

  async initiatePayment(payload: InitiatePaymentPayload) {
    const { data } = await this.axiosInstance.post<InitializePaymentResponse>(
      '/payments/initialize',
      payload
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
