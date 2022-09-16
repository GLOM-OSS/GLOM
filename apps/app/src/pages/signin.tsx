import { Signin } from '@squoolr/auth';
import { injectIntl, IntlShape } from 'react-intl';

function SigninPage({ intl }: { intl: IntlShape }) {
  return <Signin callingApp="personnel" />;
}

export default injectIntl(SigninPage);
