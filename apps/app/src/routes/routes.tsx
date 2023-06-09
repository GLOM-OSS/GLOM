import { Typography } from '@mui/material';
import { Navigate } from 'react-router';
import Classrooms from '../components/secretary/classrooms';
import AppLayout from '../pages/appLayout';
import ModulePublishing from '../pages/coordinator/moduleFollowUp/modulePublishing';
import ModulesManagement from '../pages/coordinator/modulesManagement';
import SubjectManagement from '../pages/coordinator/subjectManagement';
import AcademicProfileTable from '../pages/registry/academicProfile';
import Exams from '../pages/registry/exams';
import Students from '../pages/registry/students';
import StudentDetails from '../pages/registry/students/[student_id]';
import WeightingTable from '../pages/registry/weightingTable';
import AnonimationDetails from '../pages/registry/[evaluation_id]';
import Departments from '../pages/secretary/departments';
import Majors from '../pages/secretary/majors';
import NewAcademicYear from '../pages/secretary/newAcademicYear';
import Personnel from '../pages/secretary/personnel';
import SigninPage from '../pages/signin';
import TeacherCourses from '../pages/teacher';
import CourseDetails from '../pages/teacher/[annual_credit_unit_subject_id]';
import NewPasswordPage from '../pages/newPassword';

export const routes = [
  {
    path: '/',
    element: <SigninPage />,
  },
  {
    path: '/forgot-password/:reset_password_id/new-password',
    element: <NewPasswordPage />,
  },
  {
    path: '/dashboard',
    element: (
      <Typography variant="h1">Welcome to Squoolr for Personnel</Typography>
    ),
  },
  {
    path: '/secretary/configurations',
    element: <AppLayout />,
    children: [
      {
        path: 'departments',
        element: <Departments usage="department" />,
      },
      {
        path: 'majors',
        children: [
          {
            path: '',
            element: <Majors />,
          },
          {
            path: ':major_code',
            element: <Classrooms />,
          },
          { path: '*', element: <Navigate to="/" /> },
        ],
      },
      {
        path: 'personnel',
        element: <Personnel />,
      },
      {
        path: 'new-academic-year',
        element: <NewAcademicYear />,
      },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
  {
    path: '/coordinator/configurations',
    element: <AppLayout />,
    children: [
      {
        path: 'subjects-and-modules',
        children: [
          { path: '', element: <ModulesManagement /> },
          { path: ':annual_credit_unit_id', element: <SubjectManagement /> },
        ],
      },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
  {
    path: '/coordinator/marks-management',
    element: <AppLayout />,
    children: [
      {
        path: 'module-follow-up',
        element: <ModulePublishing />,
      },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
  {
    path: '/registry/configurations',
    element: <AppLayout />,
    children: [
      {
        path: 'weighting-table',
        element: <WeightingTable />,
      },
      {
        path: 'academic-profile',
        element: <AcademicProfileTable />,
      },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
  {
    path: '/registry/marks-management',
    element: <AppLayout />,
    children: [
      {
        path: 'exams',
        element: <Exams />,
      },
      {
        path: 'exams/:evaluation_id',
        element: <AnonimationDetails />,
      },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
  {
    path: '/registry/student-management',
    element: <AppLayout />,
    children: [
      {
        path: 'students',
        element: <Students />,
      },
      {
        path: 'students/:student_id',
        element: <StudentDetails />,
      },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
  {
    path: '/teacher/configurations',
    element: <AppLayout />,
    children: [
      {
        path: 'courses',
        children: [
          { path: '', element: <TeacherCourses /> },
          {
            path: ':annual_credit_unit_subject_id',
            element: <CourseDetails />,
          },
        ],
      },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
  { path: '*', element: <Navigate to="/" /> },
];
