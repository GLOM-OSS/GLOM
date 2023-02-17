import { GradingRounded, InventoryOutlined, LayersOutlined, PeopleAltOutlined } from '@mui/icons-material';
import { MainLayout, NavItem } from '@squoolr/layout';
import { injectIntl, IntlShape } from 'react-intl';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function AppLayout({ intl: { formatMessage } }: { intl: IntlShape }) {
  const coordinatorNavItems: NavItem[] = [
    {
      id: 1,
      Icon: LayersOutlined,
      title: 'configurations',
      route: 'configurations',
      children: [
        {
          title: formatMessage({ id: 'modulesAndSubjects' }),
          route: 'subjects-and-modules',
          page_title: 'managementOfModulesAndSubjects',
        },
      ],
    },
    {
      id: 2,
      Icon: GradingRounded,
      title: 'marksManagement',
      route: 'marks-Management',
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
      route: 'configurations',
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

  const registryNavItems: NavItem[] = [
    {
      id: 1,
      Icon: LayersOutlined,
      title: 'configurations',
      route: 'configurations',
      children: [
        {
          title: formatMessage({ id: 'weightingTable' }),
          route: 'weighting-table',
          page_title: 'weightingTable',
        },
        {
          title: formatMessage({ id: 'academicProfile' }),
          route: 'academic-profile',
          page_title: 'academicProfile',
        },
      ],
    },
    {
      id: 2,
      Icon: InventoryOutlined,
      title: 'markManagement',
      route: 'marks-management',
      children: [
        {
          title: formatMessage({ id: 'examinations' }),
          route: 'exams',
          page_title: 'examinations',
        },
      ],
    },
    {
      id: 3,
      Icon: PeopleAltOutlined,
      title: 'studentManagement',
      route: 'student-management',
      children: [
        {
          title: formatMessage({ id: 'students' }),
          route: 'students',
          page_title: 'students',
        },
      ],
    },
  ];

  const teacherNavItems: NavItem[] = [
    {
      id: 1,
      Icon: LayersOutlined,
      title: 'configurations',
      route: 'configurations',
      children: [
        {
          title: formatMessage({ id: 'courses' }),
          route: 'courses',
          page_title: 'courses',
        },
        // {
        //   title: formatMessage({ id: 'timetable' }),
        //   route: 'timetable',
        //   page_title: 'timetable',
        // },
      ],
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MainLayout
        callingApp="personnel"
        navItems={[
          { role: 'registry', navItems: registryNavItems },
          { role: 'coordinator', navItems: coordinatorNavItems },
          { role: 'secretary', navItems: navItems },
          { role: 'teacher', navItems: teacherNavItems },
        ]}
      />
    </LocalizationProvider>
  );
}
export default injectIntl(AppLayout);
