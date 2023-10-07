export type TemplateMessages = {
  /**
   * call to action link
   */
  action: string;
  /**
   *  link label text
   */
  call_to_action: string;

  object?: string;
  title: string;
  subtitle: string;
  message: string;
};

export type ReceiptTemplateMessages = {
  receiver_phone_number: string;
  receiver_nid_number: string;
  receiver_fullname: string;
  transaction_date: string;
  transaction_id: string;
  card_details: string;
  card_exp: string;
  amount: string;
};

export type Lg = { fr: string; en: string };

export type LgTemplateMessages = Record<
  keyof Omit<TemplateMessages, 'action'>,
  Lg | ((...agrs: string[]) => Lg)
>;
