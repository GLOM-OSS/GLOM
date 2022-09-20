import { Typography } from '@mui/material';
import { Navigate } from 'react-router';
import Demands from '../components/demand/demands';
import DemandValidation from '../components/demand/demandValidation';
import AdminLayout from '../pages/AdminLayout';
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
    path: 'forgot-password/:reset_password_id/new-password',
    element: <NewPassword />,
  },
  {
    path: '/management',
    element: <AdminLayout />,
    children: [
      {
        path: 'demands',
        element: <Demands />,
      },
      {
        path: 'demands/:demand_code',
        element: <DemandValidation />,
      },
      {
        path: 'schools',
        element: <Typography variant="h1">Schools</Typography>,
      },
      {
        path: 'configurators',
        element: <Typography variant="h1">configurators</Typography>,
      },
    ],
  },
  {
    path: 'settings',
    element: <AdminLayout />,
    children: [
      {
        path: '*',
        element: <Typography variant="h1">Demands</Typography>,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <Typography variant="h1">Welcome to Squoolr Admin</Typography>,
  },
  { path: '*', element: <Navigate to="/" /> },
];
