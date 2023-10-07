import { ReactElement, cloneElement } from 'react';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import { INavItem } from './NavItem';
import { useScrollTrigger } from '@mui/material';

export function ElevationScroll({ children }: { children: ReactElement }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return cloneElement(children, {
    elevation: trigger ? 4 : 0,
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
