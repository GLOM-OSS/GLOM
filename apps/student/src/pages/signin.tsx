import { Signin } from '@squoolr/auth';
import { injectIntl, IntlShape } from 'react-intl';

function SigninPage({ intl }: { intl: IntlShape }) {
  return <Signin callingApp="student"/>;
}

export default injectIntl(SigninPage);
