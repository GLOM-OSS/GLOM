import { Typography } from '@mui/material';
import { Navigate } from 'react-router';
import AppLayout from '../pages/appLayout';
import Departments from '../pages/registry/departments';
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
        element: <Departments />,
      },
      {
        path: 'majors',
        element: <Typography variant="h1">Majors</Typography>,
      },
      {
        path: 'classes',
        element: <Typography variant="h1">Classes</Typography>,
      },
      {
        path: 'personnel',
        element: <Typography variant="h1">Personnel</Typography>,
      },
    ],
  },
  { path: '*', element: <Navigate to="/" /> },
];
