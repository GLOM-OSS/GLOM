import { lighten, TableCell, TableHead, TableRow } from '@mui/material';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

export default function TableHeader({
  isAnonimated,
}: {
  isAnonimated: boolean;
}) {
  const { formatMessage } = useIntl();
  const fullHeaderItems = [
    'number',
    'matricule',
    'studentName',
    'score',
    'lastUpdated',
  ];
  const anonimatedHeaderItems = ['number', 'anonymity', 'score', 'lastUpdated'];
  const headerItems = isAnonimated ? anonimatedHeaderItems : fullHeaderItems;
  return (
    <TableHead
      sx={{
        backgroundColor: lighten(theme.palette.primary.light, 0.6),
      }}
    >
      <TableRow>
        {headerItems.map((val, index) => (
          <TableCell key={index}>{formatMessage({ id: val })}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
