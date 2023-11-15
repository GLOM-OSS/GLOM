import { NotFound } from '@glom/components';
import { useDispatchBreadcrumb } from '@glom/squoolr-v2/side-nav';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';

export default function PageNotFound() {
  const { formatMessage } = useIntl();
  const breadcrumbDispatch = useDispatchBreadcrumb();

  useEffect(
    () =>
      breadcrumbDispatch({
        action: 'RESET',
        payload: [
          { title: formatMessage({ id: 'lost' }) },
          { title: formatMessage({ id: 'pageNotFound' }) },
        ],
      }),
    []
  );

  return <NotFound />;
}
