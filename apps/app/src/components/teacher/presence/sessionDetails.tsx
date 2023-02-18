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
import { ConfirmDeleteDialog } from '@squoolr/dialogTransition';
import {
  PresenceList,
  PresenceListChapter,
  Student,
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
  session: {
    presence_list_date: pld,
    start_time: s_time,
    end_time: e_time,
    is_published: ip,
    chapters: c,
    students: s,
    presence_list_id: pl_id,
  },
  reset,
  back,
}: {
  session: PresenceList;
  reset: () => void;
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
    setTimeout(() => {
      //TODO: CALL API HERE TO LOAD subject's notDoneChapters with data annual_credit_unit_subject_id
      // eslint-disable-next-line no-constant-condition
      if (5 > 4) {
        const newChapters: PresenceListChapter[] = [];
        setNotDoneChapters(newChapters);
        setAreNotDoneChaptersLoading(false);
        notif.dismiss();
        setNotDoneChapterNotif(undefined);
      } else {
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
              //TODO: message should come from backend
              message={formatMessage({ id: 'getNotDoneChaptersFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [areSubjectStudentsLoading, setAreSubjectStudentsLoading] =
    useState<boolean>(false);
  const [subjectStudents, setSubjectStudents] = useState<Student[]>([]);
  const [subjectStudentNotif, setSubjectStudentNotif] =
    useState<useNotification>();

  const loadSubjectStudents = (annual_credit_unit_subject_id: string) => {
    setAreSubjectStudentsLoading(true);
    const notif = new useNotification();
    if (subjectStudentNotif) {
      subjectStudentNotif.dismiss();
    }
    setSubjectStudentNotif(notif);
    setTimeout(() => {
      //TODO: CALL API HERE TO LOAD student's offering subject (subjectStudents) with data annual_credit_unit_subject_id
      // eslint-disable-next-line no-constant-condition
      if (5 > 4) {
        const newStudents: Student[] = [
          {
            annual_student_id: 'sieodsl',
            birthdate: new Date(),
            classroom_acronym: 'IRT3',
            email: 'nguemeteulriche@gmail.com',
            first_name: 'Ulriche Gaella',
            gender: 'Female',
            is_active: true,
            last_name: 'Mache Nguemete',
            matricule: '18C005',
            national_id_number: '000310122',
            phone_number: '693256789',
            preferred_lang: 'fr',
          },
        ];
        setSubjectStudents(newStudents);
        setAreSubjectStudentsLoading(false);
        notif.dismiss();
        setSubjectStudentNotif(undefined);
      } else {
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
              //TODO: message should come from backend
              message={formatMessage({ id: 'getSubjectStudentsFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  useEffect(() => {
    if (!ip) {
      loadSubjectStudents(annual_credit_unit_subject_id as string);
      loadNotDoneChapters(annual_credit_unit_subject_id as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [displayStudents, setDisplayStudents] = useState<Student[]>(s);

  useEffect(() => {
    if (!ip) {
      setDisplayStudents(subjectStudents);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectStudents]);

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

  const reinitialise = (
    removedStudentIds: string[],
    removedChapterIds: string[]
  ) => {
    setIsRenitialising(true);
    const notif = new useNotification();
    if (reinitialiseNotif) {
      reinitialiseNotif.dismiss();
    }
    setReinitialiseNotif(notif);
    notif.notify({
      render: formatMessage({ id: 'reinitialisingPresenceList' }),
    });
    setTimeout(() => {
      //TODO: CALL API HERE TO reinitialise presence list with data removedStudentIds and removedChapterIds
      // eslint-disable-next-line no-constant-condition
      if (5 > 4) {
        const newStudents: Student[] = [];
        setSubjectStudents(newStudents);
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
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() =>
                reinitialise(removedStudentIds, removedChapterIds)
              }
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'reinitialisePresenceListFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const save = (is_published: boolean, presence_list_id?: string) => {
    //use presence_list_id to decide if to create of take the save route.
    //use is_published to decide if to save or publish
    // start_time
    // end_time
    // presence_list_date,
    // removedStudentIds
    // addedStudentIds
    // removedChapterIds
    // addedChapterIds
    //submit value
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
        confirm={() => reinitialise(SL, CL)}
        danger
      />
      <ConfirmDeleteDialog
        dialogMessage={formatMessage({ id: 'confirmSavePresenceListMessage' })}
        dialogTitle={formatMessage({ id: 'confirmSavePresenceList' })}
        confirmButton={formatMessage({ id: 'save' })}
        closeDialog={() => setIsConfirmSaveDialogOpen(false)}
        isDialogOpen={isConfirmSaveDialogOpen}
        confirm={() => {
          if (pl_id) save(false, pl_id);
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
          if (pl_id) save(true, pl_id);
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
                      areNotDoneChaptersLoading || areSubjectStudentsLoading
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
              isReinitialising
            }
            onClick={() => setIsConfirmPublishDialogOpen(true)}
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
                onClick={() => setIsConfirmReinitialiseDialogOpen(true)}
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
                  isReinitialising
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
                isReinitialising
              }
              onClick={() => setIsConfirmSaveDialogOpen(true)}
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
