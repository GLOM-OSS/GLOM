import { LayersOutlined, SettingsSuggestOutlined } from '@mui/icons-material';
import { INavItem } from '@squoolr/interfaces';
import { MainLayout } from '@squoolr/layout';
import { IntlShape, injectIntl } from 'react-intl';

function AdminLayout({ intl: { formatMessage } }: { intl: IntlShape }) {
  const navItems: INavItem[] = [
    {
      id: 1,
      Icon: LayersOutlined,
      route: '',
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
      route: '',
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
