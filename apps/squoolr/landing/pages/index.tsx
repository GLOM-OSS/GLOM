import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { injectIntl, IntlShape } from 'react-intl';
export function Index({ intl }: { intl: IntlShape }) {
  const { push } = useRouter();
  useEffect(() => {
    push('/demand');
  }, [push]);
  return <div>Welcome to Squoolr landing</div>;
}

export default injectIntl(Index);
