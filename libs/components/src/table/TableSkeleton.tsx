import unchecked from '@iconify/icons-fluent/checkbox-unchecked-16-filled';
import more from '@iconify/icons-fluent/more-vertical-48-regular';
import { Icon } from '@iconify/react';
import {
  Checkbox,
  IconButton,
  Skeleton,
  TableCell,
  TableRow,
} from '@mui/material';

export function TableSkeleton({
  hasCheckbox,
  hasMore,
  cols = 5,
}: {
  cols?: number;
  hasCheckbox?: boolean;
  hasMore?: boolean;
}) {
  const leftCols = cols - (hasMore ? 1 : 0) - (hasCheckbox ? 1 : 0);
  return (
    <>
      {[...new Array(4)].map((_, index) => (
        <TableRow
          key={index}
          sx={{
            '&:last-child td, &:last-child th': { border: 0 },
            '& td': {
              padding: '7px',
            },
          }}
        >
          {hasCheckbox && (
            <TableCell>
              <Checkbox
                checked={false}
                disabled
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
              />
            </TableCell>
          )}
          {[...new Array(leftCols)].map((_, index) => (
            <TableCell key={index}>
              <Skeleton animation="wave" />
            </TableCell>
          ))}
          {hasMore && (
            <TableCell align="right">
              <IconButton size="small" disabled={true}>
                <Icon icon={more} />
              </IconButton>
            </TableCell>
          )}
        </TableRow>
      ))}
    </>
  );
}
