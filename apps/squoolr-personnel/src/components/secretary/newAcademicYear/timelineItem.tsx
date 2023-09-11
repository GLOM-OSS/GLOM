import { Box, Typography } from '@mui/material';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

const TimelineItem = ({
  isActive = false,
  isLastItem = false,
  titleId,
  subtitleId,
  children,
  number,
  onClick,
}: {
  isActive?: boolean;
  isLastItem?: boolean;
  titleId: string;
  number: number;
  subtitleId: string;
  children: JSX.Element;
  onClick: () => void;
}) => {
  const { formatMessage } = useIntl();
  return (
    <Box sx={{ display: 'grid', gap: theme.spacing(1) }}>
      <Box
        onClick={onClick}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          alignItems: 'center',
          gap: theme.spacing(2),
          cursor: 'pointer',
        }}
      >
        <Box
          sx={{
            backgroundColor: isActive
              ? theme.palette.primary.main
              : theme.common.line,
            padding: `5px ${number > 1 ? 13 : 15}px`,
            borderRadius: '50%',
            color: theme.common.offWhite,
          }}
        >
          {number}
        </Box>
        <Typography sx={{ fontSize: '1.125rem', fontWeight: 500 }}>
          {formatMessage({ id: titleId })}
        </Typography>
      </Box>
      <Box
        sx={{
          marginLeft: '15px',
          marginTop: theme.spacing(1),
          borderLeft: `0.5px solid ${
            isActive ? theme.palette.primary.main : theme.common.line
          }`,
        }}
      >
        <Box
          sx={{
            marginLeft: '35px',
            padding: `${theme.spacing(2)} 0`,
            display: 'grid',
            gap: theme.spacing(2),
          }}
        >
          <Typography variant="body2">
            {formatMessage({ id: subtitleId })}
          </Typography>
          <Box sx={{ marginTop: theme.spacing(1) }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
};
export default TimelineItem;
