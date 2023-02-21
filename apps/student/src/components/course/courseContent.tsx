import { ExpandMore, ReportRounded } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  lighten,
  Skeleton,
  Typography,
} from '@mui/material';
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
    setTimeout(() => {
      if (course && !chapter_id) {
        //TODO: CALL API HERE TO LOAD course chapters
        // eslint-disable-next-line no-constant-condition
        if (5 > 4) {
          const newChapters: Chapter[] = [
            {
              annual_credit_unit_subject_id: 'lsiels',
              chapter_id: 'siesl',
              chapter_objective: 'Make it rain oooo',
              chapter_position: 1,
              chapter_title: 'Intro to course',
            },
          ];
          setChapters(newChapters);
          setAreChaptersLoading(false);
          notif.dismiss();
          setChapterNotif(undefined);
        } else {
          notif.notify({
            render: formatMessage({ id: 'loadingChapters' }),
          });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => loadChapters(chapter_id)}
                notification={notif}
                //TODO: message should come from backend
                message={formatMessage({ id: 'getChaptersFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      } else if (course && chapter_id) {
        //TODO: CALL API HERE TO LOAD chapter subchapters
        // eslint-disable-next-line no-constant-condition
        if (5 > 4) {
          const newChapters: Chapter[] = [];
          setChapters(newChapters);
          setAreChaptersLoading(false);
          notif.dismiss();
          setChapterNotif(undefined);
        } else {
          notif.notify({
            render: formatMessage({ id: 'loadingSubChapters' }),
          });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => loadChapters(chapter_id)}
                notification={notif}
                //TODO: message should come from backend
                message={formatMessage({ id: 'getSubChaptersFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }
    }, 3000);
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
    setTimeout(() => {
      if (course && !chapter_id) {
        //TODO: CALL API HERE TO LOAD course resources
        // eslint-disable-next-line no-constant-condition
        if (5 > 4) {
          const newResources: Resource[] = [
            {
              annual_credit_unit_subject_id: 'sleoe',
              chapter_id: 'wieol',
              resource_extension: '.pdf',
              resource_id: 'iwoe',
              resource_name: 'Boston riely',
              resource_ref: 'https://squoolr.com',
              resource_type: 'FILE',
            },
            {
              annual_credit_unit_subject_id: 'sleoe',
              chapter_id: 'wieol',
              resource_extension: '.pdf',
              resource_id: 'iwoe',
              resource_name: 'Boston',
              resource_ref: 'https://squoolr.com',
              resource_type: 'LINK',
            },
            {
              annual_credit_unit_subject_id: 'sleoe',
              chapter_id: 'wieol',
              resource_extension: '.docx',
              resource_id: 'iwoe',
              resource_name: "Introduction a l'algorithmique",
              resource_ref: 'https://squoolr.com',
              resource_type: 'FILE',
            },
            {
              annual_credit_unit_subject_id: 'sleoe',
              chapter_id: 'wieol',
              resource_extension: '.docx',
              resource_id: 'iwoe',
              resource_name: "Introduction a l'algorithmique",
              resource_ref: 'https://squoolr.com',
              resource_type: 'FILE',
            },
          ];
          setResources(newResources);
          setAreResourcesLoading(false);
          notif.dismiss();
          setResourceNotif(undefined);
        } else {
          notif.notify({
            render: formatMessage({ id: 'loadingCourseResources' }),
          });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => loadResources(chapter_id)}
                notification={notif}
                //TODO: message should come from backend
                message={formatMessage({ id: 'getResourcesFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      } else if (course && chapter_id) {
        //TODO: CALL API HERE TO LOAD chapter resources
        // eslint-disable-next-line no-constant-condition
        if (5 > 4) {
          const newResources: Resource[] = [];
          setResources(newResources);
          setAreResourcesLoading(false);
          notif.dismiss();
          setResourceNotif(undefined);
        } else {
          notif.notify({
            render: formatMessage({ id: 'loadingChapterResources' }),
          });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => loadResources(chapter_id)}
                notification={notif}
                //TODO: message should come from backend
                message={formatMessage({ id: 'getChapterResourcesFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }
    }, 3000);
  };

  useEffect(() => {
    loadChapters(activeChapter ? activeChapter.chapter_id : undefined);
    loadResources(activeChapter ? activeChapter.chapter_id : undefined);
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
            <Button
              variant="outlined"
              color="primary"
              size="small"
              sx={{ textTransform: 'none' }}
              onClick={() => setActiveChapter(undefined)}
            >
              {formatMessage({ id: 'back' })}
            </Button>
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
