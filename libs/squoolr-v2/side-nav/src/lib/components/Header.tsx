import { useTheme } from '@glom/theme';
import { Box, Collapse, IconButton, Tooltip, Typography } from '@mui/material';
import left from '@iconify/icons-fluent/chevron-left-48-regular';
import right from '@iconify/icons-fluent/chevron-right-48-regular';
import { Icon } from '@iconify/react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

export default function Header({
  isExpanded,
  handleExpand,
}: {
  isExpanded: boolean;
  handleExpand: () => void;
}) {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const { push } = useRouter();
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        justifyItems: 'start',
        alignItems: 'center',
        gap: 0,
        paddingBottom: '24px',
      }}
    >
      <Box
        onClick={() => push('/')}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 1,
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <img src="/logo.png" alt="squoolr logo" height={50} />
        <Typography
          component={Collapse}
          in={isExpanded}
          orientation="horizontal"
          variant="h3"
          sx={{ color: `${theme.common.titleActive} !important` }}
        >
          Squoolr
        </Typography>
      </Box>
      <Tooltip
        arrow
        title={formatMessage({
          id: isExpanded ? 'hideSideNav' : 'showSideNav',
        })}
      >
        <IconButton
          size="small"
          onClick={handleExpand}
          sx={{
            position: 'absolute',
            backgroundColor: 'white',
            boxShadow:
              '0px 8px 24px -4px rgba(24, 44, 75, 0.08), 0px 6px 12px -6px rgba(24, 44, 75, 0.12)',
            right: isExpanded ? '-15px' : '-10px',
            top: '40px',
          }}
        >
          <Icon icon={isExpanded ? left : right} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
