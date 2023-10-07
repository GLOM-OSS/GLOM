import { lighten, TableCell, TableRow } from '@mui/material';
import { Assessment } from '@squoolr/interfaces';
import { theme } from '@glom/theme';
import { useIntl } from 'react-intl';

export default function AssessmentLane({
  position: p,
  onSelect,
  assessment: {
    assessment_date: ad,
    evaluation_sub_type_name: et,
    created_at: ca,
    duration: d,
    submission_type: st,
  },
  disabled,
  isAssignment,
}: {
  position: number;
  assessment: Assessment;
  onSelect: () => void;
  disabled: boolean;
  isAssignment: boolean;
}) {
  const { formatMessage, formatDate, formatNumber } = useIntl();
  return (
    <TableRow
      sx={{
        borderBottom: `1px solid ${theme.common.line}`,
        borderTop: `1px solid ${theme.common.line}`,
        padding: `0 ${theme.spacing(4.625)}`,
        backgroundColor:
          ad && new Date() > new Date(ad)
            ? lighten(theme.palette.success.main, 0.96)
            : ad
            ? lighten(theme.palette.primary.main, 0.96)
            : 'initial',
        cursor: 'pointer',
      }}
      hover={!ad}
      onClick={disabled ? () => null : () => onSelect()}
    >
      <TableCell>{p}</TableCell>
      <TableCell>
        {formatDate(new Date(ca), {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })}
      </TableCell>
      <TableCell>
        {ad
          ? formatDate(new Date(ad), {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            })
          : formatMessage({ id: 'notAvailable' })}
      </TableCell>
      <TableCell>
        {isAssignment
          ? formatMessage({ id: st })
          : formatMessage({ id: et ?? 'notAvailable' })}
      </TableCell>
      {!isAssignment && (
        <TableCell>
          {d
            ? formatNumber(d, {
                style: 'unit',
                unit: 'minute',
                unitDisplay: 'short',
              })
            : null}
        </TableCell>
      )}
    </TableRow>
  );
}
