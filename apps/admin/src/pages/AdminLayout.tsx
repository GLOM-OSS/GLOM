import { DashboardRounded, SettingsRounded } from '@mui/icons-material';
import { Layout, NavItem, PersonnelRole, User, useUser } from '@squoolr/layout';
import { useLanguage } from '@squoolr/theme';
import { useState } from 'react';
import { injectIntl, IntlShape } from 'react-intl';

//TODO: replace this data with the data from user context later on
const user: User = {
  activeYear: {
    academic_year_id: 'hello world',
    ending_date: new Date('2003-10-12'),
    starting_date: new Date('2022-10-12'),
    code: 'kskdls',
    year_status: 'active',
  },
  birthdate: new Date('1999/03/27'),
  email: 'lorraintchakoumi@gmail.com',
  fisrt_name: 'Tchakoumi Lorrain',
  gender: 'Female',
  last_name: 'Kouatchoua',
  login_id: 'disoeosenso',
  national_id_number: '000316122',
  person_id: 'wieo',
  phone_number: '657140183',
  preferred_lang: 'En',
  annualConfigurator: { annual_configurator_id: 'lsk', is_sudo: false },
  annualRegistry: { annual_registry_id: 'lsk' },
};

export const Testing2 = () => {
  const { gender } = useUser();
  const { activeLanguage } = useLanguage();
  alert(`${gender}, ${activeLanguage}`);
  return <div>massa mi heeee</div>;
};

function AdminLayout({ intl: { formatMessage } }: { intl: IntlShape }) {
  alert('admin')
  const navItems: NavItem[] = [
    {
      id: 1,
      Icon: SettingsRounded,
      title: formatMessage({ id: 'management' }),
      children: [
        {
          title: formatMessage({ id: 'Departments' }),
          route: '/layout',
        },
        {
          title: formatMessage({ id: 'Major' }),
          route: '/dashboard',
        },
        {
          title: formatMessage({ id: 'academic year' }),
          route: '/dashboard',
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

  const [activeRole, setActiveRole] = useState<PersonnelRole | 'administrator'>(
    'administrator'
  ); //TODO: redefine initial value with roles
  const handleSwapRole = (newRole: PersonnelRole) => setActiveRole(newRole);

  return (
    <Layout
      callingApp="admin"
      activeRole={activeRole}
      userRoles={['secretary', 'registry']}
      user={user}
      navItems={navItems}
      handleSwapRole={handleSwapRole}
    />
  );
}
export default injectIntl(AdminLayout);
