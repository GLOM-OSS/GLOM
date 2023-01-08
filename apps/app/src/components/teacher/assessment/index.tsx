import { ReportRounded } from '@mui/icons-material';
import {
  ActivateAssessment,
  Assessment,
  EvaluationSubTypeEnum,
} from '@squoolr/interfaces';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import ActivateAssessmentDialog from './activateAssessmentDialog';
import AssessmentList from './assessmentList';
import QuestionList from './questionList';

export default function Assessments() {
  const { formatMessage } = useIntl();

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
        'Showing Responses'
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
