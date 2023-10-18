export type InitiatePaymentPayload = {
  /** The email address of the customer is prominently displayed within your dashboard,
   * and serves as a valuable tool for both search and tracking purposes.
   * Please note that this field allows for up to 512 characters. */
  email: string;
  /** Currency of transaction. */
  currency: string;
  /**Amount to be charged for the payment. According to currency. */
  aomunt: number;
  /**The customer's fullname or business name */
  name?: string;
  /**The customer's or business phone */
  phone?: string;
};

export type CompletePaymentPayload = {
  channel: 'cm.mtn' | 'cm.orange' | 'cm.mobile';
  phone: string;
};

export type NotchpayTransaction = {
  fee: number;
  amount: number;
  sandbox: boolean;
  amount_total: number;
  converted_amount: number;
  description: string;
  reference: string;
  merchant_reference: string;
  status: 'pending';
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
  transaction: NotchpayTransaction;
};

export type VerifyPaymentResponse = InitializePaymentResponse;

export type CompletePaymentResponse = NotchpayResponse & {
  /** Only returned  for method `PUT` */
  action?: string;
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
