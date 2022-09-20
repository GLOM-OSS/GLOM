import UserContextProvider from '../contexts/UserContextProvider';
import { NavItem, PersonnelRole } from './interfaces';
import Layout from './layout';

export function MainLayout({
  navItems,
  callingApp,
}: {
  navItems: {role: PersonnelRole | 'administrator', navItems:NavItem[]}[];
  callingApp: 'admin' | 'personnel';
}) {
  return (
    <UserContextProvider>
      <Layout
        callingApp={callingApp}
        navItems={navItems}
      />
    </UserContextProvider>
  );
}
