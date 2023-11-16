import { useTheme } from '@glom/theme';
import { Icon } from '@iconify/react';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import copy from '@iconify/icons-fluent/copy-24-regular';

export default function SubmittedStep({ schoolCode }: { schoolCode: string }) {
  const { formatMessage } = useIntl();
  const { push } = useRouter();
  const theme = useTheme();

  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }
  }, [isCopied]);

  return (
    <Box
      sx={{
        display: 'grid',
        alignContent: 'center',
        justifyItems: 'center',
        rowGap: 3,
      }}
    >
      <Typography className="p2--space">
        {formatMessage({ id: 'mailSentForFutureReference' })}
      </Typography>
      <Tooltip
        arrow
        title={formatMessage({
          id: isCopied ? 'copied' : 'copyToClipboard',
        })}
      >
        <Button
          variant="outlined"
          color={isCopied ? 'success' : 'inherit'}
          endIcon={
            <Icon
              icon={copy}
              style={{
                color: isCopied
                  ? theme.palette.success.main
                  : theme.palette.primary.main,
              }}
            />
          }
          onClick={() => {
            if (!isCopied) {
              navigator.clipboard.writeText(schoolCode);
              setIsCopied(true);
            }
          }}
        >
          {isCopied
            ? formatMessage({ id: 'copied' })
            : `${formatMessage({ id: 'code' })}: ${schoolCode}`}
        </Button>
      </Tooltip>
      <Box sx={{ display: 'grid', gridAutoFlow: 'column', columnGap: 4 }}>
        <Button color="inherit" variant="outlined" onClick={() => push('/')}>
          {formatMessage({ id: 'goHome' })}
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => push(`/?status=${schoolCode}`)}
        >
          {formatMessage({ id: 'verifyStatus' })}
        </Button>
      </Box>
    </Box>
  );
}
