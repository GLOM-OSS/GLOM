import { Typography } from '@mui/material';
import { Navigate } from 'react-router';
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
  { path: '*', element: <Navigate to="/" /> },
];
