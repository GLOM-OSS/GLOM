import {
  Assessment,
  IGroupAssignment,
  StudentAssessmentAnswer,
} from '@squoolr/interfaces';
import { useState } from 'react';
import AssessmentList from './assessmentList';
import QuestionList from './questionList';

export type SubmissionEntity =
  | Omit<StudentAssessmentAnswer, 'questionAnswers'>
  | IGroupAssignment;

export default function Assessments() {
  const [activeAssessment, setActiveAssessment] = useState<Assessment>();

  return !activeAssessment ? (
    <AssessmentList
      createAssessment={() => alert('hello')}
      isCreatingAssessment={false}
      setActiveAssessment={(val: Assessment) => setActiveAssessment(val)}
    />
  ) : (
    <QuestionList
      activeAssessment={activeAssessment}
      setActiveAssessment={setActiveAssessment}
    />
  );
}
