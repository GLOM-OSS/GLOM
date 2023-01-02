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
import {
  getCreditUnits,
  getCreditUnitSubjects,
  getEvaluations,
  getMajors,
  Major,
} from '@squoolr/api-services';
import { CreditUnit, CreditUnitSubject, Evaluation } from '@squoolr/interfaces';
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
    getEvaluations({
      semester_number: activeSemester,
      major_id: activeMajor?.major_code,
      annual_credit_unit_subject_id:
        activeSubject?.annual_credit_unit_subject_id,
      annual_credit_unit_id: activeCreditUnit?.annual_credit_unit_id,
    })
      .then((evaluations) => {
        setEvaluations(evaluations);
        setAreEvaluationsLoading(false);
        notif.dismiss();
        setEvaluationNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingEvaluations' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadEvaluations}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getEvaluationsFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
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
    getMajors()
      .then((majors) => {
        setMajors(majors);
        setAreMajorsLoading(false);
        notif.dismiss();
        setMajorNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingMajors' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadMajors}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getMajorsFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
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
    getCreditUnits({
      ...(activeMajor?.major_id
        ? { majorIds: [{ major_id: activeMajor?.major_id }] }
        : {}),
      semester_number: activeSemester,
    })
      .then((creditUnits) => {
        setCreditUnits(creditUnits);
        setAreCreditUnitsLoading(false);
        notif.dismiss();
        setCreditUnitNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingCreditUnits' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadCreditUnits}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getCreditUnitsFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
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
    getCreditUnitSubjects(activeCreditUnit?.annual_credit_unit_id as string)
      .then((creditUnitSubjects) => {
        setSubjects(creditUnitSubjects);
        setAreSubjectsLoading(false);
        notif.dismiss();
        setSubjectNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingSubjects' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadSubjects}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getSubjectsFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
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
