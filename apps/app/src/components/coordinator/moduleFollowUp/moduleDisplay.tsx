import {
  KeyboardArrowDownOutlined,
  KeyboardArrowUpOutlined,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  CircularProgressProps,
  Collapse,
  IconButton,
  lighten,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { CreditUnitMarkStatus } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';
import ModuleDisplaySubjectLane from './moduleDisplaySubjectLane';

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="body2"
          fontWeight={'500'}
          component="div"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function ModuleDisplay({
  module: {
    credit_unit_code: cuc,
    credit_unit_name: cun,
    credit_points: cp,
    availability_percentage: ap,
    is_published: ip,
    subjectMarkStatus: subjects,
  },
  module,
  disabled,
  open,
  showMore,
  publishModule,
}: {
  module: CreditUnitMarkStatus;
  disabled: boolean;
  open: boolean;
  showMore: (module: CreditUnitMarkStatus | undefined) => void;
  publishModule: (module: CreditUnitMarkStatus) => void;
}) {
  const { formatMessage } = useIntl();
  return (
    <Box sx={{ backgroundColor: theme.common.offWhite }}>
      <Table
        sx={{
          minWidth: 650,
          '& th': {
            padding: '4px 2px',
          },
        }}
      >
        <TableHead
          sx={{
            backgroundColor: lighten(theme.palette.primary.light, 0.5),
          }}
        >
          <TableRow>
            <TableCell align="center">{cuc}</TableCell>
            <TableCell>{cun}</TableCell>
            <TableCell>{`${cp} ${formatMessage({
              id: 'creditPoint',
            })}`}</TableCell>
            <TableCell align="center">
              <CircularProgressWithLabel
                sx={{ color: lighten(theme.palette.success.main, 0.6) }}
                value={ap}
              />
            </TableCell>
            <TableCell align="center">
              {ip ? (
                <Chip
                  label={formatMessage({ id: 'published' })}
                  sx={{
                    backgroundColor: lighten(theme.palette.success.main, 0.6),
                  }}
                />
              ) : (
                <Button
                  variant="contained"
                  color="inherit"
                  sx={{ textTransform: 'none' }}
                  onClick={() => publishModule(module)}
                  disabled={disabled}
                >
                  {formatMessage({ id: 'publishModule' })}
                </Button>
              )}
            </TableCell>
            <TableCell align="center">
              <Tooltip arrow title={formatMessage({ id: 'open' })}>
                <IconButton
                  size="small"
                  onClick={() => showMore(open ? undefined : module)}
                >
                  {open ? (
                    <KeyboardArrowUpOutlined />
                  ) : (
                    <KeyboardArrowDownOutlined />
                  )}
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
      <Collapse in={open}>
        <Box sx={{padding: theme.spacing(3)}}>
          <Table
            sx={{
              minWidth: 650,
            }}
          >
            <TableHead
              sx={{
                backgroundColor: lighten(theme.palette.primary.light, 0.7),
              }}
            >
              <TableRow>
                {['number', 'code', 'title', 'ca', 'exam', 'resit'].map(
                  (val, index) => (
                    <TableCell
                      key={index}
                      align={index > 2 ? 'center' : 'left'}
                    >
                      {val}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {subjects.map((subject, index) => (
                <ModuleDisplaySubjectLane
                  subject={subject}
                  position={index + 1}
                  key={index}
                />
              ))}
            </TableBody>
          </Table>
        </Box>
      </Collapse>
    </Box>
  );
}
