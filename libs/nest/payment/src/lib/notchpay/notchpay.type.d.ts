export type NotchPayConfigOptions = {
  endpoint: 'api.notchpay.co';
  apiKey: string;
};

export type InitiatePaymentPayload = {
  /**The customer's or business phone */
  phone: string;
  /**Amount to be charged for the payment. According to currency. */
  amount: number;
  /** The email address of the customer is prominently displayed within your dashboard,
   * and serves as a valuable tool for both search and tracking purposes.
   * Please note that this field allows for up to 512 characters. */
  email?: string;
  /** Currency of transaction. */
  currency?: string;
  /**The customer's fullname or business name */
  name?: string;
};

export type CompletePaymentPayload = {
  channel: 'cm.mtn' | 'cm.orange' | 'cm.mobile';
  phone: string;
};

export type NotchPaymentStatus =
  | 'pending'
  | 'failed'
  | 'complete'
  | 'rejected'
  | 'canceled'
  | 'abandoned'
  | 'expired'
  | 'hold'
  | 'incomplete'
  | 'processing'
  | 'refunded';

export type NotchpayTransaction = {
  fee: number;
  amount: number;
  sandbox: boolean;
  amount_total: number;
  converted_amount: number;
  description: string;
  reference: string;
  merchant_reference: string;
  status: NotchPaymentStatus;
  currency: string;
  initiated_at: string;
  updated_at: string;
};

export type NotchpayResponse = {
  code: number;
  status: string;
  message: string;
};

export type InitializePaymentResponse = NotchpayResponse & {
  authorization_url: string;
  transaction: NotchpayTransaction;
};

export type VerifyPaymentResponse = InitializePaymentResponse;

export type CompletePaymentResponse = NotchpayResponse & {
  /** Describes the next action to be done */
  action: 'confirm';
};

export type ListPaymentReponse = NotchpayResponse & {
  /**Only returned for GET all scenarios */
  totals?: number;
  /**Only returned for GET all scenarios */
  last_page?: number;
  /**Only returned for GET all scenarios */
  current_page?: number;
  /**Only returned for GET all scenarios */
  selected?: number;
  items: NotchpayTransaction[];
};

export type CancelPaymentResponse = Omit<NotchpayResponse, 'status'>;
