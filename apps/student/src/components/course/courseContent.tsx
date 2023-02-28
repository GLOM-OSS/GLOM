import {
  ExpandMore,
  KeyboardBackspaceOutlined,
  ReportRounded,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Fab,
  lighten,
  Skeleton,
  Typography,
} from '@mui/material';
import {
  getChapterParts,
  getChapterResources,
  getCourseChapters,
  getCourseResources,
} from '@squoolr/api-services';
import { Chapter, Course, Resource } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import ChapterLane, { ChapterLaneSkeleton } from './chapterLaneSkeleton';
import ResourceDisplay from './resourceDisplay';

export default function CourseContent({
  course,
  isCourseLoading,
}: {
  course?: Course;
  isCourseLoading: boolean;
}) {
  const { formatMessage } = useIntl();

  const [activeChapter, setActiveChapter] = useState<Chapter>();

  const [areChaptersLoading, setAreChaptersLoading] = useState<boolean>(true);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapterNotif, setChapterNotif] = useState<useNotification>();

  const loadChapters = (chapter_id?: string) => {
    setAreChaptersLoading(true);
    const notif = new useNotification();
    if (chapterNotif) {
      chapterNotif.dismiss();
    }
    setChapterNotif(notif);
    (chapter_id
      ? getChapterParts(chapter_id)
      : getCourseChapters(course?.annual_credit_unit_subject_id as string)
    )
      .then((chapters) => {
        setChapters(chapters);
        setAreChaptersLoading(false);
        notif.dismiss();
        setChapterNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({
            id: chapter_id ? 'loadingSubChapters' : 'loadingChapters',
          }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadChapters(chapter_id)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({
                  id: chapter_id ? 'getSubChaptersFailed' : 'getChaptersFailed',
                })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  const [areResourcesLoading, setAreResourcesLoading] = useState<boolean>(true);
  const [resources, setResources] = useState<Resource[]>([]);
  const [resourceNotif, setResourceNotif] = useState<useNotification>();

  const loadResources = (chapter_id?: string) => {
    setAreResourcesLoading(true);
    const notif = new useNotification();
    if (resourceNotif) {
      resourceNotif.dismiss();
    }
    setResourceNotif(notif);
    (chapter_id
      ? getChapterResources(chapter_id)
      : getCourseResources(course?.annual_credit_unit_subject_id as string)
    )
      .then((resources) => {
        setResources(resources);
        setAreResourcesLoading(false);
        notif.dismiss();
        setResourceNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({
            id: chapter_id
              ? 'loadingChapterResources'
              : 'loadingCourseResources',
          }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadResources(chapter_id)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({
                  id: chapter_id
                    ? 'getChapterResourcesFailed'
                    : 'getResourcesFailed',
                })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    if (course) {
      loadChapters(activeChapter?.chapter_id);
      loadResources(activeChapter?.chapter_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChapter, course]);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '3fr 1fr',
        columnGap: 2,
      }}
    >
      <Box
        sx={{
          height: '100%',
          paddingRight: 2,
          borderRight: `1px solid ${theme.common.line}`,
          display: 'grid',
          rowGap: 2,
          gridTemplateRows: 'auto auto auto 1fr',
        }}
      >
        {activeChapter && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              columnGap: 1,
              alignItems: 'center',
              marginTop: 2,
            }}
          >
            <Fab
              color="primary"
              aria-label={formatMessage({ id: 'back' })}
              size="small"
              onClick={() => setActiveChapter(undefined)}
            >
              <KeyboardBackspaceOutlined fontSize="small" />
            </Fab>
            <Typography variant="h6">
              {`${formatMessage({
                id: 'chapterTitle',
              })}: ${activeChapter.chapter_title}`}
            </Typography>
          </Box>
        )}
        <Accordion
          elevation={0}
          disableGutters
          sx={{ backgroundColor: lighten(theme.palette.primary.main, 0.9) }}
        >
          <AccordionSummary
            sx={{ minHeight: 'auto' }}
            expandIcon={<ExpandMore />}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 500, fontSize: '1.125rem' }}
            >
              {formatMessage({
                id: activeChapter ? 'chapterObjectives' : 'courseObjectives',
              })}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              {course ? (
                activeChapter ? (
                  activeChapter.chapter_objective
                ) : (
                  course.objective
                )
              ) : (
                <Skeleton animation="wave" />
              )}
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Typography variant="h6">
          {formatMessage({
            id: activeChapter ? 'chapterParts' : 'chapters',
          })}
        </Typography>
        <Scrollbars autoHide>
          {isCourseLoading || areChaptersLoading ? (
            <Box sx={{ display: 'grid', rowGap: theme.spacing(2) }}>
              {[...new Array(10)].map((_, index) => (
                <ChapterLaneSkeleton key={index} />
              ))}
            </Box>
          ) : !course ? (
            <Typography sx={{ textAlign: 'center' }}>
              {formatMessage({ id: 'correspondingCourseNotFound' })}
            </Typography>
          ) : chapters.length === 0 ? (
            <Typography
              variant="h6"
              sx={{ fontWeight: '400', fontSize: '1.125rem' }}
            >
              {formatMessage({
                id: activeChapter ? 'noChapterPartsYet' : 'noCourseChaptersYet',
              })}
            </Typography>
          ) : (
            <Box sx={{ display: 'grid', rowGap: theme.spacing(2) }}>
              {chapters
                .sort((a, b) =>
                  a.chapter_position > b.chapter_position ? 1 : -1
                )
                .map((chapter, index) => (
                  <ChapterLane
                    setActiveChapter={setActiveChapter}
                    isChapter={Boolean(activeChapter)}
                    chapter={chapter}
                    key={index}
                  />
                ))}
            </Box>
          )}
        </Scrollbars>
      </Box>
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          rowGap: 2,
        }}
      >
        <Typography variant="h5" textAlign="center">
          {formatMessage({
            id: activeChapter ? 'chapterResources' : 'courseResources',
          })}
        </Typography>
        <ResourceDisplay
          areResourcesLoading={areResourcesLoading}
          resources={resources}
        />
      </Box>
    </Box>
  );
}
