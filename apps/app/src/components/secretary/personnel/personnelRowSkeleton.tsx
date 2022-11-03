import { MoreHorizRounded } from '@mui/icons-material';
import {
  Box,
  Chip,
  lighten,
  Skeleton,
  TableCell,
  TableRow,
} from '@mui/material';
import { theme } from '@squoolr/theme';
import React from 'react';

export function PersonnelRowSkeleton({ index }: { index: number }) {
  return (
    <TableRow
      sx={{
        backgroundColor:
          index % 2 === 1 ? lighten(theme.palette.primary.main, 0.96) : 'none',
      }}
    >
      <TableCell component="th" scope="row">
        <Skeleton variant="text" animation="wave" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" animation="wave" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" animation="wave" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" animation="wave" />
      </TableCell>
      <TableCell>
        <Box
          sx={{
            display: 'grid',
            gridAutoFlow: 'column',
            gap: theme.spacing(0.5),
          }}
        >
          <Chip
            size="small"
            sx={{
              backgroundColor: lighten(theme.palette.primary.main, 0.9),
            }}
            label={<Skeleton variant="text" width="20px" animation="wave" />}
          />
          <Chip
            size="small"
            sx={{
              backgroundColor: lighten(theme.palette.error.main, 0.9),
            }}
            label={<Skeleton variant="text" width="20px" animation="wave" />}
          />
        </Box>
      </TableCell>
      <TableCell>
        <MoreHorizRounded sx={{ fontSize: '24px' }} />
      </TableCell>
    </TableRow>
  );
}
