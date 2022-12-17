import {
    CancelOutlined,
    CheckCircleOutlineRounded,
    MoreHorizRounded
} from '@mui/icons-material';
import {
    IconButton, Skeleton,
    TableCell,
    TableRow,
    Tooltip
} from '@mui/material';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

export interface DisplaySubject {
  annual_credit_unit_subject_id: string;
  annual_credit_unit_id: string;
  subject_code: string;
  subject_title: string;
  weighting: number;
  theory: number;
  guided_work: number;
  practical: number;
  main_teacher_fullname: string;
  objective: string | null;
  annual_teacher_id?: string;
}

export default function SubjectLane({
  subject: {
    subject_code: sc,
    subject_title: st,
    weighting: w,
    theory: t,
    guided_work: gw,
    practical: p,
    main_teacher_fullname: mt_fn,
    objective: o,
  },
  subject: s,
  setAnchorEl,
  getActionnedSubject,
  isSubmitting,
}: {
  subject: DisplaySubject;
  setAnchorEl: (el: null | HTMLElement) => void;
  getActionnedSubject: (subject: DisplaySubject) => void;
  isSubmitting: boolean;
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
      <TableCell>{sc}</TableCell>
      <TableCell>{st}</TableCell>
      <TableCell>{w}</TableCell>
      <TableCell>{t}</TableCell>
      <TableCell>{gw}</TableCell>
      <TableCell>{p}</TableCell>
      <TableCell>{gw + p + t}</TableCell>
      <TableCell>{mt_fn}</TableCell>
      <TableCell>
        {o ? (
          <Tooltip arrow title={formatMessage({ id: 'objectivePresent' })}>
            <CheckCircleOutlineRounded color="success" />
          </Tooltip>
        ) : (
          <Tooltip arrow title={formatMessage({ id: 'objectiveAbsent' })}>
            <CancelOutlined color="error" />
          </Tooltip>
        )}
      </TableCell>
      <TableCell align="right">
        <IconButton
          size="small"
          disabled={isSubmitting}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
            getActionnedSubject(s);
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

export function SubjectSkeleton() {
  return (
    <TableRow
      sx={{
        borderBottom: `1px solid ${theme.common.line}`,
        borderTop: `1px solid ${theme.common.line}`,
        padding: `0 ${theme.spacing(4.625)}`,
      }}
    >
      {[...new Array(10)].map((_, index) => (
        <TableCell component="th" scope="row" key={index}>
          <Skeleton animation="wave" />
        </TableCell>
      ))}
    </TableRow>
  );
}
