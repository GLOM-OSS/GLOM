import { KeyboardBackspaceOutlined, ReportRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  lighten,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ActivateAssessment,
  Assessment,
  EvaluationSubTypeEnum,
  StudentAssessmentAnswer,
} from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { NoTableElement, TableLaneSkeleton } from '../courseLane';
import ActivateAssessmentDialog from './activateAssessmentDialog';
import AssessmentList from './assessmentList';
import QuestionList from './questionList';
import StudentLane from './studentLane';
import SubmissionList from './submissionList';

export default function Assessments() {
  const { formatMessage, formatDate, formatNumber } = useIntl();

  const [activeAssessment, setActiveAssessment] = useState<Assessment>();

  const [assessmentNotif, setAssessmentNotif] = useState<useNotification>();
  const [isCreatingAssessment, setIsCreatingAssessment] =
    useState<boolean>(false);

  const createAssessment = () => {
    setIsCreatingAssessment(true);
    const notif = new useNotification();
    if (assessmentNotif) assessmentNotif.dismiss();
    setAssessmentNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'creatingAssessment',
      }),
    });
    setTimeout(() => {
      //TODO: call api here to delete resource
      if (6 > 5) {
        const newAssessment: Assessment = {
          annual_credit_unit_subject_id: 'lsei',
          assessment_date: new Date(),
          assessment_id: 'sei',
          chapter_id: 'sei',
          created_at: new Date(),
          duration: null,
          evaluation_sub_type_name: EvaluationSubTypeEnum.ASSIGNMENT,
          total_mark: 0,
        };
        setActiveAssessment(newAssessment);
        setIsCreatingAssessment(false);
        notif.update({
          render: formatMessage({ id: 'assessmentCreatedSuccessfully' }),
        });
        setAssessmentNotif(undefined);
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={createAssessment}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'createAssessmentFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [isActivateAssessmentDialogOpen, setIsActivateAssessmentDialogOpen] =
    useState<boolean>(false);

  const [isActivatingAssessment, setIsActivatingAssessment] =
    useState<boolean>(false);

  const activateAssessment = (activateData: {
    duration: number;
    assessment_date: Date;
    assessment_time: Date;
    evaluation_id: string;
  }) => {
    if (activeAssessment) {
      setIsActivatingAssessment(true);
      const notif = new useNotification();
      if (assessmentNotif) assessmentNotif.dismiss();
      setAssessmentNotif(notif);
      notif.notify({
        render: formatMessage({
          id: 'activatingAssessment',
        }),
      });
      setTimeout(() => {
        //TODO: call api here to activateAssessment
        if (6 > 5) {
          const examDate = activateData.assessment_date
            .toISOString()
            .split('T');
          const x = activateData.assessment_time.toISOString().split('T');
          examDate[1] = x[1];
          setActiveAssessment({
            ...activeAssessment,
            assessment_date: new Date(examDate.join('T')),
            duration: activateData.duration,
          });
          setIsActivatingAssessment(false);
          notif.update({
            render: formatMessage({ id: 'assessmentActivatedSuccessfully' }),
          });
          setAssessmentNotif(undefined);
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => activateAssessment(activateData)}
                notification={notif}
                //TODO: message should come from backend
                message={formatMessage({ id: 'activatingAssessmentFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    }
  };

  const [showResponses, setShowResponses] = useState<boolean>(false);

  //   const [students, setStudents] = useState<StudentAssessmentAnswer[]>([]);
  //   const [areStudentsLoading, setAreStudentsLoading] = useState<boolean>(false);
  //   const [studentNotif, setStudentNotif] = useState<useNotification>();

  //   const loadStudents = (activeAssessment: Assessment) => {
  //     setAreStudentsLoading(true);
  //     const notif = new useNotification();
  //     if (studentNotif) {
  //       studentNotif.dismiss();
  //     }
  //     setStudentNotif(notif);
  //     setTimeout(() => {
  //       //TODO: call api here to load assessment students with data activeAssessment
  //       if (6 > 5) {
  //         const newStudents: StudentAssessmentAnswer[] = [
  //           {
  //             fullname: 'Tchakoumi Lorrain',
  //             matricule: '17C005',
  //             questionAnswers: [],
  //             submitted_at: new Date(),
  //             total_score: 18,
  //           },
  //           {
  //             fullname: 'Tchami Jennifer',
  //             matricule: '17C006',
  //             questionAnswers: [],
  //             submitted_at: new Date(),
  //             total_score: 18,
  //           },
  //         ];
  //         setStudents(newStudents);
  //         setAreStudentsLoading(false);
  //         notif.dismiss();
  //         setStudentNotif(undefined);
  //       } else {
  //         notif.notify({
  //           render: formatMessage({ id: 'loadingStudents' }),
  //         });
  //         notif.update({
  //           type: 'ERROR',
  //           render: (
  //             <ErrorMessage
  //               retryFunction={() => loadStudents(activeAssessment)}
  //               notification={notif}
  //               //TODO: message should come from backend
  //               message={formatMessage({ id: 'getStudentsFailed' })}
  //             />
  //           ),
  //           autoClose: false,
  //           icon: () => <ReportRounded fontSize="medium" color="error" />,
  //         });
  //       }
  //     }, 3000);
  //   };

  //   useEffect(() => {
  //     if (activeAssessment && showResponses) {
  //       loadStudents(activeAssessment);
  //     }
  //     return () => {
  //       //TODO: CLEANUP AXIOS FETCH ABOVE
  //     };
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [showResponses]);

  const [activeStudent, setActiveStudent] = useState<StudentAssessmentAnswer>();

  return (
    <>
      <ActivateAssessmentDialog
        closeDialog={() => setIsActivateAssessmentDialogOpen(false)}
        isDialogOpen={isActivateAssessmentDialogOpen}
        handleSubmit={(val: ActivateAssessment) => {
          if (activeAssessment) {
            activateAssessment({
              ...val,
              evaluation_id: activeAssessment.assessment_id,
            });
          }
        }}
      />
      {!activeAssessment ? (
        <AssessmentList
          createAssessment={createAssessment}
          isCreatingAssessment={isCreatingAssessment}
          setActiveAssessment={setActiveAssessment}
        />
      ) : showResponses ? (
        <SubmissionList
          activeAssessment={activeAssessment}
          onBack={() => setShowResponses(false)}
          setActiveStudent={setActiveStudent}
        />
      ) : (
        <QuestionList
          onShowResponses={() => setShowResponses(true)}
          activeAssessment={activeAssessment}
          isActivatingAssessment={isActivatingAssessment}
          setActiveAssessment={setActiveAssessment}
          setIsActivateAssessmentDialogOpen={setIsActivateAssessmentDialogOpen}
        />
      )}
    </>
  );
}
