import { injectIntl, IntlShape } from 'react-intl';
export function Index({ intl }: { intl: IntlShape }) {
  return <div>Welcome to Squoolr landing</div>;
}

export default injectIntl(Index);
