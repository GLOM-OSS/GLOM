import { Typography } from '@mui/material';
import { Navigate } from 'react-router';
import ForgotPassword from '../pages/forgotPassword';
import NewPassword from '../pages/newPassword';
import SigninPage from '../pages/signin';
import AppLayout from '../pages/layout';

export const routes = [
  {
    path: '/',
    element: <SigninPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: 'forgot-password/:reset_password_id/new-password',
    element: <NewPassword />,
  },
  {
    path: '/dashboard',
    element: (
      <Typography variant="h1">Welcome to Squoolr for Students</Typography>
    ),
  },
  {
    path: '/student',
    element: <AppLayout />,
    children: [
      {
        path: 'home',
        element: <Typography variant="h1">Testing 123</Typography>,
      },
      {
        path: 'my-courses',
        element: <Typography variant="h1">courses</Typography>,
      },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
  { path: '*', element: <Navigate to="/" /> },
];
