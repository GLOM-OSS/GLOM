import { Typography } from '@mui/material';
import { Navigate } from 'react-router';

export const routes = [
  {
    path: '/',
    element: <Typography variant="h1">Welcome to Squoolr for Students</Typography>,
  },
  { path: '*', element: <Navigate to="/" /> },
];
