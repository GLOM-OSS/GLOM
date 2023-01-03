import { ReportRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  lighten,
  MenuItem,
  OutlinedInput,
  Select,
  Table,
  TableBody,
} from '@mui/material';
import {
  getEvaluation,
  getEvaluationHasStudents,
  getEvaluationSubTypes,
  publishEvaluation,
  resetStudentMarks,
  saveStudentMarks,
  setEvaluationDate,
} from '@squoolr/api-services';
import {
  AnonimatedEvaluationHasStudent,
  Evaluation,
  EvaluationHasStudent,
  EvaluationSubType,
  EvaluationSubTypeEnum,
  EvaluationTypeEnum,
} from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import ConfirmEvaluationActionDialog from '../../components/teacher/confirmEvaluationActionDialog';
import {
  NoTableElement,
  TableLaneSkeleton,
} from '../../components/teacher/courseLane';
import {
  AnonimatedStudentLane,
  EvaluationStudentLane,
} from '../../components/teacher/evaluationStudentLane';
import PendingAnonimation, { GetResitDate } from './pendingAnonimation';
import TableHeader from './tableHeader';

// interface UpdatedMark {evaluation_has_student_id:string, initialMark: number, newMark: number}
interface UpdatedMark extends EvaluationHasStudent {
  initial_mark: number | null;
}
interface AnonimatedUpdatedMark extends AnonimatedEvaluationHasStudent {
  initial_mark: number | null;
}
export default function CAEvaluation() {
  const { formatMessage } = useIntl();
  const [evaluationHasStudents, setEvaluationHasStudents] = useState<
    (EvaluationHasStudent | AnonimatedEvaluationHasStudent)[]
  >([]);
  const [areStudentsLoading, setAreStudentsLoading] = useState<boolean>(false);
  const [studentNotif, setStudentNotif] = useState<useNotification>();
  const [evaluationSubTypes, setEvaluationSubTypes] = useState<
    EvaluationSubType[]
  >([]);
  const [activeEvaluationSubType, setActiveEvaluationSubType] =
    useState<EvaluationSubType>();
  const [areEvaluationSubTypesLoading, setAreEvaluationSubTypesLoading] =
    useState<boolean>(false);
  const [evaluationSubTypeNotif, setEvaluationSubTypeNotif] =
    useState<useNotification>();
  const [evaluation, setEvaluation] = useState<Evaluation>();
  const [isEvaluationLoading, setIsEvaluationLoading] =
    useState<boolean>(false);
  const [evaluationNotif, setEvaluationNotif] = useState<useNotification>();

  const { annual_credit_unit_subject_id } = useParams();

  const loadStudents = () => {
    if (
      activeEvaluationSubType &&
      (activeEvaluationSubType.evaluation_sub_type_name ===
        EvaluationSubTypeEnum.CA ||
        (evaluation &&
          ((activeEvaluationSubType.evaluation_sub_type_name ===
            EvaluationSubTypeEnum.EXAM &&
            evaluation.is_anonimated) ||
            (activeEvaluationSubType.evaluation_sub_type_name ===
              EvaluationSubTypeEnum.RESIT &&
              evaluation.examination_date) ||
            (activeEvaluationSubType.evaluation_sub_type_name ===
              EvaluationSubTypeEnum.RESIT &&
              evaluation.is_anonimated))))
    ) {
      setAreStudentsLoading(true);
      const notif = new useNotification();
      if (studentNotif) {
        studentNotif.dismiss();
      }
      setStudentNotif(notif);
      getEvaluationHasStudents(evaluation?.evaluation_id as string)
        .then((students) => {
          setEvaluationHasStudents(students);
          setAreStudentsLoading(false);
          notif.dismiss();
          setStudentNotif(undefined);
        })
        .catch((error) => {
          notif.notify({
            render: formatMessage({ id: 'loadingStudents' }),
          });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={loadStudents}
                notification={notif}
                message={
                  error?.message || formatMessage({ id: 'getStudentsFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        });
    }
  };

  const loadEvaluationSubTypes = () => {
    setAreEvaluationSubTypesLoading(true);
    const notif = new useNotification();
    if (evaluationSubTypeNotif) {
      evaluationSubTypeNotif.dismiss();
    }
    setEvaluationSubTypeNotif(notif);
    getEvaluationSubTypes()
      .then((evaluationSubTypes) => {
        setEvaluationSubTypes(evaluationSubTypes);
        if (evaluationSubTypes.length > 0)
          setActiveEvaluationSubType(evaluationSubTypes[0]);
        setAreEvaluationSubTypesLoading(false);
        notif.dismiss();
        setEvaluationSubTypeNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingEvaluationSubTypes' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadEvaluationSubTypes}
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'getEvaluationSubTypesFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  const loadEvaluation = () => {
    setIsEvaluationLoading(true);
    setEvaluationHasStudents([]);
    setUpdatedMarks([]);
    const notif = new useNotification();
    if (evaluationNotif) {
      evaluationNotif.dismiss();
    }
    setEvaluationNotif(notif);
    if (annual_credit_unit_subject_id && activeEvaluationSubType)
      getEvaluation({
        annual_credit_unit_subject_id,
        annual_evaluation_sub_type_id:
          activeEvaluationSubType.annual_evaluation_sub_type_id,
      })
        .then((evaluation) => {
          setEvaluation(evaluation);
          setIsEvaluationLoading(false);
          notif.dismiss();
          setEvaluationNotif(undefined);
        })
        .catch((error) => {
          notif.notify({
            render: formatMessage({ id: 'loadingEvaluation' }),
          });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={loadEvaluation}
                notification={notif}
                message={
                  error?.message || formatMessage({ id: 'getEvaluationFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        });
  };

  useEffect(() => {
    if (activeEvaluationSubType) {
      setEvaluation(undefined);
      setEvaluationHasStudents([]);
      loadEvaluation();
      setUpdatedMarks([]);
    }
    return () => {
      //TODO: CLEANUP ABOVE FETCH
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeEvaluationSubType]);

  useEffect(() => {
    if (evaluation) {
      loadStudents();
    }
    return () => {
      //TODO: CLEANUP ABOVE FETCH
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaluation]);

  useEffect(() => {
    loadEvaluationSubTypes();
    setEvaluation(undefined);
    return () => {
      //TODO: CLEANUP ABOVE FETCH
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [updatedMarks, setUpdatedMarks] = useState<
    (UpdatedMark | AnonimatedUpdatedMark)[]
  >([]);
  const updateStudentMark = (
    newMark: number,
    actionnedEvaluationStudent:
      | EvaluationHasStudent
      | AnonimatedEvaluationHasStudent
  ) => {
    const { evaluation_has_student_id, mark: initialMark } =
      actionnedEvaluationStudent;
    const theMark = updatedMarks.find(
      ({ evaluation_has_student_id: ehs }) => ehs === evaluation_has_student_id
    );
    if (theMark) {
      if (theMark.initial_mark === newMark) {
        const tt = updatedMarks.filter(
          ({ evaluation_has_student_id: ehs_id }) =>
            ehs_id !== evaluation_has_student_id
        );
        setUpdatedMarks(tt);
      } else {
        const tt = updatedMarks.map((updatedMark) => {
          const { evaluation_has_student_id: ehs_id } = updatedMark;
          if (ehs_id === evaluation_has_student_id) {
            return { ...updatedMark, newMark };
          }
          return updatedMark;
        });

        setUpdatedMarks(tt);
      }
    } else
      setUpdatedMarks([
        ...updatedMarks,
        {
          ...actionnedEvaluationStudent,
          mark: newMark,
          initial_mark: initialMark,
        },
      ]);

    const ss = evaluationHasStudents.map((evaluationStudent) => {
      const { evaluation_has_student_id: ehs_id } = evaluationStudent;
      if (ehs_id === evaluation_has_student_id) {
        return { ...evaluationStudent, mark: newMark };
      }
      return evaluationStudent;
    });
    setEvaluationHasStudents(ss);
  };

  const [isConfirmPublishDialogOpen, setIsConfirmPublishDialogOpen] =
    useState<boolean>(false);
  const [isConfirmSaveDialogOpen, setIsConfirmSaveDialogOpen] =
    useState<boolean>(false);
  const [isConfirmResetMarksDialogOpen, setIsConfirmResetMarksDialogOpen] =
    useState<boolean>(false);

  const [isModifyingEvaluation, setIsModifyingEvaluation] =
    useState<boolean>(false);
  const saveEvaluationMarks = (
    private_code: string,
    updatedMarks: (EvaluationHasStudent | AnonimatedEvaluationHasStudent)[]
  ) => {
    if (updatedMarks.length > 0) {
      setIsModifyingEvaluation(true);
      const notif = new useNotification();
      if (evaluationNotif) {
        evaluationNotif.dismiss();
      }
      setEvaluationNotif(notif);
      notif.notify({
        render: formatMessage({ id: 'savingMarks' }),
      });
      const studentMarks = updatedMarks.map(
        ({ evaluation_has_student_id, mark }) => ({
          evaluation_has_student_id,
          mark: Number(mark),
        })
      );
      saveStudentMarks(
        evaluation?.evaluation_id as string,
        { studentMarks, private_code },
        false
      )
        .then(() => {
          setUpdatedMarks([]);
          notif.update({ render: formatMessage({ id: 'savedMarks' }) });
          setEvaluationNotif(undefined);
        })
        .catch((error) => {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() =>
                  saveEvaluationMarks(private_code, updatedMarks)
                }
                notification={notif}
                message={
                  error?.message || formatMessage({ id: 'saveMarksFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        })
        .finally(() => setIsModifyingEvaluation(false));
    } else {
      alert('saveMustHaveMarksToSave');
      //TODO: change this alert to toast message
      //TODO: Search all alerts in project in the end and transform to toast before prod
    }
  };

  const resetEvaluationMarks = (
    private_code: string,
    students: (EvaluationHasStudent | AnonimatedEvaluationHasStudent)[]
  ) => {
    if (students.length > 0) {
      setIsModifyingEvaluation(true);
      const notif = new useNotification();
      if (evaluationNotif) {
        evaluationNotif.dismiss();
      }
      setEvaluationNotif(notif);
      notif.notify({
        render: formatMessage({ id: 'resettingMarks' }),
      });
      resetStudentMarks(evaluation?.evaluation_id as string, private_code)
        .then(() => {
          setUpdatedMarks([]);
          setEvaluationHasStudents(
            students.map((student) => {
              return { ...student, mark: null };
            })
          );
          notif.update({
            render: formatMessage({ id: 'marksResetSuccessfull' }),
          });
          setEvaluationNotif(undefined);
        })
        .catch((error) => {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() =>
                  resetEvaluationMarks(private_code, students)
                }
                notification={notif}
                message={
                  error?.message || formatMessage({ id: 'marksResetFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        })
        .finally(() => setIsModifyingEvaluation(false));
    } else {
      alert('resetMarksMustHaveStudents');
      //TODO: change this alert to toast message
      //TODO: Search all alerts in project in the end and transform to toast before prod
    }
  };

  const publishEvaluationMarks = (
    private_code: string,
    updatedMarks: (EvaluationHasStudent | AnonimatedEvaluationHasStudent)[]
  ) => {
    if (evaluation) {
      if (updatedMarks.length === 0) {
        setIsModifyingEvaluation(true);
        const notif = new useNotification();
        if (evaluationNotif) {
          evaluationNotif.dismiss();
        }
        setEvaluationNotif(notif);
        notif.notify({
          render: formatMessage({ id: 'publishingMarks' }),
        });
        publishEvaluation(evaluation.evaluation_id as string)
          .then(() => {
            setUpdatedMarks([]);
            setEvaluation({ ...evaluation, is_published: true });
            notif.update({ render: formatMessage({ id: 'publishedMarks' }) });
            setEvaluationNotif(undefined);
          })
          .catch((error) => {
            notif.update({
              type: 'ERROR',
              render: (
                <ErrorMessage
                  retryFunction={() =>
                    publishEvaluationMarks(private_code, updatedMarks)
                  }
                  notification={notif}
                  message={
                    error?.message ||
                    formatMessage({ id: 'publishMarksFailed' })
                  }
                />
              ),
              autoClose: false,
              icon: () => <ReportRounded fontSize="medium" color="error" />,
            });
          })
          .finally(() => setIsModifyingEvaluation(false));
      } else {
        setIsModifyingEvaluation(true);
        const notif = new useNotification();
        if (evaluationNotif) {
          evaluationNotif.dismiss();
        }
        setEvaluationNotif(notif);
        notif.notify({
          render: formatMessage({ id: 'savingAndPublishingMarks' }),
        });
        const studentMarks = updatedMarks.map(
          ({ evaluation_has_student_id, mark }) => ({
            evaluation_has_student_id,
            mark: Number(mark),
          })
        );
        saveStudentMarks(
          evaluation.evaluation_id,
          { private_code, studentMarks },
          true
        )
          .then(() => {
            setUpdatedMarks([]);
            setEvaluation({ ...evaluation, is_published: true });
            notif.update({
              render: formatMessage({ id: 'savedAndPublishedMarks' }),
            });
            setEvaluationNotif(undefined);
          })
          .catch((error) => {
            notif.update({
              type: 'ERROR',
              render: (
                <ErrorMessage
                  retryFunction={() =>
                    publishEvaluationMarks(private_code, updatedMarks)
                  }
                  notification={notif}
                  message={
                    error?.message ||
                    formatMessage({ id: 'saveAndPublishMarksFailed' })
                  }
                />
              ),
              autoClose: false,
              icon: () => <ReportRounded fontSize="medium" color="error" />,
            });
          })
          .finally(() => setIsModifyingEvaluation(false));
      }
    } else {
      alert('publishMarksMustHaveEvaluation');
      //TODO: change this alert to toast message
      //TODO: Search all alerts in project in the end and transform to toast before prod
    }
  };

  const publishResitExamDate = (
    examination_date: Date,
    evaluation: Evaluation
  ) => {
    setIsModifyingEvaluation(true);
    const notif = new useNotification();
    if (evaluationNotif) {
      evaluationNotif.dismiss();
    }
    setEvaluationNotif(notif);
    notif.notify({
      render: formatMessage({ id: 'settingResitDate' }),
    });
    setEvaluationDate(evaluation.evaluation_id, examination_date)
      .then(() => {
        setEvaluation({ ...evaluation, examination_date });
        notif.update({ render: formatMessage({ id: 'savedResitDate' }) });
        setEvaluationNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() =>
                publishResitExamDate(examination_date, evaluation)
              }
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'setResitDateFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsModifyingEvaluation(false));
  };

  return (
    <>
      <ConfirmEvaluationActionDialog
        closeDialog={() => setIsConfirmPublishDialogOpen(false)}
        handleSubmit={(private_code: string) =>
          publishEvaluationMarks(private_code, updatedMarks)
        }
        confirm={formatMessage({
          id: updatedMarks.length > 0 ? 'saveAndPublishMarks' : 'publishMarks',
        })}
        isDialogOpen={isConfirmPublishDialogOpen}
        message={formatMessage({
          id:
            updatedMarks.length > 0
              ? 'confirmSaveAndPublishMarksMessage'
              : 'confirmPublishMarksMessage',
        })}
        title={formatMessage({
          id:
            updatedMarks.length > 0
              ? 'confirmSaveAndPublishMarks'
              : 'confirmPublishMarks',
        })}
      />
      <ConfirmEvaluationActionDialog
        closeDialog={() => setIsConfirmSaveDialogOpen(false)}
        handleSubmit={(private_code: string) =>
          saveEvaluationMarks(private_code, updatedMarks)
        }
        confirm={formatMessage({ id: 'saveMarks' })}
        isDialogOpen={isConfirmSaveDialogOpen}
        message={formatMessage({ id: 'confirmSaveMarksMessage' })}
        title={formatMessage({ id: 'confirmSaveMarks' })}
      />
      <ConfirmEvaluationActionDialog
        closeDialog={() => setIsConfirmResetMarksDialogOpen(false)}
        handleSubmit={(private_code: string) =>
          resetEvaluationMarks(private_code, evaluationHasStudents)
        }
        confirm={formatMessage({ id: 'resetMarks' })}
        isDialogOpen={isConfirmResetMarksDialogOpen}
        message={formatMessage({ id: 'confirmResetMarksMessage' })}
        title={formatMessage({ id: 'confirmResetMarks' })}
      />
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          rowGap: theme.spacing(0.5),
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            columnGap: theme.spacing(2),
            marginTop: theme.spacing(1),
          }}
        >
          <FormControl sx={{ justifySelf: 'start' }}>
            <InputLabel id="evaluationType">
              {formatMessage({ id: 'evaluationType' })}
            </InputLabel>
            <Select
              size="small"
              labelId="evaluationType"
              disabled={
                areEvaluationSubTypesLoading ||
                evaluationSubTypes.length === 0 ||
                isConfirmPublishDialogOpen ||
                isConfirmSaveDialogOpen ||
                isConfirmResetMarksDialogOpen ||
                isModifyingEvaluation
              }
              onChange={(event) => {
                const evaluationSubType = evaluationSubTypes.find(
                  ({ annual_evaluation_sub_type_id: est_id }) =>
                    est_id === event.target.value
                );
                setActiveEvaluationSubType(evaluationSubType);
              }}
              value={
                activeEvaluationSubType
                  ? activeEvaluationSubType.annual_evaluation_sub_type_id
                  : ''
              }
              input={
                <OutlinedInput
                  sx={{ minWidth: theme.spacing(20) }}
                  label={formatMessage({ id: 'evaluationType' })}
                />
              }
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 48 * 4.5 + 8,
                  },
                },
              }}
            >
              {evaluationSubTypes.map(
                (
                  {
                    annual_evaluation_sub_type_id: est_id,
                    evaluation_sub_type_name: est_name,
                  },
                  index
                ) => (
                  <MenuItem key={index} value={est_id}>
                    {formatMessage({ id: est_name })}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
          {evaluation &&
            !evaluation.is_published &&
            (evaluation.is_anonimated ||
              activeEvaluationSubType?.evaluation_type ===
                EvaluationTypeEnum.CA) && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsConfirmPublishDialogOpen(true)}
                disabled={
                  areStudentsLoading ||
                  areEvaluationSubTypesLoading ||
                  isEvaluationLoading ||
                  isConfirmPublishDialogOpen ||
                  isConfirmSaveDialogOpen ||
                  isConfirmResetMarksDialogOpen ||
                  isModifyingEvaluation
                }
                sx={{ textTransform: 'none' }}
              >
                {formatMessage({
                  id:
                    updatedMarks.length > 0
                      ? 'saveAndPublishMarks'
                      : 'publishMarks',
                })}
              </Button>
            )}
          {evaluation && evaluation.is_published && (
            <Chip
              label={formatMessage({ id: 'published' })}
              sx={{
                backgroundColor: lighten(theme.palette.success.main, 0.6),
              }}
            />
          )}
        </Box>
        {activeEvaluationSubType &&
        activeEvaluationSubType.evaluation_sub_type_name ===
          EvaluationSubTypeEnum.RESIT &&
        activeEvaluationSubType &&
        evaluation &&
        !evaluation.examination_date &&
        !(
          areStudentsLoading ||
          areEvaluationSubTypesLoading ||
          isEvaluationLoading
        ) ? (
          <GetResitDate
            publishResitDate={(examination_date: Date) =>
              publishResitExamDate(examination_date, evaluation)
            }
          />
        ) : activeEvaluationSubType &&
          activeEvaluationSubType.evaluation_type === EvaluationTypeEnum.EXAM &&
          evaluation &&
          !evaluation.is_anonimated &&
          !(
            areStudentsLoading ||
            areEvaluationSubTypesLoading ||
            isEvaluationLoading
          ) ? (
          <PendingAnonimation />
        ) : (
          <Scrollbars autoHide>
            <Table sx={{ minWidth: 650 }}>
              <TableHeader
                isAnonimated={Boolean(
                  activeEvaluationSubType &&
                    activeEvaluationSubType.evaluation_type ===
                      EvaluationTypeEnum.EXAM &&
                    evaluation &&
                    !evaluation.is_published &&
                    !(
                      areStudentsLoading ||
                      areEvaluationSubTypesLoading ||
                      isEvaluationLoading
                    )
                )}
              />
              <TableBody>
                {areEvaluationSubTypesLoading ||
                areStudentsLoading ||
                isEvaluationLoading ? (
                  [...new Array(10)].map((_, index) => (
                    <TableLaneSkeleton cols={5} key={index} />
                  ))
                ) : evaluationSubTypes.length === 0 ? (
                  <NoTableElement
                    message={formatMessage({ id: 'noEvaluationSubTypes' })}
                    colSpan={5}
                  />
                ) : !evaluation ? (
                  <NoTableElement
                    message={formatMessage({ id: 'evaluationNotFound' })}
                    colSpan={5}
                  />
                ) : evaluationHasStudents.length === 0 ? (
                  <NoTableElement
                    message={formatMessage({ id: 'noStudentsYet' })}
                    colSpan={5}
                  />
                ) : (
                  evaluationHasStudents.map((evaluationStudent, index) =>
                    activeEvaluationSubType &&
                    activeEvaluationSubType.evaluation_type ===
                      EvaluationTypeEnum.EXAM &&
                    evaluation &&
                    !evaluation.is_published &&
                    !(
                      areStudentsLoading ||
                      areEvaluationSubTypesLoading ||
                      isEvaluationLoading
                    ) ? (
                      <AnonimatedStudentLane
                        student={
                          evaluationStudent as AnonimatedEvaluationHasStudent
                        }
                        position={index + 1}
                        changeMark={updateStudentMark}
                        is_evaluation_published={
                          evaluation ? evaluation.is_published : false
                        }
                        disabled={
                          isConfirmPublishDialogOpen ||
                          isConfirmSaveDialogOpen ||
                          isConfirmResetMarksDialogOpen ||
                          isModifyingEvaluation
                        }
                        updatedMarks={updatedMarks as EvaluationHasStudent[]}
                        key={index}
                      />
                    ) : (
                      <EvaluationStudentLane
                        student={evaluationStudent as EvaluationHasStudent}
                        position={index + 1}
                        changeMark={updateStudentMark}
                        is_evaluation_published={
                          evaluation ? evaluation.is_published : false
                        }
                        disabled={
                          isConfirmPublishDialogOpen ||
                          isConfirmSaveDialogOpen ||
                          isConfirmResetMarksDialogOpen ||
                          isModifyingEvaluation
                        }
                        updatedMarks={updatedMarks as EvaluationHasStudent[]}
                        key={index}
                      />
                    )
                  )
                )}
              </TableBody>
            </Table>
          </Scrollbars>
        )}
        {evaluation &&
          !evaluation.is_published &&
          (evaluation.is_anonimated ||
            activeEvaluationSubType?.evaluation_type ===
              EvaluationTypeEnum.CA) && (
            <Box
              sx={{
                justifySelf: 'end',
                display: 'grid',
                gridAutoFlow: 'column',
                columnGap: theme.spacing(2),
              }}
            >
              <Button
                variant="text"
                color="error"
                sx={{ textTransform: 'none' }}
                onClick={() => setIsConfirmResetMarksDialogOpen(true)}
                disabled={
                  areStudentsLoading ||
                  areEvaluationSubTypesLoading ||
                  isEvaluationLoading ||
                  isConfirmPublishDialogOpen ||
                  isConfirmSaveDialogOpen ||
                  isConfirmResetMarksDialogOpen ||
                  isModifyingEvaluation
                }
              >
                {formatMessage({ id: 'reinitialiseMarks' })}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsConfirmSaveDialogOpen(true)}
                disabled={
                  updatedMarks.length === 0 ||
                  areStudentsLoading ||
                  areEvaluationSubTypesLoading ||
                  isEvaluationLoading ||
                  isConfirmPublishDialogOpen ||
                  isConfirmSaveDialogOpen ||
                  isConfirmResetMarksDialogOpen ||
                  isModifyingEvaluation
                }
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
