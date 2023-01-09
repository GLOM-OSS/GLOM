import {
  ReportRounded
} from '@mui/icons-material';
import {
  activateAssessment,
  createNewAssessment,
  deleteQuestion,
  getAssessmentQuestions
} from '@squoolr/api-services';
import {
  ActivateAssessment,
  Assessment, Question, StudentAssessmentAnswer
} from '@squoolr/interfaces';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import ActivateAssessmentDialog from './activateAssessmentDialog';
import AssessmentList from './assessmentList';
import QuestionList from './questionList';
import Statistics from './statistics';
import StudentResponse from './studentResponse';
import SubmissionList from './submissionList';
  
  export default function Assessments() {
    const { annual_credit_unit_subject_id } = useParams();
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
    createNewAssessment(annual_credit_unit_subject_id as string)
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

  const [questions, setQuestions] = useState<Question[]>([]);
  const [areQuestionsLoading, setAreQuestionsLoading] =
    useState<boolean>(false);
  const [questionNotif, setQuestionNotif] = useState<useNotification>();

  const loadQuestions = () => {
    setAreQuestionsLoading(true);
    const notif = new useNotification();
    if (questionNotif) {
      questionNotif.dismiss();
    }
    setQuestionNotif(notif);
    getAssessmentQuestions(activeAssessment?.assessment_id as string)
      .then((questions) => {
        setQuestions(questions);
        setAreQuestionsLoading(false);
        notif.dismiss();
        setQuestionNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingQuestions' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadQuestions}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getQuestionsFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    if (activeAssessment) {
      loadQuestions();
    }
    return () => {
      //TODO: cleanup above axios fetch
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAssessment]);

  const [isActivateAssessmentDialogOpen, setIsActivateAssessmentDialogOpen] =
    useState<boolean>(false);

  const [isActivatingAssessment, setIsActivatingAssessment] =
    useState<boolean>(false);

  const activateAssessmentHandler = (activateData: {
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

  const [isDeletingQuestion, setIsDeletingQuestion] = useState<boolean>(false);

  const deleteQuestionHandler = (question: Question) => {
    setIsDeletingQuestion(true);
    const notif = new useNotification();
    if (questionNotif) questionNotif.dismiss();
    setQuestionNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'deletingQuestion',
      }),
    });
    deleteQuestion(question.question_id)
      .then(() => {
        setQuestions(
          questions.filter(
            ({ question_id: q_id }) => q_id !== question.question_id
          )
        );
        notif.update({
          render: formatMessage({ id: 'questionDeletedSuccessfully' }),
        });
        setQuestionNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => deleteQuestionHandler(question)}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'deleteQuestionFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsDeletingQuestion(false));
  };

  const [isQuestionDialogOpen, setIsQuestionDialog] = useState<boolean>(false);
  const [activeStudent, setActiveStudent] =
    useState<Omit<StudentAssessmentAnswer, 'questionAnswers'>>();
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
          activeStudent={activeStudent}
          onBack={() => setActiveStudent(undefined)}
          totalMark={activeAssessment.total_mark}
        />
      ) : showResponses ? (
        <SubmissionList
          openStatistics={() => setShowStatistics(true)}
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
