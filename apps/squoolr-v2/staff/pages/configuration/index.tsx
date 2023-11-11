import { useDispatchBreadcrumb } from '@glom/squoolr-v2/side-nav';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';

export default function index() {
  const { push } = useRouter();
  const { formatMessage } = useIntl();
  useEffect(() => {
    push('/configuration/departments');
  }, []);

  const breadcrumbDispatch = useDispatchBreadcrumb();

  breadcrumbDispatch({
    action: 'RESET',
    payload: [
      { route: undefined, title: formatMessage({ id: 'configuration' }) },
      {
        route: `configuration/departments`,
        title: formatMessage({ id: `departments` }),
      },
    ],
  });
  return <Box></Box>;
}
