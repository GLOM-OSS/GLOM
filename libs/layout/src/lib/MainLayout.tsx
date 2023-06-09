import { INavItem, UserRole } from '@squoolr/interfaces';
import UserContextProvider from '../contexts/UserContextProvider';
import Layout from './layout';

export function MainLayout({
  navItems,
  callingApp,
}: {
  navItems: {
    role: UserRole;
    navItems: INavItem[];
  }[];
  callingApp: 'admin' | 'personnel' | 'student';
}) {
  return (
    <UserContextProvider>
      <Layout callingApp={callingApp} navItems={navItems} />
    </UserContextProvider>
  );
}
