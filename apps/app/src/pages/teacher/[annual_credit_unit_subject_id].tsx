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
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Evaluation,
  EvaluationHasStudent,
  EvaluationSubType,
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
import { EvaluationStudentLane } from '../../components/teacher/evaluationStudentLane';

// interface UpdatedMark {evaluation_has_student_id:string, initialMark: number, newMark: number}
interface UpdatedMark extends EvaluationHasStudent {
  initial_mark: number | null;
}

export default function CourseDetails() {
  const { formatMessage } = useIntl();
  const [evaluationHasStudents, setEvaluationHasStudents] = useState<
    EvaluationHasStudent[]
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
    setAreStudentsLoading(true);
    const notif = new useNotification();
    if (studentNotif) {
      studentNotif.dismiss();
    }
    setStudentNotif(notif);
    setTimeout(() => {
      //TODO: call api here to load evaluationHasStudents with data evaluation.evaluation_id
      if (6 > 5) {
        const newStudents: EvaluationHasStudent[] = [
          {
            evaluation_has_student_id: 'lsie',
            fullname: 'Tchakoumi Lorrain',
            last_updated: new Date(),
            mark: 0,
            matricule: '17C005',
          },
        ];
        setEvaluationHasStudents(newStudents);
        setAreStudentsLoading(false);
        notif.dismiss();
        setStudentNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingStudents' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadStudents}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'getStudentsFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const loadEvaluationSubTypes = () => {
    setAreEvaluationSubTypesLoading(true);
    const notif = new useNotification();
    if (evaluationSubTypeNotif) {
      evaluationSubTypeNotif.dismiss();
    }
    setEvaluationSubTypeNotif(notif);
    setTimeout(() => {
      //TODO: call api here to load evaluationSubTypes
      if (6 > 5) {
        const newEvaluationSubTypes: EvaluationSubType[] = [
          {
            evaluation_sub_type_id: 'lsiel',
            evaluation_sub_type_name: 'CA',
          },
          {
            evaluation_sub_type_id: 'lsiesl',
            evaluation_sub_type_name: 'EXAM',
          },
          {
            evaluation_sub_type_id: 'lsiesl',
            evaluation_sub_type_name: 'RESIT',
          },
        ];
        setEvaluationSubTypes(newEvaluationSubTypes);
        if (newEvaluationSubTypes.length > 0)
          setActiveEvaluationSubType(newEvaluationSubTypes[0]);
        setAreEvaluationSubTypesLoading(false);
        notif.dismiss();
        setEvaluationSubTypeNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingEvaluationSubTypes' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadStudents}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'getEvaluationSubTypesFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const loadEvaluation = () => {
    setIsEvaluationLoading(true);
    const notif = new useNotification();
    if (evaluationNotif) {
      evaluationNotif.dismiss();
    }
    setEvaluationNotif(notif);
    setTimeout(() => {
      //TODO: call api here to load evaluation with data annual_credit_unit_subject_id and activeEvaluationSubType
      if (6 > 5) {
        const newEvaluation: Evaluation = {
          evaluation_id: 'siels',
          evaluation_sub_type_name: 'ca',
          examination_date: new Date(),
          is_anonimated: false,
          is_published: false,
          subject_name: 'biologie',
        };
        setEvaluation(newEvaluation);
        setIsEvaluationLoading(false);
        notif.dismiss();
        setEvaluationNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingEvaluation' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadEvaluation}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'getEvaluationFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  useEffect(() => {
    if (activeEvaluationSubType) {
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
    return () => {
      //TODO: CLEANUP ABOVE FETCH
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [updatedMarks, setUpdatedMarks] = useState<UpdatedMark[]>([]);
  const updateStudentMark = (
    newMark: number,
    actionnedEvaluationStudent: EvaluationHasStudent
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
    updatedMarks: EvaluationHasStudent[]
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
      setTimeout(() => {
        //TODO: call api here to save updated marks with data updatedMarks and private_code
        if (6 > 5) {
          setUpdatedMarks([]);
          setIsModifyingEvaluation(false);
          notif.update({ render: formatMessage({ id: 'savedMarks' }) });
          setEvaluationNotif(undefined);
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() =>
                  saveEvaluationMarks(private_code, updatedMarks)
                }
                notification={notif}
                //TODO: message should come from backend
                message={formatMessage({ id: 'saveMarksFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    } else {
      alert('saveMustHaveMarksToSave');
      //TODO: change this alert to toast message
      //TODO: Search all alerts in project in the end and transform to toast before prod
    }
  };

  const resetEvaluationMarks = (
    private_code: string,
    students: EvaluationHasStudent[]
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
      setTimeout(() => {
        //TODO: call api here to reset student marks for evaluation with data evaluation.evaluation_id
        if (6 > 5) {
          setUpdatedMarks([]);
          setEvaluationHasStudents(
            students.map((student) => {
              return { ...student, mark: null };
            })
          );
          setIsModifyingEvaluation(false);
          notif.update({
            render: formatMessage({ id: 'marksResetSuccessfull' }),
          });
          setEvaluationNotif(undefined);
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() =>
                  resetEvaluationMarks(private_code, students)
                }
                notification={notif}
                //TODO: message should come from backend
                message={formatMessage({ id: 'marksResetFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    } else {
      alert('resetMarksMustHaveStudents');
      //TODO: change this alert to toast message
      //TODO: Search all alerts in project in the end and transform to toast before prod
    }
  };

  const publishEvaluationMarks = (
    private_code: string,
    updatedMarks: EvaluationHasStudent[]
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
        setTimeout(() => {
          //TODO: call api here to publish evaluation marks
          if (6 > 5) {
            setUpdatedMarks([]);
            setEvaluation({ ...evaluation, is_published: true });
            setIsModifyingEvaluation(false);
            notif.update({ render: formatMessage({ id: 'publishedMarks' }) });
            setEvaluationNotif(undefined);
          } else {
            notif.update({
              type: 'ERROR',
              render: (
                <ErrorMessage
                  retryFunction={() =>
                    publishEvaluationMarks(private_code, updatedMarks)
                  }
                  notification={notif}
                  //TODO: message should come from backend
                  message={formatMessage({ id: 'publishMarksFailed' })}
                />
              ),
              autoClose: false,
              icon: () => <ReportRounded fontSize="medium" color="error" />,
            });
          }
        }, 3000);
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
        setTimeout(() => {
          //TODO: call api here to save and publish evaluation marks with data updatedMarks
          if (6 > 5) {
            setUpdatedMarks([]);
            setEvaluation({ ...evaluation, is_published: true });
            setIsModifyingEvaluation(false);
            notif.update({
              render: formatMessage({ id: 'savedAndPublishedMarks' }),
            });
            setEvaluationNotif(undefined);
          } else {
            notif.update({
              type: 'ERROR',
              render: (
                <ErrorMessage
                  retryFunction={() =>
                    publishEvaluationMarks(private_code, updatedMarks)
                  }
                  notification={notif}
                  //TODO: message should come from backend
                  message={formatMessage({ id: 'saveAndPublishMarksFailed' })}
                />
              ),
              autoClose: false,
              icon: () => <ReportRounded fontSize="medium" color="error" />,
            });
          }
        }, 3000);
      }
    } else {
      alert('publishMarksMustHaveEvaluation');
      //TODO: change this alert to toast message
      //TODO: Search all alerts in project in the end and transform to toast before prod
    }
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
          resetEvaluationMarks(private_code, evaluationHasStudents)
        }
        confirm={formatMessage({ id: 'saveMarks' })}
        isDialogOpen={isConfirmSaveDialogOpen}
        message={formatMessage({ id: 'confirmSaveMarksMessage' })}
        title={formatMessage({ id: 'confirmSaveMarks' })}
      />
      <ConfirmEvaluationActionDialog
        closeDialog={() => setIsConfirmResetMarksDialogOpen(false)}
        handleSubmit={(private_code: string) =>
          saveEvaluationMarks(private_code, updatedMarks)
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
                  ({ evaluation_sub_type_id: est_id }) =>
                    est_id === event.target.value
                );
                setActiveEvaluationSubType(evaluationSubType);
              }}
              value={
                activeEvaluationSubType
                  ? activeEvaluationSubType.evaluation_sub_type_id
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
                    evaluation_sub_type_id: est_id,
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
          {evaluation && !evaluation.is_published && (
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
              sx={{ backgroundColor: lighten(theme.palette.success.main, 0.6) }}
            />
          )}
        </Box>
        <Scrollbars autoHide>
          <Table sx={{ minWidth: 650 }}>
            <TableHead
              sx={{
                backgroundColor: lighten(theme.palette.primary.light, 0.6),
              }}
            >
              <TableRow>
                {[
                  'number',
                  'matricule',
                  'studentName',
                  'score',
                  'lastUpdated',
                ].map((val, index) => (
                  <TableCell key={index}>
                    {formatMessage({ id: val })}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
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
                evaluationHasStudents.map((evaluationStudent, index) => (
                  <EvaluationStudentLane
                    student={evaluationStudent}
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
                ))
              )}
            </TableBody>
          </Table>
        </Scrollbars>
        {evaluation && !evaluation.is_published && (
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
