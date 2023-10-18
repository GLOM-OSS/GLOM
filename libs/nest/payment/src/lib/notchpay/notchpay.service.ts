import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import {
    CancelPaymentResponse,
    CompletePaymentPayload,
    CompletePaymentResponse,
    InitializePaymentResponse,
    InitiatePaymentPayload,
    VerifyPaymentResponse,
} from './notchpay';

@Injectable()
export class NotchPayService {
  constructor(private httpService: HttpService) {}

  async initiatePayment(payload: InitiatePaymentPayload) {
    const { data } =
      await this.httpService.axiosRef.post<InitializePaymentResponse>(
        '/payments/initialize',
        payload
      );
    return data.transaction;
  }

  async verifyPayment(reference: string) {
    const { data } = await this.httpService.axiosRef.get<VerifyPaymentResponse>(
      `/payments/${reference}`
    );
    return data.transaction;
  }

  async completePayment(reference: string, payload: CompletePaymentPayload) {
    const { data } =
      await this.httpService.axiosRef.put<CompletePaymentResponse>(
        `/payments/${reference}`,
        payload
      );
    return data;
  }

  async cancelPayment(reference: string) {
    await this.httpService.axiosRef.delete<CancelPaymentResponse>(
      `/payments/${reference}`
    );
  }
}
