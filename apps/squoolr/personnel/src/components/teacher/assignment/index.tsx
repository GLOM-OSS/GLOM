import { ReportRounded } from '@mui/icons-material';
import {
  activateAssessment,
  createNewAssessment,
  getCourse,
} from '@squoolr/api-services';
import {
  ActivateAssessment,
  Assessment,
  Course,
  CreateAssessment,
  IGroupAssignment,
  StudentAssessmentAnswer,
} from '@squoolr/interfaces';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import ActivateAssessmentDialog from '../assessment/activateAssessmentDialog';
import AssessmentList from '../assessment/assessmentList';
import QuestionList from '../assessment/questionList';
import Statistics from '../assessment/statistics';
import StudentResponse from '../assessment/studentResponse';
import SubmissionList from '../assessment/submissionList';
import CreateAssignmentDialog from './createAssignmentDialog';

export type SubmissionEntity =
  | Omit<StudentAssessmentAnswer, 'questionAnswers'>
  | IGroupAssignment;

export default function Assignments() {
  const { formatMessage } = useIntl();
  const { annual_credit_unit_subject_id } = useParams();

  const [isCourseLoading, setIsCourseLoading] = useState<boolean>(false);
  const [course, setCourse] = useState<Course>();
  const [courseNotif, setCourseNotif] = useState<useNotification>();

  const loadCourse = (annual_credit_unit_subject_id: string) => {
    setIsCourseLoading(true);
    const notif = new useNotification();
    if (courseNotif) {
      courseNotif.dismiss();
    }
    setCourseNotif(notif);
    getCourse(annual_credit_unit_subject_id)
      .then((course) => {
        setCourse(course);
        setIsCourseLoading(false);
        notif.dismiss();
        setCourseNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingCourse' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadCourse(annual_credit_unit_subject_id)}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getCourseFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  const [activeAssessment, setActiveAssessment] = useState<Assessment>();
  const [assessmentNotif, setAssessmentNotif] = useState<useNotification>();
  const [showStatistics, setShowStatistics] = useState<boolean>(false);
  const [activeStudent, setActiveStudent] = useState<SubmissionEntity>();
  const [showResponses, setShowResponses] = useState<boolean>(false);
  const [isActivatingAssessment, setIsActivatingAssessment] =
    useState<boolean>(false);

  const [isCreatingAssignment, setIsCreatingAssignment] =
    useState<boolean>(false);
  const [assignmentNotif, setAssignmentNotif] = useState<useNotification>();

  const createAssignmentHandler = (assignment: CreateAssessment) => {
    setIsCreatingAssignment(true);
    const notif = new useNotification();
    if (assignmentNotif) {
      assignmentNotif.dismiss();
    }
    setAssignmentNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'creatingAssignment',
      }),
    });
    createNewAssessment(assignment)
      .then((newAssingment) => {
        notif.update({
          render: formatMessage({
            id: 'createAssignmentSuccessfull',
          }),
        });
        setActiveAssessment({ ...newAssingment, total_mark: 0 });
        setAssignmentNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => createAssignmentHandler(assignment)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({
                  id: 'createAssignmentFailed',
                })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsCreatingAssignment(false));
  };
  const [
    isConfirmActivateAssignmentDialogOpen,
    setIsConfirmActivateAssignmentDialogOpen,
  ] = useState<boolean>(false);

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
          id: 'activatingAssignment',
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
            render: formatMessage({ id: 'assignmentActivatedSuccessfully' }),
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
                  formatMessage({ id: 'activatingAssignmentFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        });
    }
  };
  const [isCreateAssignmentDialogOpen, setIsCreateAssignmentDialogOpen] =
    useState(false);

  useEffect(() => {
    loadCourse(annual_credit_unit_subject_id as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ActivateAssessmentDialog
        closeDialog={() => setIsConfirmActivateAssignmentDialogOpen(false)}
        handleSubmit={(val: ActivateAssessment) => {
          if (activeAssessment) {
            activateAssessmentHandler({
              ...val,
              duration: null,
              evaluation_id: activeAssessment.assessment_id,
            });
          }
        }}
        isDialogOpen={isConfirmActivateAssignmentDialogOpen}
        isAssignment={activeAssessment ? activeAssessment.is_assignment : true}
      />
      <CreateAssignmentDialog
        closeDialog={() => setIsCreateAssignmentDialogOpen(false)}
        handleSubmit={createAssignmentHandler}
        isDialogOpen={isCreateAssignmentDialogOpen}
        totalStudents={
          course && course.number_of_students && !isCourseLoading
            ? course.number_of_students
            : 0
        }
      />
      {!activeAssessment ? (
        <AssessmentList
          createAssessment={() => setIsCreateAssignmentDialogOpen(true)}
          isCreatingAssessment={isCreatingAssignment}
          setActiveAssessment={setActiveAssessment}
          isAssignment={true}
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
          setIsActivateAssessmentDialogOpen={
            setIsConfirmActivateAssignmentDialogOpen
          }
          confirmPublishAssignment={() =>
            setIsConfirmActivateAssignmentDialogOpen(true)
          }
        />
      )}
    </>
  );
}
