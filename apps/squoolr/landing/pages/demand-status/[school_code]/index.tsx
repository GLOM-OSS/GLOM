import {
  Box,
  Button,
  Chip,
  lighten,
  TextField,
  Typography,
} from '@mui/material';
import { checkDemandStatus } from '@squoolr/api-services';
import { theme } from '@glom/theme';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useIntl } from 'react-intl';
interface DemandStatus {
  school_status: 'validated' | 'progress' | 'rejected' | 'pending';
  subdomain?: string;
  rejection_reason?: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { school_code } = context.query;
  try {
    const demandStatus = await checkDemandStatus(school_code as string);
    return { props: { demandStatus } };
  } catch (error) {
    return { notFound: true };
  }
};

export default function VerifyDemandStatus({
  demandStatus: { school_status, subdomain, rejection_reason },
}: {
  demandStatus: DemandStatus;
}) {
  const { formatMessage } = useIntl();
  const {
    push,
    query: { school_code },
  } = useRouter();

  const [code, setCode] = useState<string>(school_code as string);
  const schoolDemandStatus = school_status.toLocaleLowerCase();

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
            <Chip
              sx={{
                justifySelf: 'center',
                marginTop: theme.spacing(2.4),
                backgroundColor: lighten(
                  theme.palette[
                    schoolDemandStatus === 'pending'
                      ? 'info'
                      : schoolDemandStatus === 'progress'
                      ? 'secondary'
                      : schoolDemandStatus === 'validated'
                      ? 'success'
                      : 'error'
                  ].main,
                  0.6
                ),
              }}
              label={formatMessage({ id: school_status })}
            />
            {schoolDemandStatus === 'validated' ? (
              <Box
                sx={{
                  textAlign: 'center',
                  width: '85%',
                  marginTop: theme.spacing(1),
                }}
              >
                <Typography component="span" variant="body2">
                  {formatMessage({ id: 'demandValidated' })}
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >{`https://${subdomain}.squoolr.com`}</Typography>{' '}
                <Typography component="span" variant="body2">
                  {formatMessage({ id: 'demandValidated2' })}
                </Typography>
              </Box>
            ) : schoolDemandStatus === 'rejected' ? (
              <Box
                sx={{
                  textAlign: 'center',
                  width: '85%',
                  marginTop: theme.spacing(1),
                }}
              >
                <Typography component="span" variant="body2">
                  {formatMessage({ id: 'demandRejected' })}
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  {rejection_reason}
                </Typography>{' '}
                <Typography component="span" variant="body2">
                  {formatMessage({ id: 'demandRejected2' })}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ marginTop: theme.spacing(1) }}>
                {formatMessage({ id: 'wereWorkingActively' })}
              </Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              disabled={code.length < 5 || school_code === code}
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
