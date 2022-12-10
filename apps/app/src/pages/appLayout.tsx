import { GradingRounded, LayersOutlined } from '@mui/icons-material';
import { MainLayout, NavItem } from '@squoolr/layout';
import { injectIntl, IntlShape } from 'react-intl';

function AppLayout({ intl: { formatMessage } }: { intl: IntlShape }) {
  const coordinatorNavItems: NavItem[] = [
    {
      id: 1,
      Icon: LayersOutlined,
      title: 'configurations',
      children: [
        {
          title: formatMessage({ id: 'modulesAndSubjects' }),
          route: 'subjects-and-modules',
          page_title: 'managementOfModulesandSubjects',
        },
      ],
    },
    {
      id: 2,
      Icon: GradingRounded,
      title: 'marksManagement',
      children: [
        {
          title: formatMessage({ id: 'marksFollowUp' }),
          route: 'module-follow-up',
          page_title: 'marksFollowUp',
        },
      ],
    },
  ];
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
        { role: 'coordinator', navItems: coordinatorNavItems },
        { role: 'secretary', navItems: navItems },
      ]}
    />
  );
}
export default injectIntl(AppLayout);
