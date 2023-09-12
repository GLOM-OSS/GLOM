import { HelperOptions } from 'handlebars';
import { messages } from './';

export const formatMessage = (
  messageId: string,
  lang: 'en' | 'fr',
  options: HelperOptions
) => {
  return options.fn(messages[messageId][lang]);
};
