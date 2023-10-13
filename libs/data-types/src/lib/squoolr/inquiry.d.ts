import {
  SchemaCreateResponseBody,
  SchemaRequestBody,
  SchemaRequestParams,
  SchemaResponseBody,
} from '../api-helper';
import { operations } from './docs';

/** ------------- GET ALL INQUIRIES ------------- */
export type GetAllEnquiriesResponse = SchemaResponseBody<
operations,
'InquiriesController_getAllInquiries'
>;

/** ------------- CREATEE NEW INQUIRY ------------- */
export type CreateInquiryPayload = SchemaRequestBody<
  operations,
  'InquiriesController_createInquiry'
>;
