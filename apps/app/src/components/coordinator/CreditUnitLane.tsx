import { MoreHorizRounded } from '@mui/icons-material';
import {
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material';
import { CreditUnit } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

export const RowMenu = ({
  anchorEl,
  closeMenu,
  deleteCreditUnit: dcu,
  editCreditUnit: ecu,
}: {
  anchorEl: null | HTMLElement;
  closeMenu: () => void;
  deleteCreditUnit: () => void;
  editCreditUnit: () => void;
}) => {
  const { formatMessage } = useIntl();
  const menuItems: { menu_title: string; executeFunction: () => void }[] = [
    {
      menu_title: 'edit',
      executeFunction: ecu,
    },
    {
      menu_title: 'delete',
      executeFunction: dcu,
    },
  ];
  return (
    <Menu anchorEl={anchorEl} open={anchorEl !== null} onClose={closeMenu}>
      {menuItems.map(({ menu_title, executeFunction }, index) => (
        <MenuItem
          key={index}
          onClick={() => {
            executeFunction();
            closeMenu();
          }}
          sx={{ padding: theme.spacing(1), minHeight: 'fit-content' }}
        >
          {formatMessage({ id: menu_title })}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default function CreditUnitLane({
  creditUnit: {
    credit_points: cp,
    credit_unit_name: cun,
    semester_number: sn,
    credit_unit_code: cuc,
  },
  creditUnit: cu,
  setAnchorEl,
  getActionnedCreditUnit,
  isSubmitting,
}: {
  creditUnit: CreditUnit;
  setAnchorEl: (el: null | HTMLElement) => void;
  getActionnedCreditUnit: (creditUnit: CreditUnit) => void;
  isSubmitting: boolean;
}) {
  const { formatMessage } = useIntl();
  return (
    <TableRow
      sx={{
        borderBottom: `1px solid ${theme.common.line}`,
        borderTop: `1px solid ${theme.common.line}`,
        padding: `0 ${theme.spacing(4.625)}`,
      }}
    >
      <TableCell component="th" scope="row">
        {cuc}
      </TableCell>
      <TableCell component="th" scope="row">
        {cun}
      </TableCell>
      <TableCell component="th" scope="row">
        {cp}
      </TableCell>
      <TableCell component="th" scope="row">
        {sn}
      </TableCell>
      <TableCell align="right" component="th" scope="row">
        <IconButton
          size="small"
          disabled={isSubmitting}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
            getActionnedCreditUnit(cu);
          }}
        >
          <Tooltip arrow title={formatMessage({ id: 'more' })}>
            <MoreHorizRounded sx={{ fontSize: '24px' }} />
          </Tooltip>
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export function CreditUnitSkeleton() {
  return (
    <TableRow
      sx={{
        borderBottom: `1px solid ${theme.common.line}`,
        borderTop: `1px solid ${theme.common.line}`,
        padding: `0 ${theme.spacing(4.625)}`,
      }}
    >
      <TableCell component="th" scope="row">
        <Skeleton animation="wave" />
      </TableCell>
      <TableCell component="th" scope="row">
        <Skeleton animation="wave" />
      </TableCell>
      <TableCell component="th" scope="row">
        <Skeleton animation="wave" />
      </TableCell>
      <TableCell component="th" scope="row">
        <Skeleton animation="wave" />
      </TableCell>
      <TableCell component="th" scope="row">
        <Skeleton animation="wave" />
      </TableCell>
    </TableRow>
  );
}
