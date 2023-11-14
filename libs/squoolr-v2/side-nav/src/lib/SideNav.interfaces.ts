import { IconifyIcon } from '@iconify/react';

export interface INavItem {
  icon: IconifyIcon;
  title: string;
  route: string;
}

export interface INavSection {
  title: string;
  route: string;
  navItems: INavItem[];
}
