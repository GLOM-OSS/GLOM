import { MoreHorizRounded } from '@mui/icons-material';
import {
  IconButton,
  Skeleton,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material';
import { AcademicProfile } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

export function ProfileSkeleton() {
  return (
    <TableRow
      sx={{
        borderBottom: `1px solid ${theme.common.line}`,
        borderTop: `1px solid ${theme.common.line}`,
        padding: `0 ${theme.spacing(4.625)}`,
      }}
    >
      {[...new Array(5)].map((_, index) => (
        <TableCell component="th" scope="row" key={index}>
          <Skeleton animation="wave" />
        </TableCell>
      ))}
    </TableRow>
  );
}

export default function ProfileLane({
  profile: { comment: c, maximum_score: max, minimum_score: min },
  profile,
  setAnchorEl,
  getActionnedProfile,
  isSubmitting,
  position: p,
}: {
  profile: AcademicProfile;
  setAnchorEl: (el: null | HTMLElement) => void;
  getActionnedProfile: (profile: AcademicProfile) => void;
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
      <TableCell>{c}</TableCell>
      <TableCell align="right">
        <IconButton
          size="small"
          disabled={isSubmitting}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
            getActionnedProfile(profile);
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
