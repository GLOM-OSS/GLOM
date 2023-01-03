import { MoreHorizRounded } from '@mui/icons-material';
import {
  Box,
  IconButton,
  lighten,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import { Chapter } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
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
  chapter: { chapter_number: cn, chapter_title: ct },
  chapter: c,
  disabled,
  active,
  isChapter,
  setAnchorEl,
  getActionnedChapter,
  setActiveChapter,
}: {
  active: boolean;
  isChapter: boolean;
  chapter: Chapter;
  disabled: boolean;
  setAnchorEl: (el: HTMLButtonElement) => void;
  getActionnedChapter: (chapter: Chapter) => void;
  setActiveChapter: (chapter: Chapter) => void;
}) {
  const { formatMessage } = useIntl();

  return (
    <Box
      sx={{
        cursor: 'pointer',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        columnGap: theme.spacing(1),
        alignItems: 'center',
        backgroundColor: lighten(
          theme.palette[active ? 'secondary' : 'primary'].main,
          active ? 0.9 : 0.95
        ),
        padding: `${theme.spacing(0.5)} ${theme.spacing(2)}`,
        transition: '0.2s',
        '&:hover': {
          backgroundColor: lighten(theme.palette.primary.main, 0.9),
          transition: '0.2s',
        },
      }}
      onClick={() => setActiveChapter(c)}
    >
      <Box>
        <Typography
          sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
        >{`${formatMessage({
          id: isChapter ? 'part' : 'chapter',
        })} ${cn}`}</Typography>
        <Typography>{ct}</Typography>
      </Box>
      <Tooltip arrow title={formatMessage({ id: 'more' })}>
        <IconButton
          size="small"
          disabled={disabled}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
            getActionnedChapter(c);
          }}
        >
          <MoreHorizRounded sx={{ fontSize: '24px' }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
