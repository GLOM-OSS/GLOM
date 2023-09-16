import { Box, lighten, Skeleton, Typography } from '@mui/material';
import { Chapter } from '@squoolr/interfaces';
import { theme } from '@glom/theme';
import { useIntl } from 'react-intl';

export function ChapterLaneSkeleton() {
  return (
    <Box
      sx={{
        backgroundColor: theme.common.inputBackground,
        padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
      }}
    >
      <Typography>
        <Skeleton animation="wave" sx={{ width: theme.spacing(10) }} />
      </Typography>
      <Typography>
        <Skeleton animation="wave" sx={{ width: theme.spacing(50) }} />
      </Typography>
    </Box>
  );
}

export default function ChapterLane({
  chapter: { chapter_position: cn, chapter_title: ct },
  chapter: c,
  isChapter,
  setActiveChapter,
}: {
  isChapter: boolean;
  chapter: Chapter;
  setActiveChapter: (chapter: Chapter) => void;
}) {
  const { formatMessage } = useIntl();

  return (
    <Box
      sx={{
        cursor: 'pointer',
        display: 'grid',
        alignItems: 'center',
        backgroundColor: lighten(theme.palette.primary.main, 0.95),
        padding: `${theme.spacing(0.5)} ${theme.spacing(2)}`,
        transition: '0.2s',
        '&:hover': {
          backgroundColor: lighten(theme.palette.primary.main, 0.9),
          transition: '0.2s',
        },
      }}
      onClick={() => setActiveChapter(c)}
    >
      <Typography
        sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
      >{`${formatMessage({
        id: isChapter ? 'part' : 'chapter',
      })} ${cn}`}</Typography>
      <Typography>{ct}</Typography>
    </Box>
  );
}
