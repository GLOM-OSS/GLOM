import { useDispatchBreadcrumb } from '@glom/squoolr-v2/side-nav';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';

export function Index() {
  const { push } = useRouter();
  const { formatMessage } = useIntl();

  const breadcrumbDispatch = useDispatchBreadcrumb();
  useEffect(() => {
    breadcrumbDispatch({
      action: 'RESET',
      payload: [
        { route: undefined, title: formatMessage({ id: 'management' }) },
        {
          route: `management/schools`,
          title: formatMessage({ id: `schools` }),
        },
      ],
    });
    push('/management/schools');
  }, []);

  return <Box></Box>;
}

export default Index;
