import { LayersOutlined } from '@mui/icons-material';
import { MainLayout, NavItem } from '@squoolr/layout';
import { injectIntl, IntlShape } from 'react-intl';

function AppLayout({ intl: { formatMessage } }: { intl: IntlShape }) {
  const navItems: NavItem[] = [
    {
      id: 1,
      Icon: LayersOutlined,
      title: 'configurations',
      children: [
        {
          title: formatMessage({ id: 'departments' }),
          route: 'departments',
          page_title: 'departments',
        },
        {
          title: formatMessage({ id: 'majors' }),
          route: 'majors',
          page_title: 'majors',
        },
        {
          title: formatMessage({ id: 'personnel' }),
          route: 'personnel',
          page_title: 'personnel',
        },
        {
          title: formatMessage({ id: 'newAcademicYear' }),
          route: 'new-academic-year',
          page_title: 'newAcademicYear',
        },
      ],
    },
  ];

  return (
    <MainLayout
      callingApp="personnel"
      navItems={[
        { role: 'registry', navItems: navItems },
        { role: 'secretary', navItems: navItems },
      ]}
    />
  );
}
export default injectIntl(AppLayout);
