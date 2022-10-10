import { Typography } from '@mui/material';
import { Navigate } from 'react-router';
import Classrooms from '../components/secretary/classrooms';
import AppLayout from '../pages/appLayout';
import Departments from '../pages/secretary/departments';
import Majors from '../pages/secretary/majors';
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
    path: '/configurations',
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
    ],
  },
  { path: '*', element: <Navigate to="/" /> },
  { path: '*', element: <Navigate to="/" /> },
];
