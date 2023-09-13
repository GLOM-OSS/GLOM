import { LgTemplateMessages } from './types';

const requiresUpdateTitle = {
  en: 'Hello, dear customer',
  fr: 'Bonjour, cher client',
};
const requiresUpdateSubtitle = (display_txn_id: string) => ({
  en: `This is to inform you that the receiver information you provided for the transaction with ID (${display_txn_id}) requires an update.`,
  fr: `Nous vous informons que les informations sur le destinataire que vous avez fournies pour la transaction avec l'ID (${display_txn_id}) nécessitent une modification.`,
});
const requiresUpdateMessage = {
  en: `Some incoherences were discovered when validating your receiver identity`,
  fr: `Certaines incohérences ont été découvertes lors de la validation de l'identité du destinataire.`,
};
const requiresUpdateCallToAction = {
  en: 'Update',
  fr: 'Mettre à jour',
};
const requiresUpdateObject = {
  en: `XAFPAY transfers validation`,
  fr: `Validation des transferts XAFPAY`,
};

export const requiresUpdateMessages = {
  title: requiresUpdateTitle,
  object: requiresUpdateObject,
  message: requiresUpdateMessage,
  subtitle: requiresUpdateSubtitle,
  call_to_action: requiresUpdateCallToAction,
} satisfies LgTemplateMessages;
