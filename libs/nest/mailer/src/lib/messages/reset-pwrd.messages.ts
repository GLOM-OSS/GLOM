import { LgTemplateMessages } from './types';

const resetPasswordTitle = {
  en: 'Reset your password',
  fr: 'Changez votre mot de passe',
};
const resetPasswordSubTitle = (first_name: string) => ({
  en: `Hello ${first_name}, You have requested to change your password. `,
  fr: `Hello ${first_name}, Vous avez demandé a change de mot de passe.`,
});
const resetPasswordMessage = {
  en: `Please cancel this request if you are not the author of this action. \nWe will never ask you for your password and we strongly advise you not to share it with share it with anyone.`,
  fr: `Veillez annuler cette demande ci vous n'etes pas l'auteur de cette action. \nNous ne vous demanderons jamais votre mot de passe et nous vous déconseillons fortement de le partager avec qui que ce soit.`,
};
const resetPasswordCallToAction = {
  en: 'Reset',
  fr: 'Changez',
};
const resetPasswordObject = {
  en: 'Reset password',
  fr: 'Réinitialisation du mot de passe',
};

export const resetPasswordMessages = {
  title: resetPasswordTitle,
  object: resetPasswordObject,
  message: resetPasswordMessage,
  subtitle: resetPasswordSubTitle,
  call_to_action: resetPasswordCallToAction,
} satisfies LgTemplateMessages;
