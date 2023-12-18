import { useTheme } from '@glom/theme';
import checked from '@iconify/icons-fluent/checkbox-checked-16-filled';
import unchecked from '@iconify/icons-fluent/checkbox-unchecked-16-filled';
import { Icon } from '@iconify/react';
import { Checkbox, TableCell, TableHead, TableRow } from '@mui/material';
import { useIntl } from 'react-intl';

export default function StaffTableHead({
  disabled,
  selectAllStaff,
  isAllSelected,
  isIndeterminate,
}: {
  disabled: boolean;
  selectAllStaff: () => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}) {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const TABLE_HEADERS = [
    '',
    'staffName',
    'telephone',
    'email',
    'roles',
    'lastConnected',
    '',
  ];

  return (
    <TableHead>
      <TableRow
        sx={{
          '& th': {
            padding: '8.5px',
          },
        }}
      >
        {TABLE_HEADERS.map((columnTitle, index) => {
          return (
            <TableCell key={index} align="left">
              {index === 0 ? (
                <Checkbox
                  disabled={disabled}
                  onClick={() => (disabled ? null : selectAllStaff())}
                  checked={isAllSelected}
                  icon={
                    <Icon
                      icon={unchecked}
                      style={{
                        color: '#D1D5DB',
                        height: '100%',
                        width: '21px',
                      }}
                    />
                  }
                  checkedIcon={
                    <Icon
                      icon={checked}
                      style={{
                        color: theme.palette.primary.main,
                        height: '100%',
                        width: '21px',
                      }}
                    />
                  }
                  indeterminate={isIndeterminate}
                />
              ) : index > 0 && columnTitle === '' ? (
                ''
              ) : (
                formatMessage({ id: columnTitle })
              )}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}
