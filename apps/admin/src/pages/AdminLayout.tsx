import { DashboardRounded, SettingsRounded } from '@mui/icons-material';
import { Layout, NavItem } from '@squoolr/layout';
import { injectIntl, IntlShape } from 'react-intl';

function AdminLayout({ intl, intl: { formatMessage } }: { intl: IntlShape }) {
  const navItems: NavItem[] = [
    {
      id: 1,
      Icon: SettingsRounded,
      title: formatMessage({ id: 'management' }),
      children: [
        {
          title: formatMessage({ id: 'demands' }),
          route: '/management/demands',
        },
      ],
    },
    {
      id: 2,
      Icon: DashboardRounded,
      title: formatMessage({ id: 'dashboard' }),
      children: [],
    },
  ];
  return <Layout intl={intl} navItems={navItems} />;
}
export default injectIntl(AdminLayout);
