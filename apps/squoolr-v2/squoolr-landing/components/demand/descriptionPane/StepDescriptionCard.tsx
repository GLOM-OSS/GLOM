import { useTheme } from '@glom/theme';
import { Paper, Typography } from '@mui/material';

export default function StepDescriptionCard({
  title,
  description,
}: {
  title: string | JSX.Element;
  description: string | JSX.Element;
}) {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 1,
        padding: '32px',
        display: 'grid',
        rowGap: 2,
        gridTemplateRows: 'auto 1fr',
      }}
    >
      {typeof title === 'string' ? (
        <Typography variant="h3" sx={{ textTransform: 'uppercase' }}>
          {title}
        </Typography>
      ) : (
        title
      )}
      {typeof description === 'string' ? (
        <Typography
          variant="h5"
          sx={{
            fontWeight: 400,
            color: theme.common.label,
            lineHeight: '24px',
          }}
        >
          {description}
        </Typography>
      ) : (
        description
      )}
    </Paper>
  );
}
