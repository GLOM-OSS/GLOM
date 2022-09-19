import { LayersOutlined, SettingsSuggestOutlined } from '@mui/icons-material';
import { MainLayout, NavItem } from '@squoolr/layout';
import { injectIntl, IntlShape } from 'react-intl';

function AdminLayout({ intl: { formatMessage } }: { intl: IntlShape }) {
  const navItems: NavItem[] = [
    {
      id: 1,
      Icon: LayersOutlined,
      title: 'management',
      children: [
        {
          title: formatMessage({ id: 'demands' }),
          route: 'demands',
          page_title: 'demands',
        },
        {
          title: formatMessage({ id: 'schools' }),
          route: 'schools',
          page_title: 'schools',
        },
        {
          title: formatMessage({ id: 'configurators' }),
          route: 'configurators',
          page_title: 'configurators',
        },
      ],
    },
    {
      id: 2,
      Icon: SettingsSuggestOutlined,
      title: 'settings',
      children: [],
    },
  ];

  return (
    <MainLayout
      callingApp="admin"
      navItems={[{ role: 'administrator', navItems: navItems }]}
    />
  );
}
export default injectIntl(AdminLayout);
