import { LayersOutlined } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { INavItem } from '@squoolr/interfaces';
import { MainLayout } from '@squoolr/layout';
import { injectIntl, IntlShape } from 'react-intl';

function AppLayout({ intl: { formatMessage } }: { intl: IntlShape }) {
  const navItems: INavItem[] = [
    {
      id: 1,
      Icon: LayersOutlined,
      title: 'myAccount',
      route: '',
      children: [
        {
          title: formatMessage({ id: 'home' }),
          route: 'home',
          page_title: 'studentHome',
        },
        {
          title: formatMessage({ id: 'myCourses' }),
          route: 'my-courses',
          page_title: 'myCourses',
        },
      ],
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MainLayout
        callingApp="student"
        navItems={[{ role: 'student', navItems: navItems }]}
      />
    </LocalizationProvider>
  );
}
export default injectIntl(AppLayout);
