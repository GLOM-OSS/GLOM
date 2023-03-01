import { ReportRounded } from '@mui/icons-material';
import { activateAssessment, createNewAssessment } from '@squoolr/api-services';
import {
  ActivateAssessment,
  Assessment,
  StudentAssessmentAnswer,
} from '@squoolr/interfaces';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import { SubmissionEntity } from '../assignment';
import ActivateAssessmentDialog from './activateAssessmentDialog';
import AssessmentList from './assessmentList';
import QuestionList from './questionList';
import Statistics from './statistics';
import StudentResponse from './studentResponse';
import SubmissionList from './submissionList';

export default function Assessments() {
  const { formatMessage } = useIntl();
  const { annual_credit_unit_subject_id } = useParams();

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
    createNewAssessment({
      number_per_group: 1,
      submission_type: 'Individual',
      annual_credit_unit_subject_id: annual_credit_unit_subject_id as string,
      is_assignment: false,
    })
      .then((assessment) => {
        setActiveAssessment(assessment);
        notif.update({
          render: formatMessage({ id: 'assessmentCreatedSuccessfully' }),
        });
        setAssessmentNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={createAssessment}
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'createAssessmentFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsCreatingAssessment(false));
  };

  const [isActivateAssessmentDialogOpen, setIsActivateAssessmentDialogOpen] =
    useState<boolean>(false);

  const [isActivatingAssessment, setIsActivatingAssessment] =
    useState<boolean>(false);

  const activateAssessmentHandler = (activateData: {
    duration: number | null;
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
      activateAssessment(activeAssessment.assessment_id, activateData)
        .then(() => {
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
        })
        .catch((error) => {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => activateAssessmentHandler(activateData)}
                notification={notif}
                message={
                  error?.message ||
                  formatMessage({ id: 'activatingAssessmentFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        });
    }
  };

  const [showResponses, setShowResponses] = useState<boolean>(false);

  const [activeStudent, setActiveStudent] = useState<SubmissionEntity>();
  const [showStatistics, setShowStatistics] = useState<boolean>(false);

  return (
    <>
      <ActivateAssessmentDialog
        closeDialog={() => setIsActivateAssessmentDialogOpen(false)}
        isDialogOpen={isActivateAssessmentDialogOpen}
        handleSubmit={(val: ActivateAssessment) => {
          if (activeAssessment) {
            activateAssessmentHandler({
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
      ) : showStatistics ? (
        <Statistics
          activeAssessment={activeAssessment}
          onClose={() => setShowStatistics(false)}
        />
      ) : activeStudent ? (
        <StudentResponse
          activeAssessment={activeAssessment}
          activeSubmission={activeStudent}
          onBack={() => setActiveStudent(undefined)}
        />
      ) : showResponses ? (
        <SubmissionList
          openStatistics={() => setShowStatistics(true)}
          activeAssessment={activeAssessment}
          onBack={() => setShowResponses(false)}
          setActiveStudent={setActiveStudent}
          setActiveAssessment={setActiveAssessment}
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
