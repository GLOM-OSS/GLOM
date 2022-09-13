import { ForgotPassword } from '@squoolr/auth';
import { injectIntl, IntlShape } from 'react-intl';

function ForgotPasswordPage({ intl }: { intl: IntlShape }) {
  return <ForgotPassword intl={intl} />;
}
export default injectIntl(ForgotPasswordPage);
