import { Icon } from '@iconify/react';
import down from '@iconify/icons-fluent/chevron-down-28-filled';
import { Box, Collapse, IconButton, Tooltip, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import { useTheme } from '@glom/theme';
import { useState } from 'react';

export interface IFaqQuestion {
  question: string;
  answer: string;
}
export default function Question({
  question: { question, answer },
}: {
  question: IFaqQuestion;
}) {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const [shouldShowResponse, setShouldShowResponse] = useState<boolean>(false);

  return (
    <Box
      sx={{
        padding: '20px 18px',
        border: `1px solid ${theme.common.line}`,
        borderRadius: '10px',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        columnGap: 0.5,
        alignItems: 'start',
        cursor: 'pointer',
      }}
      onClick={() => setShouldShowResponse((prev) => !prev)}
    >
      <Box>
        <Typography variant="h4" sx={{ paddingBottom: 0 }}>
          {question}
        </Typography>
        <Collapse in={shouldShowResponse}>
          <Typography
            variant="h4"
            sx={{
              pb: 0,
              color: theme.common.placeholder,
              pt: 1,
              borderTop: `1px solid ${theme.common.line}`,
              mt: 2.5,
            }}
          >
            {answer}
          </Typography>
        </Collapse>
      </Box>
      <Tooltip arrow title={formatMessage({ id: 'more' })}>
        <IconButton size="small" color="primary">
          <Icon
            icon={down}
            rotate={shouldShowResponse ? 2 : 0}
            style={{ color: 'black' }}
          />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
