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
  IconButton,
  lighten,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { CreditUnitMarkStatus } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

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
    <Box>
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
          <TableRow sx={{ padding: '8px 2px' }}>
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
        {/* <TableBody>
          {AreEvaluationsLoading ? (
            [...new Array(10)].map((_, index) => (
              <TableLaneSkeleton cols={5} key={index} />
            ))
          ) : evaluations.length === 0 ? (
            <NoTableElement
              message={formatMessage({ id: 'noEvaluationsYet' })}
              colSpan={5}
            />
          ) : (
            evaluations.map((evaluation, index) => (
              <EvaluationLane
                evaluation={evaluation}
                position={index + 1}
                key={index}
              />
            ))
          )}
        </TableBody> */}
      </Table>
    </Box>
  );
}
