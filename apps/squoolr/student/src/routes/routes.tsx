import { Typography } from '@mui/material';
import { Navigate } from 'react-router';
import ForgotPasswordPage from '../pages/forgotPassword';
import NewPasswordPage from '../pages/newPassword';
import SigninPage from '../pages/signin';
import AppLayout from '../pages/layout';
import Home from '../pages/home';
import Courses from '../pages/courses';
import CourseDetails from '../pages/courses/[annual_credit_unit_subject_id]';

export const routes = [
  {
    path: '/',
    element: <SigninPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: 'forgot-password/:reset_password_id/new-password',
    element: <NewPasswordPage />,
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
        element: <Home />,
      },
      {
        path: 'my-courses',
        element: <Courses />,
      },
      {
        path: 'my-courses/:annual_credit_unit_subject_id',
        element: <CourseDetails />,
      },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
  { path: '*', element: <Navigate to="/" /> },
];
