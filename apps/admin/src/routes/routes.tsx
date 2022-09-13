import { Typography } from '@mui/material';
import { Navigate } from 'react-router';
import SigninPage from '../pages/signin';

export const routes = [
  {
    path: '/',
    element: <SigninPage />,
  },
  {
    path: '/signin',
    element: <Typography variant="h1">Welcome to Squoolr Admin</Typography>,
  },
  { path: '*', element: <Navigate to="/" /> },
];
