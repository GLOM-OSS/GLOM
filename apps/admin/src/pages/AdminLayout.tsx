import { DashboardRounded, LayersOutlined, SettingsRounded } from '@mui/icons-material';
import { Layout, NavItem, PersonnelRole, User } from '@squoolr/layout';
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
  return <div>massa mi heeee</div>;
};

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
      Icon: DashboardRounded,
      title: formatMessage({ id: 'settings' }),
      children: [],
    },
  ];

  const [activeRole, setActiveRole] = useState<PersonnelRole | 'administrator'>(
    'teacher'
  ); //TODO: redefine initial value with roles
  const handleSwapRole = (newRole: PersonnelRole) => setActiveRole(newRole);

  return (
    <Layout
      callingApp="admin"
      activeRole={activeRole}
      userRoles={[]}
      user={user}
      navItems={navItems}
      handleSwapRole={handleSwapRole}
    />
  );
}
export default injectIntl(AdminLayout);
