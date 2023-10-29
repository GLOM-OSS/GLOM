import { CreateInquiryPayload, InquiryEntity } from '@glom/data-types';
import { GlomRequest } from '../lib/glom-request';

export class InquiriesApi {
  constructor(private readonly request: GlomRequest) {}

  getInquiries() {
    return this.request.get<InquiryEntity[]>('/inquiries');
  }

  createInquiry(payload: CreateInquiryPayload) {
    return this.request.post<InquiryEntity>('/inquiries/new', payload);
  }
}
