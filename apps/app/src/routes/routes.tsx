import { Typography } from '@mui/material';
import { Navigate } from 'react-router';
import ForgotPassword from '../pages/forgotPassword';
import NewPassword from '../pages/newPassword';
import SigninPage from '../pages/signin';

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
    path: 'reset-password/:code/new-password',
    element: <NewPassword />,
  },
  {
    path: '/dashboard',
    element: <Typography variant="h1">Welcome to Squoolr for Personnel</Typography>,
  },
  { path: '*', element: <Navigate to="/" /> },
];
