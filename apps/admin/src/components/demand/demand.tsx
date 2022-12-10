import { Box, Button, Chip, lighten, Typography } from '@mui/material';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import { DemandInterface } from './demands';

export default function Demand({
  demand: { code, email, phone_number, school_name, status },
}: {
  demand: DemandInterface;
}) {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const schoolDemandStatus = status.toLocaleLowerCase();
  return (
    <Box
      component={Button}
      onClick={() => navigate(code)}
      fullWidth
      sx={{
        padding: `${theme.spacing(2)} ${theme.spacing(3.125)}`,
        display: 'grid',
        alignItems: 'center',
        columnGap: theme.spacing(10),
        gridTemplateColumns: '100px 1fr 1fr 1fr 12ch',
        borderRadius: theme.spacing(1),
        marginTop: theme.spacing(3),
        color: theme.common.titleActive,
        justifyItems: 'start',
      }}
    >
      <Typography sx={{...theme.typography.body2}}>{code}</Typography>
      <Typography sx={{...theme.typography.body2}}>{school_name}</Typography>
      <Typography sx={{...theme.typography.body2}}>{email}</Typography>
      <Typography sx={{...theme.typography.body2}}>{phone_number}</Typography>
      <Chip
        sx={{
          justifySelf: 'center',
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
        label={formatMessage({ id: status })}
      />
    </Box>
  );
}
