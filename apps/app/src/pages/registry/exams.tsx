import { ReportRounded } from '@mui/icons-material';
import {
  Box,
  lighten,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { Major } from '@squoolr/api-services';
import {
  CreditUnit,
  CreditUnitSubject,
  Evaluation,
  EvaluationSubTypeEnum,
} from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import ActionBar from '../../components/registry/exams/actionBar';
import EvaluationLane from '../../components/registry/exams/EvaluationLane';
import {
  NoTableElement,
  TableLaneSkeleton,
} from '../../components/teacher/courseLane';

export default function Exams() {
  const { formatMessage } = useIntl();

  const [activeSemester, setActiveSemester] = useState<number>();
  const [activeSubject, setActiveSubject] = useState<CreditUnitSubject>();
  const [activeMajor, setActiveMajor] = useState<Major>();
  const [activeCreditUnit, setActiveCreditUnit] = useState<CreditUnit>();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [AreEvaluationsLoading, setAreEvaluationsLoading] =
    useState<boolean>(false);
  const [evaluationNotif, setEvaluationNotif] = useState<useNotification>();

  const loadEvaluations = () => {
    setAreEvaluationsLoading(true);
    const notif = new useNotification();
    if (evaluationNotif) {
      evaluationNotif.dismiss();
    }
    setEvaluationNotif(notif);
    setTimeout(() => {
      //TODO: call api here to load evaluation with data activeMajor, activeSemester, activeCreditUnit, activeSubject
      if (6 > 5) {
        const newEvaluation: Evaluation[] = [
          {
            evaluation_id: 'siels',
            evaluation_sub_type_name: EvaluationSubTypeEnum.CA,
            examination_date: new Date(),
            is_anonimated: false,
            is_published: false,
            subject_title: 'biologie',
          },
        ];
        setEvaluations(newEvaluation);
        setAreEvaluationsLoading(false);
        notif.dismiss();
        setEvaluationNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingEvaluations' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadEvaluations}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'getEvaluationsFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [majors, setMajors] = useState<Major[]>([]);
  const [areMajorsLoading, setAreMajorsLoading] = useState<boolean>(false);
  const [majorNotif, setMajorNotif] = useState<useNotification>();

  const loadMajors = () => {
    setAreMajorsLoading(true);
    const notif = new useNotification();
    if (majorNotif) {
      majorNotif.dismiss();
    }
    setMajorNotif(notif);
    setTimeout(() => {
      //TODO: call api here to load majors
      if (6 > 5) {
        const newMajors: Major[] = [];
        setMajors(newMajors);
        setAreMajorsLoading(false);
        notif.dismiss();
        setMajorNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingMajors' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadMajors}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'getMajorsFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [creditUnits, setCreditUnits] = useState<CreditUnit[]>([]);
  const [areCreditUnitsLoading, setAreCreditUnitsLoading] =
    useState<boolean>(false);
  const [creditUnitNotif, setCreditUnitNotif] = useState<useNotification>();

  const loadCreditUnits = () => {
    setAreCreditUnitsLoading(true);
    const notif = new useNotification();
    if (creditUnitNotif) {
      creditUnitNotif.dismiss();
    }
    setCreditUnitNotif(notif);
    setTimeout(() => {
      //TODO: call api here to load creditUnits with data activeSemester, activeMajor
      if (6 > 5) {
        const newCreditUnits: CreditUnit[] = [];
        setCreditUnits(newCreditUnits);
        setAreCreditUnitsLoading(false);
        notif.dismiss();
        setCreditUnitNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingCreditUnits' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadCreditUnits}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'getCreditUnitsFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [subjects, setSubjects] = useState<CreditUnitSubject[]>([]);
  const [areSubjectsLoading, setAreSubjectsLoading] = useState<boolean>(false);
  const [subjectNotif, setSubjectNotif] = useState<useNotification>();

  const loadSubjects = () => {
    setAreSubjectsLoading(true);
    const notif = new useNotification();
    if (subjectNotif) {
      subjectNotif.dismiss();
    }
    setSubjectNotif(notif);
    setTimeout(() => {
      //TODO: call api here to load subjects with data activeCreditUnit, activeSemester, activeMajor
      if (6 > 5) {
        const newSubjects: CreditUnitSubject[] = [];
        setSubjects(newSubjects);
        setAreSubjectsLoading(false);
        notif.dismiss();
        setSubjectNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingSubjects' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadSubjects}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'getSubjectsFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  useEffect(() => {
    loadMajors();
    return () => {
      //TODO: CLEANUP ABOVE AXIOS CALL
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadCreditUnits();
    return () => {
      //TODO: CLEANUP ABOVE AXIOS CALL
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMajor, activeSemester]);

  useEffect(() => {
    loadEvaluations();
    return () => {
      //TODO: CLEANUP ABOVE AXIOS CALL
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMajor, activeSemester, activeCreditUnit, activeSubject]);

  useEffect(() => {
    loadSubjects();
    return () => {
      //TODO: CLEANUP ABOVE AXIOS CALLS
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMajor, activeSemester, activeCreditUnit]);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        rowGap: theme.spacing(2),
      }}
    >
      <ActionBar
        majors={majors}
        subjects={subjects}
        creditUnits={creditUnits}
        disabled={
          areMajorsLoading || areSubjectsLoading || areCreditUnitsLoading
        }
        activeSemester={activeSemester}
        setActiveCreditUnit={setActiveCreditUnit}
        setActiveMajor={setActiveMajor}
        setActiveSemester={setActiveSemester}
        setActiveSubject={setActiveSubject}
        activeCreditUnit={activeCreditUnit}
        activeMajor={activeMajor}
        activeSubject={activeSubject}
      />
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
                'subject',
                'evaluationType',
                'examDate',
                'status',
              ].map((val, index) => (
                <TableCell key={index}>{formatMessage({ id: val })}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {AreEvaluationsLoading ? (
              [...new Array(10)].map((_, index) => (
                <TableLaneSkeleton cols={5} key={index} />
              ))
            ) : evaluations.length === 0 ? (
              <NoTableElement
                message={formatMessage({ id: 'noEvaluationsYet' })}
                colSpan={5}
              />
            ) : (
              evaluations.map((evaluation, index) => (
                <EvaluationLane
                  evaluation={evaluation}
                  position={index + 1}
                  key={index}
                />
              ))
            )}
          </TableBody>
        </Table>
      </Scrollbars>
    </Box>
  );
}
