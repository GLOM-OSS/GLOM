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
import {
  Chapter,
  Course,
  CreateChapter,
  CreateFile,
  CreateLink,
  Resource,
} from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import { RowMenu } from '../../coordinator/CreditUnitLane';
import ChapterDialog from './chapterDialog';
import ChapterLane, { ChapterLaneSkeleton } from './chapterLane';
import FileDialog from './fileDialog';
import ResourceDialog from './resourceDialog';

export default function CoursePlan() {
  //fetch resources
  const { formatMessage } = useIntl();
  const { annual_credit_unit_subject_id } = useParams();

  const [activeChapter, setActiveChapter] = useState<Chapter>();

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
    if (course && !activeChapter) {
      setChapters([]);
      setAreChaptersLoading(true);
      const notif = new useNotification();
      if (chapterNotif) {
        chapterNotif.dismiss();
      }
      setChapterNotif(notif);
      setTimeout(() => {
        //TODO: call api here to load course chapters using data annual_credit_unit_subject_id
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
    } else if (activeChapter) {
      setChapters([]);
      setAreChaptersLoading(true);
      const notif = new useNotification();
      if (chapterNotif) {
        chapterNotif.dismiss();
      }
      setChapterNotif(notif);
      setTimeout(() => {
        //TODO: call api here to load chapter pars using data activeChapter.chapter_id
        if (6 > 5) {
          const newChapters: Chapter[] = [
            {
              annual_credit_unit_subject_id: 'lsies',
              chapter_id: 'isoesd',
              chapter_objective: 'Things shall make it rain trust me',
              chapter_title: 'Introduction to Cameroon Biology',
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

  const [resources, setResources] = useState<Resource[]>([]);
  const [areResourcesLoading, setAreResourcesLoading] =
    useState<boolean>(false);
  const [resourceNotif, setResourceNotif] = useState<useNotification>();

  const loadResources = () => {
    if (course && !activeChapter) {
      setResources([]);
      setAreResourcesLoading(true);
      const notif = new useNotification();
      if (resourceNotif) {
        resourceNotif.dismiss();
      }
      setResourceNotif(notif);
      setTimeout(() => {
        //TODO: call api here to load course resources using data annual_credit_unit_subject_id
        if (6 > 5) {
          const newResources: Resource[] = [];
          setResources(newResources);
          setAreResourcesLoading(false);
          notif.dismiss();
          setResourceNotif(undefined);
        } else {
          notif.notify({
            render: formatMessage({ id: 'loadingResources' }),
          });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={loadResources}
                notification={notif}
                //TODO: message should come from backend
                message={formatMessage({ id: 'getResourcesFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    } else if (activeChapter) {
      setResources([]);
      setAreResourcesLoading(true);
      const notif = new useNotification();
      if (resourceNotif) {
        resourceNotif.dismiss();
      }
      setResourceNotif(notif);
      setTimeout(() => {
        //TODO: call api here to load chapter resources using data activeChapter.chapter_id
        if (6 > 5) {
          const newResources: Resource[] = [];
          setResources(newResources);
          setAreResourcesLoading(false);
          notif.dismiss();
          setResourceNotif(undefined);
        } else {
          notif.notify({
            render: formatMessage({ id: 'loadingResources' }),
          });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={loadResources}
                notification={notif}
                //TODO: message should come from backend
                message={formatMessage({ id: 'getResourcesFailed' })}
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
    loadResources();
    return () => {
      //TODO: CLEANUP AXIOS CALLS ABOVE
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, activeChapter]);

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
          notif.update({
            render: formatMessage({ id: 'chapterDeletedSuccessfully' }),
          });
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
        const submitData: CreateChapter = {
          ...(chapter as CreateChapter),
          chapter_parent_id: activeChapter ? activeChapter.chapter_id : '',
        };
        //TODO: call api here to create chapter with data submitData
        if (6 > 5) {
          const newChapter: Chapter = { ...chapter, chapter_id: 'sie' };
          setChapters([...chapters, newChapter]);
          setIsSubmittingChapter(false);
          notif.update({
            render: formatMessage({ id: 'chapterCreatedSuccessfully' }),
          });
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
          notif.update({
            render: formatMessage({ id: 'chapterEditedSuccessfully' }),
          });
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

  const [isCreatingLink, setIsCreatingLink] = useState<boolean>(false);

  const createLink = (link: CreateLink) => {
    setIsCreatingLink(true);
    const notif = new useNotification();
    if (chapterNotif) chapterNotif.dismiss();
    setResourceNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'creatingLink',
      }),
    });
    setTimeout(() => {
      //TODO: call api here to create link
      if (6 > 5) {
        const newLink: Resource = {
          ...link,
          resource_extension: null,
          resource_id: 'eisl',
          resource_type: 'LINK',
        };
        setResources([...resources, newLink]);
        setIsCreatingLink(false);
        notif.update({
          render: formatMessage({ id: 'LinkCreatedSuccessfully' }),
        });
        setResourceNotif(undefined);
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => createLink(link)}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'createLinkFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [isCreatingFiles, setIsCreatingFiles] = useState<boolean>(false);

  const createFiles = (files: CreateFile) => {
    setIsCreatingFiles(true);
    const notif = new useNotification();
    if (chapterNotif) chapterNotif.dismiss();
    setResourceNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'creatingFiles',
      }),
    });
    setTimeout(() => {
      //TODO: call api here to create link
      if (6 > 5) {
        //TODO: FILES SHOULD COME BACK FROM THE BACKEND AFTER CREATION
        const newResource: Resource = {
          annual_credit_unit_subject_id:
            files.details.annual_credit_unit_subject_id,
          chapter_id: files.details.chapter_id,
          resource_name: 'Making it rain',
          resource_ref: 'tesing things',
          resource_extension: '.pdf',
          resource_id: 'eisl',
          resource_type: 'FILE',
        };
        setResources([newResource, ...resources]);
        setIsCreatingFiles(false);
        notif.update({
          render: formatMessage({ id: 'filesCreatedSuccessfully' }),
        });
        setResourceNotif(undefined);
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => createFiles(files)}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'createFilesFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState<boolean>(false);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState<boolean>(false);

  return (
    <>
      <RowMenu
        anchorEl={anchorEl}
        closeMenu={() => setAnchorEl(null)}
        deleteItem={() => setIsConfirmDeleteChapterDialogOpen(true)}
        editItem={() => setIsEditDialogOpen(true)}
      />
      <ResourceDialog
        chapter_id={activeChapter ? activeChapter.chapter_id : null}
        closeDialog={() => setIsLinkDialogOpen(false)}
        isDialogOpen={isLinkDialogOpen}
        openFileDialog={() => {
          setIsLinkDialogOpen(false);
          setIsFileDialogOpen(true);
        }}
        handleSubmit={createLink}
      />
      <FileDialog
        chapter_id={activeChapter ? activeChapter.chapter_id : null}
        closeDialog={() => setIsFileDialogOpen(false)}
        isDialogOpen={isFileDialogOpen}
        openFileDialog={() => {
          setIsLinkDialogOpen(true);
          setIsFileDialogOpen(false);
        }}
        handleSubmit={createFiles}
      />
      <ChapterDialog
        isChapter={Boolean(activeChapter)}
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
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: activeChapter ? 'auto 1fr' : '1fr',
            columnGap: theme.spacing(2),
            alignItems: 'end',
            justifyItems: 'start',
          }}
        >
          {activeChapter && (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              sx={{ textTransform: 'none' }}
              onClick={() => setActiveChapter(undefined)}
            >
              {formatMessage({ id: 'back' })}
            </Button>
          )}
          <Typography variant="h6">
            {course ? (
              `${formatMessage({
                id: activeChapter ? 'chapterTitle' : 'courseTitle',
              })}: ${
                activeChapter
                  ? activeChapter.chapter_title
                  : course.subject_title
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
            {activeChapter
              ? null
              : course
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
                  {formatMessage({
                    id: activeChapter ? 'chapterResources' : 'courseResources',
                  })}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ textTransform: 'none' }}
                  onClick={() => {
                    setIsFileDialogOpen(false);
                    setIsLinkDialogOpen(true);
                  }}
                  disabled={
                    isCourseLoading ||
                    areResourcesLoading ||
                    isCreatingLink ||
                    isCreatingFiles
                  }
                >
                  {formatMessage({ id: 'addResource' })}
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
                sx={{ textTransform: 'none' }}
                disabled={isCourseLoading || areChaptersLoading}
                onClick={() => {
                  setIsEditDialogOpen(true);
                  setActionnedChapter(undefined);
                }}
              >
                {formatMessage({
                  id: activeChapter ? 'newPart' : 'newChapter',
                })}
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
                        setActiveChapter={setActiveChapter}
                        isChapter={Boolean(activeChapter)}
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
