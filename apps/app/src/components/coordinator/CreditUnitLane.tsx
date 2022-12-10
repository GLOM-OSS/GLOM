import { KeyboardArrowDown } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

interface CreditUnitInterface {
  credit_unit_code: string;
  credit_unit_name: string;
  credit_points: number;
  semester_number: number;
}

export default function CreditUnitLane({
  creditUnit: {
    credit_points,
    credit_unit_code,
    credit_unit_name,
    semester_number,
  },
}: {
  creditUnit: CreditUnitInterface;
}) {
  const { formatMessage } = useIntl();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.common.offWhite,
        display: 'grid',
        columnGap: theme.spacing(3),
        gridTemplateColumns: 'auto 2fr 1fr 0.75fr 0.5fr auto',
        borderRadius: theme.spacing(1.5),
        padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
        width: '100%',
        transition: '0.3s',
        alignItems: 'center',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
          transition: '0.3s',
        },
      }}
    >
      <Typography>{credit_unit_code}</Typography>
      <Typography>{credit_unit_name}</Typography>
      <Typography>{`${formatMessage({
        id: 'creditPoint',
      })}: ${credit_points}`}</Typography>
      <Typography>{`${formatMessage({
        id: 'semester',
      })}: ${semester_number}`}</Typography>
      <Button
        size="small"
        color="inherit"
        variant="contained"
        sx={{ textTransform: 'none', color: theme.common.body }}
      >
        {formatMessage({ id: 'modify' })}
      </Button>
      <KeyboardArrowDown sx={{ fontSize: '24px', color: 'white' }} />
    </Box>
  );
}
