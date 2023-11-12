import { useTheme } from '@glom/theme';
import { Icon, IconifyIcon } from '@iconify/react';
import { Box, Typography } from '@mui/material';
import { MouseEvent } from 'react';

export function TableHeaderItem({
  title,
  icon,
  onClick,
}: {
  icon: IconifyIcon;
  title: string;
  onClick?: (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'grid',
        gridAutoFlow: 'column',
        alignItems: 'center',
        columnGap: 1,
        borderRadius: '4px',
        cursor: 'pointer',
      }}
      onClick={(event) => (onClick ? onClick(event) : null)}
    >
      <Icon icon={icon} fontSize={20} />
      <Typography className="p4" sx={{ color: theme.common.body }}>
        {title}
      </Typography>
    </Box>
  );
}
