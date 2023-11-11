import { useDispatchBreadcrumb } from '@glom/squoolr-v2/side-nav';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';

export function Index() {
  const { push } = useRouter();
  const { formatMessage } = useIntl();
  useEffect(() => {
    push('/management/demands');
  }, []);

  const breadcrumbDispatch = useDispatchBreadcrumb();

  breadcrumbDispatch({
    action: 'RESET',
    payload: [
      { route: undefined, title: formatMessage({ id: 'management' }) },
      {
        route: `management/demands`,
        title: formatMessage({ id: `demands` }),
      },
    ],
  });

  return <Box></Box>;
}

export default Index;
