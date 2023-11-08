import { SchemaCreateResponseBody, SchemaRequestBody } from '../../api-helper';
import { operations } from '../docs';

/** ------------- CREATEE NEW INQUIRY ------------- */
export type CreateInquiryPayload = SchemaRequestBody<
  operations,
  'InquiriesController_createInquiry'
>;

/** ------------- GET ALL INQUIRIES ------------- */
export type InquiryEntity = SchemaCreateResponseBody<
  operations,
  'InquiriesController_createInquiry'
>;
