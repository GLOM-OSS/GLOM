import { NewPassword } from '@squoolr/auth';
import { injectIntl, IntlShape } from 'react-intl';

function NewPasswordPage({ intl }: { intl: IntlShape }) {
  return <NewPassword />;
}
export default injectIntl(NewPasswordPage);
