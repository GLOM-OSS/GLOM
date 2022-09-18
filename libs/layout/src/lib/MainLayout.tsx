import UserContextProvider from '../contexts/UserContextProvider';
import { NavItem, PersonnelRole } from './interfaces';
import Layout from './layout';

export function MainLayout({
  navItems,
  callingApp,
  activeRole,
  handleSwapRole,
}: {
  navItems: NavItem[];
  callingApp: 'admin' | 'personnel';
  activeRole: PersonnelRole | 'administrator';
  handleSwapRole?: (newRole: PersonnelRole) => void;
}) {
  return (
    <UserContextProvider>
      <Layout
        callingApp={callingApp}
        activeRole={activeRole}
        navItems={navItems}
        handleSwapRole={handleSwapRole}
      />
    </UserContextProvider>
  );
}
