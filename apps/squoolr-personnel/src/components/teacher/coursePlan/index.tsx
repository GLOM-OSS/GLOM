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
  Button,
  Chip,
  Fab,
  lighten,
  Skeleton,
  Typography,
} from '@mui/material';
import {
  addNewFileResources,
  addNewLinkResource,
  createNewChapter,
  deleteChapter,
  deleteResource,
  getChapterParts,
  getChapterResources,
  getCourse,
  getCourseChapters,
  getCourseResources,
  updateChapter,
} from '@squoolr/api-services';
import { ConfirmDeleteDialog } from '@squoolr/confirm-dialogs';
import {
  Chapter,
  Course,
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
import FileDialog, { FileIcon } from './fileDialog';
import FileDisplayDialog, { readableFileFormats } from './fileDisplayDialog';
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
    getCourse(annual_credit_unit_subject_id as string)
      .then((course) => {
        setCourse(course);
        setIsCourseLoading(false);
        notif.dismiss();
        setCourseNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingCourse' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadCourse}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getCourseFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
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
      getCourseChapters(annual_credit_unit_subject_id as string)
        .then((chapters) => {
          setChapters(chapters);
          setAreChaptersLoading(false);
          notif.dismiss();
          setChapterNotif(undefined);
        })
        .catch((error) => {
          notif.notify({
            render: formatMessage({ id: 'loadingChapters' }),
          });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={loadChapters}
                notification={notif}
                message={
                  error?.message || formatMessage({ id: 'getChaptersFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        });
    } else if (activeChapter) {
      setChapters([]);
      setAreChaptersLoading(true);
      const notif = new useNotification();
      if (chapterNotif) {
        chapterNotif.dismiss();
      }
      setChapterNotif(notif);
      getChapterParts(actionnedChapter?.chapter_id as string)
        .then((chapters) => {
          setChapters(chapters);
          setAreChaptersLoading(false);
          notif.dismiss();
          setChapterNotif(undefined);
        })
        .catch((error) => {
          notif.notify({
            render: formatMessage({ id: 'loadingChapters' }),
          });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={loadChapters}
                notification={notif}
                message={
                  error?.message || formatMessage({ id: 'getChaptersFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        });
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
      getCourseResources(annual_credit_unit_subject_id as string)
        .then((resources) => {
          setResources(resources);
          setAreResourcesLoading(false);
          notif.dismiss();
          setResourceNotif(undefined);
        })
        .catch((error) => {
          notif.notify({
            render: formatMessage({ id: 'loadingResources' }),
          });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={loadResources}
                notification={notif}
                message={
                  error?.message || formatMessage({ id: 'getResourcesFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        });
    } else if (activeChapter) {
      setResources([]);
      setAreResourcesLoading(true);
      const notif = new useNotification();
      if (resourceNotif) {
        resourceNotif.dismiss();
      }
      setResourceNotif(notif);
      getChapterResources(activeChapter?.chapter_id as string)
        .then((resources) => {
          setResources(resources);
          setAreResourcesLoading(false);
          notif.dismiss();
          setResourceNotif(undefined);
        })
        .catch((error) => {
          notif.notify({
            render: formatMessage({ id: 'loadingResources' }),
          });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={loadResources}
                notification={notif}
                message={
                  error?.message || formatMessage({ id: 'getResourcesFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        });
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

  const deleteChapterHandler = (chapter: Chapter) => {
    if (actionnedChapter) {
      setIsSubmittingChapter(true);
      const notif = new useNotification();
      if (chapterNotif) chapterNotif.dismiss();
      setChapterNotif(notif);
      notif.notify({ render: formatMessage({ id: 'deletingChapter' }) });
      deleteChapter(chapter.chapter_id)
        .then(() => {
          setChapters(
            chapters.filter(
              ({ chapter_id: c_id }) => c_id !== chapter.chapter_id
            )
          );
          notif.update({
            render: formatMessage({ id: 'chapterDeletedSuccessfully' }),
          });
          setChapterNotif(undefined);
        })
        .catch((error) => {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => deleteChapterHandler(chapter)}
                notification={notif}
                message={
                  error?.message || formatMessage({ id: 'deleteChapterFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        })
        .finally(() => setIsSubmittingChapter(false));
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
      const { chapter_id, ...submitData } = {
        ...chapter,
        chapter_parent_id: activeChapter ? activeChapter.chapter_id : undefined,
      };
      createNewChapter(submitData)
        .then((chapter) => {
          setChapters([...chapters, chapter]);
          notif.update({
            render: formatMessage({ id: 'chapterCreatedSuccessfully' }),
          });
          setChapterNotif(undefined);
        })
        .catch((error) => {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => manageChapter(chapter)}
                notification={notif}
                message={
                  error?.message || formatMessage({ id: 'createChapterFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        })
        .finally(() => setIsSubmittingChapter(false));
    } else {
      updateChapter(chapter.chapter_id, chapter)
        .then(() => {
          setChapters(
            chapters.map((chptr) => {
              if (chptr.chapter_id === chapter.chapter_id) return chapter;
              return chptr;
            })
          );
          notif.update({
            render: formatMessage({ id: 'chapterEditedSuccessfully' }),
          });
          setChapterNotif(undefined);
        })
        .catch((error) => {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => manageChapter(chapter)}
                notification={notif}
                message={
                  error?.message || formatMessage({ id: 'editChapterFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        })
        .finally(() => setIsSubmittingChapter(false));
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
    addNewLinkResource(link)
      .then((resourceLink) => {
        setResources([...resources, resourceLink]);
        setIsCreatingLink(false);
        notif.update({
          render: formatMessage({ id: 'LinkCreatedSuccessfully' }),
        });
        setResourceNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => createLink(link)}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'createLinkFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
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
    addNewFileResources(files)
      .then((newResources) => {
        setResources([...newResources, ...resources]);
        notif.update({
          render: formatMessage({ id: 'filesCreatedSuccessfully' }),
        });
        setResourceNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => createFiles(files)}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'createFilesFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsCreatingFiles(false));
  };
  const [isDeletingResource, setIsDeletingResource] = useState<boolean>(false);

  const deleteResourceHandler = (resource: Resource) => {
    setIsDeletingResource(true);
    const notif = new useNotification();
    if (chapterNotif) chapterNotif.dismiss();
    setResourceNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'deletingResource',
      }),
    });
    deleteResource(resource.resource_id)
      .then(() => {
        setResources(
          resources.filter(
            ({ resource_id: r_id }) => r_id !== resource.resource_id
          )
        );
        notif.update({
          render: formatMessage({ id: 'resourceDeletedSuccessfully' }),
        });
        setResourceNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => deleteResourceHandler(resource)}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'deleteResourceFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsDeletingResource(false));
  };

  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState<boolean>(false);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState<boolean>(false);
  const [
    isConfirmDeleteResourceDialogOpen,
    setIsConfirmDeleteResourceDialogOpen,
  ] = useState<boolean>(false);
  const [activeResource, setActiveResource] = useState<Resource>();
  const [displayFile, setDisplayFile] = useState<number>();

  const downloadFile = ({
    resource_name: rn,
    resource_extension: re,
    resource_ref: rr,
  }: Resource) => {
    const link = document.createElement('a');
    link.href = rr;
    link.setAttribute('download', `${rn}.${re}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  return (
    <>
      {/* <img
        src="http://localhost:8080/202309185818_186_summary.png"
        alt="Resource Alt"
      /> */}
      <RowMenu
        anchorEl={anchorEl}
        closeMenu={() => setAnchorEl(null)}
        deleteItem={() => setIsConfirmDeleteChapterDialogOpen(true)}
        editItem={() => setIsEditDialogOpen(true)}
      />
      {displayFile !== undefined && (
        <FileDisplayDialog
          closeDialog={() => setDisplayFile(undefined)}
          isDialogOpen={displayFile !== undefined}
          resources={resources}
          activeResource={displayFile}
        />
      )}
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
          actionnedChapter ? deleteChapterHandler(actionnedChapter) : null
        }
        dialogMessage="confirmDeleteChapterMessage"
        isDialogOpen={isConfirmDeleteChapterDialogOpen}
      />
      <ConfirmDeleteDialog
        closeDialog={() => {
          setActiveResource(undefined);
          setIsConfirmDeleteResourceDialogOpen(false);
        }}
        confirm={() =>
          activeResource ? deleteResourceHandler(activeResource) : null
        }
        dialogMessage="confirmDeleteResourceMessage"
        isDialogOpen={isConfirmDeleteResourceDialogOpen}
        dialogTitle="deleteResource"
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
            <Fab
              color="primary"
              aria-label={formatMessage({ id: 'back' })}
              size="small"
              onClick={() => setActiveChapter(undefined)}
            >
              <KeyboardBackspaceOutlined fontSize="small" />
            </Fab>
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
              <Skeleton animation="wave" sx={{ minWidth: '150px' }} />
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
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 500, fontSize: '1.125rem' }}
                >
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
                    isCreatingFiles ||
                    isDeletingResource
                  }
                >
                  {formatMessage({ id: 'addResource' })}
                </Button>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {areResourcesLoading || isCourseLoading ? (
                <Scrollbars autoHide style={{ height: '75px' }}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridAutoFlow: 'column',
                      columnGap: theme.spacing(2),
                      justifyContent: 'start',
                    }}
                  >
                    {[...new Array(10)].map((_, index) => (
                      <Skeleton
                        variant="rectangular"
                        height="85px"
                        width="100px"
                        animation="wave"
                      />
                    ))}
                  </Box>
                </Scrollbars>
              ) : resources.length === 0 ? (
                <Typography sx={{ fontWeight: '400', fontSize: '1.125rem' }}>
                  {formatMessage({
                    id: activeChapter
                      ? 'noChapterResourcesYet'
                      : 'noCourseResourcesYet',
                  })}
                </Typography>
              ) : (
                <Scrollbars autoHide style={{ height: '75px' }}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridAutoFlow: 'column',
                      columnGap: theme.spacing(2),
                      justifyContent: 'start',
                    }}
                  >
                    {resources.map((resource, index) => {
                      const {
                        resource_name: rn,
                        resource_extension: re,
                        resource_type: rt,
                        resource_ref: rr,
                      } = resource;
                      return (
                        <FileIcon
                          key={index}
                          resource_ref={rr}
                          readFile={
                            rt === 'FILE'
                              ? readableFileFormats.includes(re as string)
                                ? () => setDisplayFile(index)
                                : () => downloadFile(resource)
                              : undefined
                          }
                          name={`${rn}${re ? '.' : ''}${re ?? ''}`}
                          deleteResource={
                            isDeletingResource
                              ? undefined
                              : () => {
                                  setIsConfirmDeleteResourceDialogOpen(true);
                                  setActiveResource(resource);
                                }
                          }
                          resource_type={rt}
                        />
                      );
                    })}
                  </Box>
                </Scrollbars>
              )}
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
                {formatMessage({
                  id: activeChapter ? 'chapterParts' : 'chapters',
                })}
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
              ) : chapters.length === 0 ? (
                <Typography
                  variant="h6"
                  sx={{ fontWeight: '400', fontSize: '1.125rem' }}
                >
                  {formatMessage({
                    id: activeChapter
                      ? 'noChapterPartsYet'
                      : 'noCourseChaptersYet',
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
