import { lighten, TableCell, TableRow } from '@mui/material';
import { Assessment } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

export default function AssessmentLane({
  position: p,
  onSelect,
  assessment: {
    assessment_date: ad,
    evaluation_sub_type_name: et,
    created_at: ca,
    duration: d,
  },
  disabled,
}: {
  position: number;
  assessment: Assessment;
  onSelect: () => void;
  disabled: boolean;
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
      <TableCell>{et ? formatMessage({ id: et }) : null}</TableCell>
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
          : null}
      </TableCell>
      <TableCell>{d ? formatNumber(d) : null}</TableCell>
    </TableRow>
  );
}
