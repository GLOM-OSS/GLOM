import { Box, Button, lighten, TextField, Typography } from '@mui/material';
import { theme } from '@glom/theme';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useIntl } from 'react-intl';

export default function DemandStatus() {
  const { formatMessage } = useIntl();
  const { push } = useRouter();

  const [code, setCode] = useState<string>('');

  return (
    <Box
      sx={{
        paddingTop: theme.spacing(11.25),
        paddingBottom: theme.spacing(6.25),
        display: 'grid',
        height: '100%',
        gridTemplateRows: 'auto 1fr',
        color: theme.common.titleActive,
      }}
    >
      <Box sx={{ paddingBottom: theme.spacing(6.25) }}>
        <Typography variant="h2" sx={{ textAlign: 'center' }}>
          {formatMessage({ id: 'demandStatus' })}
        </Typography>
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
          {formatMessage({ id: 'demandStatusSubtitle' })}
        </Typography>
      </Box>
      <Box
        sx={{
          border: `1px solid ${theme.common.placeholder}`,
          borderRadius: '10px',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        <Box
          sx={{ display: 'grid', alignItems: 'center', justifyItems: 'center' }}
        >
          <Box sx={{ display: 'grid', justifyItems: 'center' }}>
            <Typography
              variant="h5"
              sx={{ textAlign: 'center', marginBottom: theme.spacing(2) }}
            >
              {formatMessage({ id: 'enterYourCode' })}
            </Typography>
            <TextField
              autoFocus
              placeholder={formatMessage({ id: 'demandCode' })}
              fullWidth
              required
              color="primary"
              size="medium"
              onChange={(event) => setCode(event.target.value)}
              value={code}
              sx={{ minWidth: '200px', width: '70%' }}
            />

            <Button
              variant="contained"
              color="primary"
              disabled={code.length < 5}
              onClick={() =>
                code.length < 5 ? null : push(`/demand-status/${code}`)
              }
              sx={{ marginTop: theme.spacing(5.75), textTransform: 'none' }}
            >
              {formatMessage({ id: 'verifyStatus' })}
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: lighten(theme.palette.primary.main, 0.9),
            borderTopRightRadius: '10px',
            borderBottomRightRadius: '10px',
            display: 'grid',
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >
          <Box sx={{ display: 'grid', justifyItems: 'center' }}>
            <Image
              src="/demand_illustration.png"
              alt={formatMessage({ id: 'skyRocketYourSchool' })}
              height="450%"
              width="450%"
            />
            <Typography variant="h5">
              {formatMessage({ id: 'getReadyForNewAdventure' })}
            </Typography>
            <Typography variant="h2">
              {formatMessage({ id: 'Squoolr' })}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
