import { MoreHorizRounded } from '@mui/icons-material';
import {
  IconButton,
  lighten,
  Skeleton,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material';
import { GradeWeighting } from '@squoolr/interfaces';
import { theme } from '@glom/theme';
import { useIntl } from 'react-intl';

export function WeightingSkeleton() {
  return (
    <TableRow
      sx={{
        borderBottom: `1px solid ${theme.common.line}`,
        borderTop: `1px solid ${theme.common.line}`,
        padding: `0 ${theme.spacing(4.625)}`,
      }}
    >
      {[...new Array(6)].map((_, index) => (
        <TableCell component="th" scope="row" key={index}>
          <Skeleton animation="wave" />
        </TableCell>
      ))}
    </TableRow>
  );
}

export function AbsenceWeighting({ position }: { position: number }) {
  const { formatMessage } = useIntl();
  return (
    <TableRow
      sx={{
        borderBottom: `1px solid ${theme.common.line}`,
        borderTop: `1px solid ${theme.common.line}`,
        padding: `0 ${theme.spacing(4.625)}`,
        backgroundColor: lighten(theme.palette.error.main, 0.7),
      }}
    >
      <TableCell>{position}</TableCell>
      <TableCell colSpan={2}>
        {formatMessage({ id: 'failureByMarkAbsence' })}
      </TableCell>
      <TableCell>{'E'}</TableCell>
      <TableCell colSpan={2}>{0}</TableCell>
    </TableRow>
  );
}

export default function WeightingLane({
  weighting: {
    annual_grade_weighting_id: agw_id,
    grade_value: gv,
    maximum: max,
    minimum: min,
    observation: obs,
    point: pt,
  },
  weighting: w,
  setAnchorEl,
  getActionnedWeighting,
  isSubmitting,
  position: p,
}: {
  weighting: GradeWeighting;
  setAnchorEl: (el: null | HTMLElement) => void;
  getActionnedWeighting: (weighting: GradeWeighting) => void;
  isSubmitting: boolean;
  position: number;
}) {
  const { formatMessage } = useIntl();
  return (
    <TableRow
      sx={{
        borderBottom: `1px solid ${theme.common.line}`,
        borderTop: `1px solid ${theme.common.line}`,
        padding: `0 ${theme.spacing(4.625)}`,
        cursor: 'pointer',
      }}
      hover
    >
      <TableCell>{p}</TableCell>
      <TableCell>{min}</TableCell>
      <TableCell>{max}</TableCell>
      <TableCell>{gv}</TableCell>
      <TableCell>{pt}</TableCell>
      <TableCell align="right">
        <IconButton
          size="small"
          disabled={isSubmitting}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
            getActionnedWeighting(w);
          }}
        >
          <Tooltip arrow title={formatMessage({ id: 'more' })}>
            <MoreHorizRounded sx={{ fontSize: '24px' }} />
          </Tooltip>
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
