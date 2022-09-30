import { Typography } from '@mui/material';
import { Navigate } from 'react-router';
import AppLayout from '../pages/appLayout';
import Departments from '../pages/registry/departments';
import Majors from '../pages/registry/majors';
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
            element: <Typography>Manage major</Typography>,
          },
          { path: '*', element: <Navigate to="/" /> },
        ],
      },
      {
        path: 'personnel',
        element: <Typography variant="h1">Personnel</Typography>,
      },
    ],
  },
  { path: '*', element: <Navigate to="/" /> },
  { path: '*', element: <Navigate to="/" /> },
];
