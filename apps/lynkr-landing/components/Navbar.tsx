import { ReactElement, cloneElement } from 'react';
import DesktopNav from './Navbar/DesktopNav';
import MobileNav from './Navbar/MobileNav';
import { INavItem } from './Navbar/NavItem';

export function ElevationScroll({ children }: { children: ReactElement }) {
  return cloneElement(children, {
    elevation: 0,
  });
}

export default function Navbar() {
  const navLinks: INavItem[] = [
    { route: '#features', title: 'features' },
    { route: '#clients', title: 'ourClients' },
    { route: '#how-it-works', title: 'howItWorks' },
    { route: '#pricing', title: 'pricing' },
    { route: '#faq', title: 'faq' },
    { route: '#contact-us', title: 'contactUs' },
  ];

  return (
    <>
      <DesktopNav navLinks={navLinks} />
      <MobileNav navLinks={navLinks} />
    </>
  );
}
