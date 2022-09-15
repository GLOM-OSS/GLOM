import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export interface NavChild {
  title: string;
  route: string;
}

export interface NavItem {
  id: number;
  Icon: OverridableComponent<SvgIconTypeMap<unknown, 'svg'>> & {
    muiName: string;
  };
  title: string;
  children: NavChild[];
}
