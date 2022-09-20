import { HelperOptions } from 'handlebars';
import { messages } from './';

export const formatMessage = (
  messageId: string,
  lang: 'En' | 'Fr',
  options: HelperOptions
) => {
  return options.fn(messages[messageId][lang]);
};
