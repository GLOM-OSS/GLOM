import { LayersOutlined, SettingsSuggestOutlined } from '@mui/icons-material';
import { MainLayout, NavItem } from '@squoolr/layout';
import { injectIntl, IntlShape } from 'react-intl';

function AdminLayout({ intl: { formatMessage } }: { intl: IntlShape }) {
  const navItems: NavItem[] = [
    {
      id: 1,
      Icon: LayersOutlined,
      title: formatMessage({ id: 'management' }),
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
      title: formatMessage({ id: 'settings' }),
      children: [],
    },
  ];

  return (
    <MainLayout
      callingApp="personnel"
      navItems={[
        { role: 'registry', navItems: navItems },
        { role: 'secretary', navItems: [] },
      ]}
    />
  );
}
export default injectIntl(AdminLayout);
