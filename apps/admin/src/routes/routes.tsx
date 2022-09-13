import { Typography } from '@mui/material';
import { Navigate } from 'react-router';
import Signin from '../pages/signin';

export const routes = [
  {
    path: '/',
    element: <Typography variant="h1">Welcome to Squoolr Admin</Typography>,
  },
  {
    path: '/signin',
    element: <Signin />,
  },
  { path: '*', element: <Navigate to="/" /> },
];
