import { ITransaction, Lang } from '@xafpay/interfaces';
import { LgTemplateMessages } from './types';
import { toBlod, toItalic } from './utils';

const transferMailTitle = {
  en: 'New Pending transaction',
  fr: 'Nouvelle transaction en attente',
};
const transferMailSubTitle = (
  receiver: string,
  amount: string,
  display_txn_id: string
) => ({
  en: `You have a pending transfer of ${amount} XAF for ${receiver}. Transaction ID: ${display_txn_id}`,
  fr: `Vous avez un transfert de ${amount} XAF en attente pour ${receiver}. ID de la transaction : ${display_txn_id}`,
});
const transferMailMessage = {
  en: `This email is to notify you the accountant of a new pending transfer. Login to the accountant platform for more details.`,
  fr: `Cet e-mail a pour but de vous informer, en tant que comptable, d'un nouveau transfert en attente. Connectez-vous à la plateforme du comptable pour plus de détails.`,
};
const transferMailCallToAction = {
  en: 'Open app',
  fr: "Ouvrir l'appli",
};

export const transferMailMessages = {
  title: transferMailTitle,
  object: transferMailTitle,
  message: transferMailMessage,
  subtitle: transferMailSubTitle,
  call_to_action: transferMailCallToAction,
} satisfies LgTemplateMessages;

export const getTransferNotif = (
  {
    amount_received,
    receiver_fullname,
    receiver_phone_number,
    sender_last4_number: last4,
    sending_network: network,
    expiry_date,
    display_txn_id,
  }: Pick<
    ITransaction,
    | 'amount_received'
    | 'receiver_fullname'
    | 'receiver_phone_number'
    | 'sender_last4_number'
    | 'sending_network'
    | 'display_txn_id'
  > & { expiry_date: Date },
  lang: Lang
) => {
  const messages: Record<Lang, string> = {
    en: `You have successfully initiated the transfer of ${toBlod(
      `${amount_received}`
    )} XAF to ${toBlod(
      `${receiver_fullname} (${receiver_phone_number})`
    )} with the card number ${toBlod(
      `**** **** ****${last4}`
    )} on ${network} network expiring on the ${toBlod(
      `${expiry_date.getMonth()}/${expiry_date.getFullYear()}`
    )}. 
  <br>Here's your ${toBlod(
    `Transaction ID: ${display_txn_id}`
  )}. If any issue with this transfer, please kindly reference the given ID in the report message.
  <br><br>${toItalic(
    'To completed in a maximum of 24hours (typically done within next few minutes).'
  )}`,
    fr: `Vous avez initié avec succès le transfert de ${toBlod(
      `${amount_received}`
    )} XAF à ${toBlod(
      `${receiver_fullname} (${receiver_phone_number})`
    )} avec le numéro de carte ${toBlod(
      `**** **** ****${last4}`
    )} sur le réseau ${network} et expirant le ${toBlod(
      `${expiry_date.getMonth()}/${expiry_date.getFullYear()}`
    )}. 
<br>Voici votre ${toBlod(
      `ID de transaction: ${display_txn_id}`
    )}. En cas de problème avec ce transfert, veuillez indiquer l'identifiant donné dans le message de rapport.
<br><br>${toItalic(
      'A effectuer dans un délai maximum de 24 heures (généralement dans les minutes qui suivent).'
    )}`,
  };
  return messages[lang];
};
