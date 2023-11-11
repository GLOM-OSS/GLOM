import { CreateInquiryPayload, InquiryEntity } from '@glom/data-types';
import { GlomRequest } from '../lib/glom-request';

export class InquiriesApi {
  constructor(private readonly request: GlomRequest) {}

  async getInquiries() {
    const resp = await this.request.get<InquiryEntity[]>('/inquiries');
    return resp.data;
  }

  async createInquiry(payload: CreateInquiryPayload) {
    const resp = await this.request.post<InquiryEntity>(
      '/inquiries/new',
      payload
    );
    return resp.data;
  }
}
