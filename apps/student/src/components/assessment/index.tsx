import { takeAssessment } from '@squoolr/api-services';
import { ConfirmDeleteDialog } from '@squoolr/dialogTransition';
import {
  Assessment,
  IGroupAssignment,
  StudentAssessmentAnswer,
} from '@squoolr/interfaces';
import { useState } from 'react';
import { toast } from 'react-toastify';
import AssessmentList from './assessmentList';
import QuestionList from './questionList';

export type SubmissionEntity =
  | Omit<StudentAssessmentAnswer, 'questionAnswers'>
  | IGroupAssignment;

export default function Assessments() {
  const [activeAssessment, setActiveAssessment] = useState<Assessment>();
  const [
    isConfirmStartAssessmentDialogOpen,
    setIsConfirmStartAssessementDialogOpen,
  ] = useState<boolean>(false);

  const [pendingConfirm, setPendingConfirm] = useState<Assessment>();

  const takeAssessmentHandler = (assessment: Assessment) => {
    takeAssessment(assessment.assessment_id)
      .then(() => {
        setActiveAssessment(assessment);
        setActiveAssessment(assessment);
        setPendingConfirm(undefined);
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <>
      <ConfirmDeleteDialog
        closeDialog={() => {
          setIsConfirmStartAssessementDialogOpen(false);
          setPendingConfirm(undefined);
        }}
        confirm={() => takeAssessmentHandler(pendingConfirm as Assessment)}
        dialogMessage={'confirmStartAssessmentMessage'}
        isDialogOpen={isConfirmStartAssessmentDialogOpen}
        confirmButton={'startAssessment'}
        danger
        dialogTitle="confirmStartAssessment"
      />
      {!activeAssessment ? (
        <AssessmentList
          isCreatingAssessment={false}
          createAssessment={() => toast.error('Not allow')}
          setActiveAssessment={(val: Assessment) => {
            const { assessment_date, duration } = val;
            if (assessment_date && duration) {
              const rejectDuration = new Date(
                new Date(assessment_date).getTime() + (duration / 8) * 60 * 1000
              );
              if (new Date() > rejectDuration)
                toast.error('You are late for this evaluation');
              else {
                setIsConfirmStartAssessementDialogOpen(true);
                setPendingConfirm(val);
              }
            } else toast.error('Evaluation not activated yet');
          }}
        />
      ) : (
        <QuestionList
          activeAssessment={activeAssessment}
          setActiveAssessment={setActiveAssessment}
        />
      )}
    </>
  );
}
