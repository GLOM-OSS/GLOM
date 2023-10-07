import { LgTemplateMessages } from './types';

const createdAccountTitle = {
  en: `Hey👋, We're thrilled to have you!!!`,
  fr: `Hey👋, Nous sommes ravis de vous accueillir !!!`,
};
const createdAccountSubtitle = (first_name: string, role_name: string) => ({
  en: `Dear ${first_name}, your <${role_name}> acccount was successfully created.`,
  fr: `Dear ${first_name}, votre compte <${role_name}> a été créé avec success.`,
});
const createdAccountMessage = (password?: string) => ({
  en: `Welcome to XAFPAY. Make your first transfer at the best rate on the market, free of charge. ${
    password ? `Your account password is ${password} the one you entered` : ''
  }.`,
  fr: `Bienvenue sur XAFPAY. Effectuez votre premier transfert au meilleur taux du marché, sans frais. ${
    password ? `Votre nouveau mot de pass est ${password}` : ''
  }.`,
});
const createdAccountCallToAction = {
  en: 'Se Connecter',
  fr: 'Sign in',
};
const createdAccountObject = {
  en: `Welcome to XAFPAY`,
  fr: `Bienvenue chez XAFPAY`,
};

export const createdAccountMessages = {
  title: createdAccountTitle,
  object: createdAccountObject,
  message: createdAccountMessage,
  subtitle: createdAccountSubtitle,
  call_to_action: createdAccountCallToAction,
} satisfies LgTemplateMessages;
