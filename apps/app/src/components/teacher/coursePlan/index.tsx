import { ExpandMore, ReportRounded } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  lighten,
  Skeleton,
  Typography,
} from '@mui/material';
import { ConfirmDeleteDialog } from '@squoolr/dialogTransition';
import { Chapter, Course, Ressource } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import { RowMenu } from '../../coordinator/CreditUnitLane';
import ChapterDialog from './chapterDialog';
import ChapterLane, { ChapterLaneSkeleton } from './chapterLane';

export default function CoursePlan() {
  //fetch ressources
  const { formatMessage } = useIntl();
  const { annual_credit_unit_subject_id } = useParams();

  const [course, setCourse] = useState<Course>();
  const [isCourseLoading, setIsCourseLoading] = useState<boolean>(false);
  const [courseNotif, setCourseNotif] = useState<useNotification>();

  const loadCourse = () => {
    setIsCourseLoading(true);
    const notif = new useNotification();
    if (courseNotif) {
      courseNotif.dismiss();
    }
    setCourseNotif(notif);
    setTimeout(() => {
      //TODO: call api here to load course using data annual_credit_unit_subject_id
      if (6 > 5) {
        const newCourse: Course = {
          annual_credit_unit_subject_id: 'siels',
          classroomAcronyms: ['irt', 'imb', 'isst', 'isss'],
          has_course_plan: false,
          is_ca_available: false,
          is_exam_available: false,
          is_resit_available: false,
          objective:
            'Make it rain in all directions. this is the way to make it shine',
          subject_code: 'UUIDv4',
          subject_title: 'Advanced History',
        };
        setCourse(newCourse);
        setIsCourseLoading(false);
        notif.dismiss();
        setCourseNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingCourse' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadCourse}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'getCourseFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [areChaptersLoading, setAreChaptersLoading] = useState<boolean>(false);
  const [chapterNotif, setChapterNotif] = useState<useNotification>();

  const loadChapters = () => {
    if (course) {
      setAreChaptersLoading(true);
      const notif = new useNotification();
      if (chapterNotif) {
        chapterNotif.dismiss();
      }
      setChapterNotif(notif);
      setTimeout(() => {
        //TODO: call api here to load course using data annual_credit_unit_subject_id
        if (6 > 5) {
          const newChapters: Chapter[] = [
            {
              annual_credit_unit_subject_id: 'lsie',
              chapter_id: 'isoes',
              chapter_objective: 'Things shall make it rain trust me',
              chapter_title: 'Introduction to Cameroon history',
              chapter_number: 1,
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
                retryFunction={loadChapters}
                notification={notif}
                //TODO: message should come from backend
                message={formatMessage({ id: 'getChaptersFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    }
  };

  const [ressources, setRessources] = useState<Ressource[]>([]);
  const [areRessourcesLoading, setAreRessourcesLoading] =
    useState<boolean>(false);
  const [ressourceNotif, setRessourceNotif] = useState<useNotification>();

  const loadRessources = () => {
    if (course) {
      setAreRessourcesLoading(true);
      const notif = new useNotification();
      if (ressourceNotif) {
        ressourceNotif.dismiss();
      }
      setRessourceNotif(notif);
      setTimeout(() => {
        //TODO: call api here to load course using data annual_credit_unit_subject_id
        if (6 > 5) {
          const newRessources: Ressource[] = [];
          setRessources(newRessources);
          setAreRessourcesLoading(false);
          notif.dismiss();
          setRessourceNotif(undefined);
        } else {
          notif.notify({
            render: formatMessage({ id: 'loadingRessources' }),
          });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={loadRessources}
                notification={notif}
                //TODO: message should come from backend
                message={formatMessage({ id: 'getRessourcesFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    }
  };

  useEffect(() => {
    loadCourse();
    return () => {
      //TODO: CLEANUP AXIOS CALL ABOVE
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadChapters();
    loadRessources();
    return () => {
      //TODO: CLEANUP AXIOS CALLS ABOVE
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [
    isConfirmDeleteChapterDialogOpen,
    setIsConfirmDeleteChapterDialogOpen,
  ] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [actionnedChapter, setActionnedChapter] = useState<Chapter>();

  const [isSubmittingChapter, setIsSubmittingChapter] =
    useState<boolean>(false);

  const deleteChapter = (chapter: Chapter) => {
    if (actionnedChapter) {
      setIsSubmittingChapter(true);
      const notif = new useNotification();
      if (chapterNotif) chapterNotif.dismiss();
      setChapterNotif(notif);
      notif.notify({ render: formatMessage({ id: 'deletingChapter' }) });
      setTimeout(() => {
        //TODO: call api here to delete chapter
        if (6 > 5) {
          setChapters(
            chapters.filter(
              ({ chapter_id: c_id }) => c_id !== chapter.chapter_id
            )
          );
          setIsSubmittingChapter(false);
          notif.dismiss();
          setChapterNotif(undefined);
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => deleteChapter(chapter)}
                notification={notif}
                //TODO: message should come from backend
                message={formatMessage({ id: 'deleteChapterFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    }
  };

  const manageChapter = (chapter: Chapter) => {
    setIsSubmittingChapter(true);
    const notif = new useNotification();
    if (chapterNotif) chapterNotif.dismiss();
    setChapterNotif(notif);
    notif.notify({
      render: formatMessage({
        id: chapter.chapter_id === '' ? 'creatingChapter' : 'editingChapter',
      }),
    });
    if (chapter.chapter_id === '') {
      setTimeout(() => {
        //TODO: call api here to create chapter with data (chapter as CreateChapter)
        if (6 > 5) {
          const newChapter: Chapter = { ...chapter, chapter_id: 'sie' };
          setChapters([...chapters, newChapter]);
          setIsSubmittingChapter(false);
          notif.dismiss();
          setChapterNotif(undefined);
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => manageChapter(chapter)}
                notification={notif}
                //TODO: message should come from backend
                message={formatMessage({ id: 'createChapterFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    } else {
      setTimeout(() => {
        //TODO: call api here to edit chapter with data chapter.chapter_id
        if (6 > 5) {
          setChapters(
            chapters.map((chptr) => {
              if (chptr.chapter_id === chapter.chapter_id) return chapter;
              return chptr;
            })
          );
          setIsSubmittingChapter(false);
          notif.dismiss();
          setChapterNotif(undefined);
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => manageChapter(chapter)}
                notification={notif}
                //TODO: message should come from backend
                message={formatMessage({ id: 'editChapterFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    }
  };

  return (
    <>
      <RowMenu
        anchorEl={anchorEl}
        closeMenu={() => setAnchorEl(null)}
        deleteItem={() => setIsConfirmDeleteChapterDialogOpen(true)}
        editItem={() => setIsEditDialogOpen(true)}
      />
      <ChapterDialog
        closeDialog={() => {
          setIsEditDialogOpen(false);
          setActionnedChapter(undefined);
        }}
        estimatedChapterNumber={chapters.length + 1}
        isDialogOpen={isEditDialogOpen}
        editableChapter={actionnedChapter}
        handleSubmit={manageChapter}
      />
      <ConfirmDeleteDialog
        closeDialog={() => setIsConfirmDeleteChapterDialogOpen(false)}
        confirm={() =>
          actionnedChapter ? deleteChapter(actionnedChapter) : null
        }
        dialogMessage="confirmDeleteChapterMessage"
        isDialogOpen={isConfirmDeleteChapterDialogOpen}
      />
      <Box sx={{ height: '100%' }}>
        <Box>
          <Typography variant="h6">
            {course ? (
              `${formatMessage({ id: 'chapterTitle' })}: ${
                course.subject_title
              }`
            ) : (
              <Skeleton animation="wave" />
            )}
          </Typography>
        </Box>
        <Box
          sx={{
            height: '100%',
            display: 'grid',
            rowGap: theme.spacing(2),
            gridTemplateRows: 'auto auto auto 1fr',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              justifyContent: 'start',
              columnGap: theme.spacing(1),
              marginTop: theme.spacing(2),
            }}
          >
            {course
              ? course.classroomAcronyms.map((val, key) => (
                  <Chip label={val} key={key} size="small" />
                ))
              : [...new Array(5)].map((_, index) => (
                  <Chip
                    label={
                      <Skeleton
                        animation="wave"
                        sx={{ minWidth: theme.spacing(7) }}
                      />
                    }
                    key={index}
                  />
                ))}
          </Box>
          <Accordion
            elevation={0}
            disableGutters
            sx={{ backgroundColor: lighten(theme.palette.primary.main, 0.9) }}
          >
            <AccordionSummary
              sx={{ minHeight: 'auto' }}
              expandIcon={<ExpandMore />}
            >
              <Typography variant="h6" sx={{ fontWeight: 400 }}>
                {formatMessage({ id: 'courseObjectives' })}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                {course ? course.objective : <Skeleton animation="wave" />}
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            elevation={0}
            disableGutters
            sx={{ backgroundColor: lighten(theme.palette.primary.main, 0.9) }}
          >
            <AccordionSummary
              sx={{ minHeight: 'auto' }}
              expandIcon={<ExpandMore />}
            >
              <Box
                sx={{
                  display: 'grid',
                  justifyContent: 'start',
                  gridAutoFlow: 'column',
                  columnGap: theme.spacing(3),
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 400 }}>
                  {formatMessage({ id: 'courseRessources' })}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ textTransform: 'none' }}
                  disabled={isCourseLoading || areRessourcesLoading}
                >
                  {formatMessage({ id: 'addRessource' })}
                </Button>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                {course ? course.objective : <Skeleton animation="wave" />}
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Box
            sx={{
              height: '100%',
              display: 'grid',
              gridTemplateRows: 'auto 1fr',
              rowGap: theme.spacing(1),
              marginTop: theme.spacing(2),
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                columnGap: theme.spacing(1),
                alignItems: 'end',
              }}
            >
              <Typography variant="h6">
                {formatMessage({ id: 'chapters' })}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="small"
                disabled={isCourseLoading || areChaptersLoading}
                onClick={() => {
                  setIsEditDialogOpen(true);
                  setActionnedChapter(undefined);
                }}
              >
                {formatMessage({ id: 'newChapter' })}
              </Button>
            </Box>
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
              ) : (
                <Box sx={{ display: 'grid', rowGap: theme.spacing(2) }}>
                  {chapters
                    .sort((a, b) =>
                      a.chapter_number > b.chapter_number ? 1 : -1
                    )
                    .map((chapter, index) => (
                      <ChapterLane
                        active={
                          actionnedChapter?.chapter_id === chapter.chapter_id
                        }
                        disabled={isSubmittingChapter}
                        getActionnedChapter={setActionnedChapter}
                        setAnchorEl={setAnchorEl}
                        chapter={chapter}
                        key={index}
                      />
                    ))}
                </Box>
              )}
            </Scrollbars>
          </Box>
        </Box>
      </Box>
    </>
  );
}
