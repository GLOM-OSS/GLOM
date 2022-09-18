import UserContextProvider from '../contexts/UserContextProvider';
import { NavItem, PersonnelRole } from './interfaces';
import Layout from './layout';

export function MainLayout({
  navItems,
  callingApp,
  activeRole,
  userRoles,
  handleSwapRole,
}: {
  navItems: NavItem[];
  callingApp: 'admin' | 'personnel';
  activeRole: PersonnelRole | 'administrator';
  userRoles?: PersonnelRole[];
  handleSwapRole?: (newRole: PersonnelRole) => void;
}) {
  return (
    <UserContextProvider>
      <Layout
        callingApp={callingApp}
        activeRole={activeRole}
        userRoles={userRoles}
        navItems={navItems}
        handleSwapRole={handleSwapRole}
      />
    </UserContextProvider>
  );
}
