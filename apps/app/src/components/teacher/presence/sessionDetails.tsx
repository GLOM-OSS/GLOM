import { ExpandMoreOutlined, ReportRounded } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  lighten,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { MobileDatePicker, TimePicker } from '@mui/x-date-pickers';
import {
  createPresenceList,
  getCourseChapters,
  getCourseStudents,
  getPresenceListDetails,
  reinitialisePresenceList,
  updatePresenceList,
} from '@squoolr/api-services';
import { ConfirmDeleteDialog } from '@squoolr/dialogTransition';
import {
  CreatePresenceList,
  PresenceList,
  PresenceListChapter,
  Student,
  UpdatePresenceList,
} from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import { NoTableElement } from '../courseLane';
import PresenceStudentLane from './presenceStudentLane';

export default function SessionDetails({
  session,
  reset,
  back,
}: {
  session: PresenceList;
  reset: (session?: PresenceList) => void;
  back: () => void;
}) {
  const { formatMessage, formatDate, formatTime } = useIntl();
  const { annual_credit_unit_subject_id } = useParams();

  const [areNotDoneChaptersLoading, setAreNotDoneChaptersLoading] =
    useState<boolean>(false);
  const [notDoneChapters, setNotDoneChapters] = useState<PresenceListChapter[]>(
    []
  );
  const [notDoneChapterNotif, setNotDoneChapterNotif] =
    useState<useNotification>();

  const loadNotDoneChapters = (annual_credit_unit_subject_id: string) => {
    setAreNotDoneChaptersLoading(true);
    const notif = new useNotification();
    if (notDoneChapterNotif) {
      notDoneChapterNotif.dismiss();
    }
    setNotDoneChapterNotif(notif);
    getCourseChapters(annual_credit_unit_subject_id, true)
      .then((chapters) => {
        setNotDoneChapters(chapters);
        setAreNotDoneChaptersLoading(false);
        notif.dismiss();
        setNotDoneChapterNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingNotDoneChapters' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() =>
                loadNotDoneChapters(annual_credit_unit_subject_id)
              }
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'getNotDoneChaptersFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  const [
    {
      presence_list_id: pl_id,
      presence_list_date: pld,
      start_time: s_time,
      end_time: e_time,
      is_published: ip,
      chapters: c,
      students: s,
    },
    setPresenceList,
  ] = useState<PresenceList>(session);
  const [displayStudents, setDisplayStudents] = useState<Student[]>(s);

  const [presenceNotif, setPresenceNotif] = useState<useNotification>();
  const [isPresenceListLoading, setIsPresenceListLoading] =
    useState<boolean>(false);

  const loadPresenceDetails = () => {
    setIsPresenceListLoading(true);
    const notif = new useNotification();
    if (presenceNotif) {
      presenceNotif.dismiss();
    }
    setPresenceNotif(notif);
    if (pl_id !== 'new')
      getPresenceListDetails(pl_id)
        .then((presenceList) => {
          console.log(presenceList);
          setPresenceList(presenceList);
          if (presenceList?.students) setDisplayStudents(presenceList.students);
          setIsPresenceListLoading(false);
          notif.dismiss();
          setPresenceNotif(undefined);
        })
        .catch((error) => {
          notif.notify({
            render: formatMessage({ id: 'loadingPresenceLists' }),
          });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => loadPresenceDetails()}
                notification={notif}
                message={
                  error?.message ||
                  formatMessage({ id: 'getPresenceListsFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        });
  };

  const [areSubjectStudentsLoading, setAreSubjectStudentsLoading] =
    useState<boolean>(false);

  const [subjectStudentNotif, setSubjectStudentNotif] =
    useState<useNotification>();

  const loadSubjectStudents = (annual_credit_unit_subject_id: string) => {
    setAreSubjectStudentsLoading(true);
    const notif = new useNotification();
    if (subjectStudentNotif) {
      subjectStudentNotif.dismiss();
    }
    setSubjectStudentNotif(notif);
    getCourseStudents(annual_credit_unit_subject_id)
      .then((students) => {
        setDisplayStudents(students);
        setAreSubjectStudentsLoading(false);
        notif.dismiss();
        setSubjectStudentNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingStudents' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() =>
                loadSubjectStudents(annual_credit_unit_subject_id)
              }
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'getSubjectStudentsFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    if (annual_credit_unit_subject_id) {
      if (!ip) {
        loadNotDoneChapters(annual_credit_unit_subject_id);
        loadSubjectStudents(annual_credit_unit_subject_id);
      }
      loadPresenceDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annual_credit_unit_subject_id]);

  const [addedChapterIds, setAddedChapterIds] = useState<string[]>([]);
  const [addedStudentIds, setAddedStudentIds] = useState<string[]>([]);
  const [removedChapterIds, setRemovedChapterIds] = useState<string[]>([]);
  const [removedStudentIds, setRemovedStudentIds] = useState<string[]>([]);

  let CL = c.map(({ chapter_id: c_id }) => c_id);
  const selectChapter = (chapter: PresenceListChapter) => {
    if (CL.includes(chapter.chapter_id)) {
      if (removedChapterIds.includes(chapter.chapter_id)) {
        setRemovedChapterIds(
          removedChapterIds.filter((c_id) => c_id !== chapter.chapter_id)
        );
      } else setRemovedChapterIds([...removedChapterIds, chapter.chapter_id]);
    } else {
      if (addedChapterIds.includes(chapter.chapter_id))
        setAddedChapterIds(
          addedChapterIds.filter((c_id) => c_id !== chapter.chapter_id)
        );
      else setAddedChapterIds([...addedChapterIds, chapter.chapter_id]);
    }
  };

  let SL = s.map(({ annual_student_id: as_id }) => as_id);
  const selectStudent = (student: Student) => {
    if (SL.includes(student.annual_student_id)) {
      if (removedStudentIds.includes(student.annual_student_id)) {
        setRemovedStudentIds(
          removedStudentIds.filter(
            (as_id) => as_id !== student.annual_student_id
          )
        );
      } else
        setRemovedStudentIds([...removedStudentIds, student.annual_student_id]);
    } else {
      if (addedStudentIds.includes(student.annual_student_id))
        setAddedStudentIds(
          addedStudentIds.filter((as_id) => as_id !== student.annual_student_id)
        );
      else setAddedStudentIds([...addedStudentIds, student.annual_student_id]);
    }
  };

  const [sessionDate, setSessionDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());

  const [isConfirmReinitialiseDialogOpen, setIsConfirmReinitialiseDialogOpen] =
    useState<boolean>(false);
  const [isConfirmPublishDialogOpen, setIsConfirmPublishDialogOpen] =
    useState<boolean>(false);
  const [isConfirmSaveDialogOpen, setIsConfirmSaveDialogOpen] =
    useState<boolean>(false);

  const [isReinitialising, setIsRenitialising] = useState<boolean>(false);
  const [reinitialiseNotif, setReinitialiseNotif] = useState<useNotification>();

  const reinitialise = (presenceList: UpdatePresenceList) => {
    setIsRenitialising(true);
    const notif = new useNotification();
    if (reinitialiseNotif) {
      reinitialiseNotif.dismiss();
    }
    setReinitialiseNotif(notif);
    notif.notify({
      render: formatMessage({ id: 'reinitialisingPresenceList' }),
    });
    reinitialisePresenceList(pl_id)
      .then(() => {
        setIsRenitialising(false);
        reset();
        setRemovedChapterIds([]);
        setRemovedStudentIds([]);
        CL = [];
        SL = [];
        notif.update({
          render: formatMessage({ id: 'reinitialisePresenceListSuccess' }),
        });
        setReinitialiseNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => reinitialise(presenceList)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'reinitialisePresenceListFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitNotif, setSubmitNotif] = useState<useNotification>();

  const createNewPresenceList = (
    presenceList: CreatePresenceList,
    shouldPublish: boolean
  ) => {
    setIsSubmitting(true);
    const notif = new useNotification();
    if (submitNotif) {
      submitNotif.dismiss();
    }
    setSubmitNotif(notif);
    notif.notify({
      render: formatMessage({
        id: shouldPublish ? 'publishingPresenceList' : 'savingPresenceList',
      }),
    });
    createPresenceList(presenceList)
      .then((newPresenceList) => {
        setIsSubmitting(false);
        setRemovedChapterIds([]);
        setRemovedStudentIds([]);
        reset(newPresenceList);
        notif.update({
          render: formatMessage({
            id: 'createPresenceListSuccess',
          }),
        });
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() =>
                createNewPresenceList(presenceList, shouldPublish)
              }
              notification={notif}
              message={
                error?.message ||
                formatMessage({
                  id: 'createPresenceListFailed',
                })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  const updatePresenceListHandler = (
    presenceList: UpdatePresenceList,
    shouldPublish: boolean
  ) => {
    setIsSubmitting(true);
    const notif = new useNotification();
    if (submitNotif) {
      submitNotif.dismiss();
    }
    setSubmitNotif(notif);
    notif.notify({
      render: formatMessage({
        id: shouldPublish ? 'publishingPresenceList' : 'savingPresenceList',
      }),
    });
    updatePresenceList(pl_id, presenceList, shouldPublish)
      .then(() => {
        setIsSubmitting(false);
        setRemovedChapterIds([]);
        setRemovedStudentIds([]);
        const { end_time, start_time, presence_list_date } = presenceList;
        reset({ ...session, end_time, start_time, presence_list_date });
        notif.update({
          render: formatMessage({
            id: shouldPublish
              ? 'publishPresenceListSuccess'
              : 'savePresenceListSuccess',
          }),
        });
        setSubmitNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() =>
                updatePresenceListHandler(presenceList, shouldPublish)
              }
              notification={notif}
              message={
                error?.message ||
                formatMessage({
                  id: shouldPublish
                    ? 'publishPresenceListFailed'
                    : 'savePresenceListFailed',
                })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  const save = (shouldPublish: boolean, presence_list_id?: string) => {
    if (presence_list_id) {
      const newPresenceList: UpdatePresenceList = {
        addedChapterIds,
        addedStudentIds,
        end_time: endTime,
        presence_list_date: sessionDate,
        removedChapterIds,
        removedStudentIds,
        start_time: startTime,
      };
      updatePresenceListHandler(newPresenceList, shouldPublish);
    } else {
      const newPresenceList: CreatePresenceList = {
        annual_credit_unit_subject_id: String(annual_credit_unit_subject_id),
        chapterIds: addedChapterIds,
        end_time: endTime,
        presence_list_date: sessionDate,
        start_time: startTime,
        studentIds: addedStudentIds,
      };
      createNewPresenceList(newPresenceList, shouldPublish);
    }
  };

  return (
    <>
      <ConfirmDeleteDialog
        dialogMessage={formatMessage({
          id: 'confirmReinitialiseMessagePresenceList',
        })}
        dialogTitle={formatMessage({ id: 'confirmReinitialisePresenceList' })}
        confirmButton={formatMessage({ id: 'reinitialise' })}
        closeDialog={() => setIsConfirmReinitialiseDialogOpen(false)}
        isDialogOpen={isConfirmReinitialiseDialogOpen}
        confirm={() =>
          reinitialise({
            addedChapterIds: [],
            addedStudentIds: [],
            removedChapterIds: CL,
            removedStudentIds: SL,
            end_time: e_time,
            start_time: s_time,
            presence_list_date: pld,
          })
        }
        danger
      />
      <ConfirmDeleteDialog
        dialogMessage={formatMessage({ id: 'confirmSavePresenceListMessage' })}
        dialogTitle={formatMessage({ id: 'confirmSavePresenceList' })}
        confirmButton={formatMessage({ id: 'save' })}
        closeDialog={() => setIsConfirmSaveDialogOpen(false)}
        isDialogOpen={isConfirmSaveDialogOpen}
        confirm={() => {
          if (pl_id !== 'new') save(false, pl_id);
          else save(false, undefined);
        }}
      />
      <ConfirmDeleteDialog
        dialogMessage={formatMessage({
          id: 'confirmPublishPresenceListMessage',
        })}
        dialogTitle={formatMessage({ id: 'confirmPublishPresenceList' })}
        confirmButton={formatMessage({ id: 'publish' })}
        closeDialog={() => setIsConfirmPublishDialogOpen(false)}
        isDialogOpen={isConfirmPublishDialogOpen}
        confirm={() => {
          if (pl_id !== 'new') save(true, pl_id);
          else save(true, undefined);
        }}
      />
      <Box
        sx={{
          display: 'grid',
          rowGap: 2,
          gridTemplateRows: ip ? 'auto 1fr' : 'auto auto 1fr',
        }}
      >
        <Accordion
          elevation={0}
          sx={{ backgroundColor: lighten(theme.palette.primary.main, 0.9) }}
        >
          <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
            <Typography fontWeight={500} textTransform="uppercase">
              {formatMessage({ id: 'chapterCoverage' })}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'grid', rowGap: 2 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  justifySelf: ip ? 'initial' : 'start',
                  columnGap: 2,
                  alignItems: 'end',
                }}
              >
                {ip ? (
                  <Typography>
                    {formatMessage({ id: 'sessionDate' })}
                    {' : '}
                    <Typography component="span" fontWeight={500}>
                      {formatDate(pld, {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                      })}
                    </Typography>
                  </Typography>
                ) : (
                  <MobileDatePicker
                    label={formatMessage({ id: 'sessionDate' })}
                    value={sessionDate}
                    onChange={(newValue) => {
                      if (newValue) setSessionDate(newValue);
                    }}
                    disabled={
                      areNotDoneChaptersLoading ||
                      isPresenceListLoading ||
                      areSubjectStudentsLoading
                    }
                    renderInput={(params) => (
                      <TextField {...params} color="primary" size="small" />
                    )}
                  />
                )}
                {ip ? (
                  <Box
                    sx={{
                      display: 'grid',
                      columnGap: 2,
                      gridTemplateColumns: 'auto 1fr',
                    }}
                  >
                    <Typography>
                      {`${formatMessage({ id: 'startedAt' })} : `}
                      <Typography component="span" fontWeight={500}>
                        {formatTime(s_time, {
                          hour: '2-digit',
                          minute: '2-digit',
                          dayPeriod: 'short',
                        })}
                      </Typography>
                    </Typography>
                    <Typography>
                      {`${formatMessage({ id: 'endedAt' })} : `}
                      <Typography component="span" fontWeight={500}>
                        {formatTime(e_time, {
                          hour: '2-digit',
                          minute: '2-digit',
                          dayPeriod: 'short',
                        })}
                      </Typography>
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'grid',
                      columnGap: 2,
                      gridTemplateColumns: 'auto 1fr',
                    }}
                  >
                    <TimePicker
                      label={formatMessage({ id: 'startTime' })}
                      value={startTime}
                      onChange={(newValue) => {
                        if (newValue) setStartTime(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                    <TimePicker
                      label={formatMessage({ id: 'endTime' })}
                      value={endTime}
                      onChange={(newValue) => {
                        if (newValue) setEndTime(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                  </Box>
                )}
              </Box>
              <Box sx={{ display: 'grid', rowGap: 1 }}>
                <Typography fontWeight={500}>
                  {`${formatMessage({ id: 'dispensedChapters' })} `}
                  {ip && (
                    <Typography
                      component="span"
                      fontWeight={500}
                    >{`(${c.length})`}</Typography>
                  )}
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(350px, 1fr))',
                    columnGap: 1,
                    alignItems: 'end',
                  }}
                >
                  {ip ? (
                    c.length === 0 ? (
                      <Typography>
                        {formatMessage({ id: 'noChaptersDone' })}
                      </Typography>
                    ) : (
                      c.map(({ chapter_title: ct }, index) => {
                        return (
                          <Typography key={index}>
                            {`${index + 1}. ${ct}`}
                          </Typography>
                        );
                      })
                    )
                  ) : (
                    [...notDoneChapters, ...c].map((chapter, index) => (
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'auto 1fr',
                          columnGap: 0.5,
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                        onClick={() => selectChapter(chapter)}
                        key={index}
                      >
                        <Checkbox
                          checked={
                            (CL.includes(chapter.chapter_id) &&
                              !removedChapterIds.includes(
                                chapter.chapter_id
                              )) ||
                            (!CL.includes(chapter.chapter_id) &&
                              addedChapterIds.includes(chapter.chapter_id))
                          }
                        />
                        <Typography component="span">
                          {chapter.chapter_title}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Box>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        {!ip && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ justifySelf: 'end', textTransform: 'none' }}
            disabled={
              isConfirmReinitialiseDialogOpen ||
              isConfirmSaveDialogOpen ||
              isConfirmPublishDialogOpen ||
              isReinitialising ||
              isSubmitting
            }
            onClick={() => {
              if (endTime < startTime)
                alert(
                  formatMessage({ id: 'endDateMustBeGreaterThanStartDate' })
                );
              else setIsConfirmPublishDialogOpen(true);
            }}
          >
            {formatMessage({ id: 'publishList' })}
          </Button>
        )}
        <Scrollbars autoHide>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead
              sx={{
                backgroundColor: lighten(theme.palette.primary.light, 0.6),
              }}
            >
              <TableRow>
                {['matricule', 'studentName', 'present'].map((val, index) =>
                  ip ? (
                    index < 2 ? (
                      <TableCell
                        key={index}
                        align={index === 2 ? 'right' : 'left'}
                      >
                        {formatMessage({ id: val })}
                      </TableCell>
                    ) : null
                  ) : (
                    <TableCell
                      key={index}
                      align={index === 2 ? 'right' : 'left'}
                    >
                      {formatMessage({ id: val })}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayStudents.length === 0 ? (
                <NoTableElement
                  message={formatMessage({
                    id: 'noStudentsInClass',
                  })}
                  colSpan={ip ? 2 : 3}
                />
              ) : (
                displayStudents
                  .sort((a, b) =>
                    a.first_name > b.first_name
                      ? 1
                      : a.last_name > b.last_name
                      ? 1
                      : a.matricule > b.matricule
                      ? 1
                      : -1
                  )
                  .map((student, index) => (
                    <PresenceStudentLane
                      student={student}
                      key={index}
                      is_published={ip}
                      onSelect={() => selectStudent(student)}
                      isSelected={
                        (SL.includes(student.annual_student_id) &&
                          !removedStudentIds.includes(
                            student.annual_student_id
                          )) ||
                        (!SL.includes(student.annual_student_id) &&
                          addedStudentIds.includes(student.annual_student_id))
                      }
                    />
                  ))
              )}
            </TableBody>
          </Table>
        </Scrollbars>
        {!ip && (
          <Box
            sx={{
              justifySelf: 'end',
              display: 'grid',
              gridAutoFlow: 'column',
              columnGap: 2,
            }}
          >
            {s.length > 0 || c.length > 0 ? (
              <Button
                color="error"
                variant="text"
                disabled={
                  isConfirmReinitialiseDialogOpen ||
                  isConfirmSaveDialogOpen ||
                  isConfirmPublishDialogOpen ||
                  isReinitialising
                }
                onClick={() => {
                  if (endTime < startTime)
                    alert(
                      formatMessage({ id: 'endDateMustBeGreaterThanStartDate' })
                    );
                  else setIsConfirmReinitialiseDialogOpen(true);
                }}
                sx={{ textTransform: 'none' }}
              >
                {formatMessage({ id: 'reinitialise' })}
              </Button>
            ) : (
              <Button
                color="error"
                variant="text"
                disabled={
                  isConfirmReinitialiseDialogOpen ||
                  isConfirmSaveDialogOpen ||
                  isConfirmPublishDialogOpen ||
                  isReinitialising ||
                  isSubmitting
                }
                onClick={back}
                sx={{ textTransform: 'none' }}
              >
                {formatMessage({ id: 'discard' })}
              </Button>
            )}
            <Button
              color="primary"
              variant="contained"
              disabled={
                isConfirmReinitialiseDialogOpen ||
                isConfirmSaveDialogOpen ||
                isConfirmPublishDialogOpen ||
                isReinitialising ||
                isSubmitting
              }
              onClick={() => {
                if (endTime < startTime)
                  alert(
                    formatMessage({ id: 'endDateMustBeGreaterThanStartDate' })
                  );
                else setIsConfirmSaveDialogOpen(true);
              }}
              sx={{ textTransform: 'none' }}
            >
              {formatMessage({ id: 'save' })}
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
}
