import { Typography } from '@mui/material';
import { Navigate } from 'react-router';
import Classrooms from '../components/secretary/classrooms';
import AppLayout from '../pages/appLayout';
import ModulesManagement from '../pages/coordinator/modulesManagement';
import SubjectManagement from '../pages/coordinator/subjectManagement';
import Departments from '../pages/secretary/departments';
import Majors from '../pages/secretary/majors';
import NewAcademicYear from '../pages/secretary/newAcademicYear';
import Personnel from '../pages/secretary/personnel';
import SigninPage from '../pages/signin';

export const routes = [
  {
    path: '/',
    element: <SigninPage />,
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
        element: <ModulesManagement />,
      },
      {
        path: 'subjects-and-modules/:annual_credit_unit_id',
        element: <SubjectManagement />,
      },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
  {
    path: '/coordinator/marksManagement',
    element: <AppLayout />,
    children: [
      {
        path: 'module-follow-up',
        element: <Typography>Module marks follow up</Typography>,
      },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
  { path: '*', element: <Navigate to="/" /> },
];
