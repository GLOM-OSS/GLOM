import { useTheme } from '@glom/theme';
import left from '@iconify/icons-fluent/arrow-left-20-filled';
import { Icon } from '@iconify/react';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

export default function NotFound() {
  const { formatMessage } = useIntl();
  const { push } = useRouter();
  const theme = useTheme();
  return (
    <Box
      sx={{
        height: '100%',
        gridTemplateRows: 'auto 1fr',
        rowGap: 1,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          justifyItems: 'center',
          alignContent: 'center',
          rowGap: 2,
          height: '100%',
          padding: '70px 32px',
        }}
      >
        <img src="404.png" alt="page not found" />
        <Typography
          className="title-landing-page"
          sx={{
            color: 'var(--titleActive)',
          }}
        >
          {formatMessage({ id: 'pageNotFound' })}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: theme.common.label,
            textAlign: 'center',
            fontSize: {
              mobile: '16px',
              laptop: theme.typography.h5.fontSize,
            },
          }}
        >
          {formatMessage({ id: 'missingPage' })}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Icon icon={left} />}
          onClick={() => push('/')}
        >
          {formatMessage({ id: 'goHome' })}
        </Button>
      </Box>
    </Box>
  );
}
