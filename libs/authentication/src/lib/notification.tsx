import { DoneAllRounded } from '@mui/icons-material';
import { CircularProgress, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { Id, toast } from 'react-toastify';

export class useNotification {
  toastId: Id;
  constructor() {
    this.toastId = uuidv4();
  }
  notify = ({ render }: { render: string | JSX.Element }) =>
    (this.toastId = toast.dark(<Typography variant='caption'>{render}</Typography>,{
      autoClose: false,
      closeButton: false,
      closeOnClick: false,
      icon: () => <CircularProgress thickness={3} size={20} />,
    }));

  dismiss = () => toast.dismiss(this.toastId);

  update = ({
    type,
    render,
    closeButton,
    hideProgressBar,
    autoClose,
    icon,
  }: {
    render?: string | JSX.Element;
    type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'DEFAULT' | 'INFO';
    autoClose?: false | number;
    closeButton?: false | JSX.Element;
    hideProgressBar?: boolean;
    icon?: JSX.Element | (() => JSX.Element);
  }) =>
    toast.update(this.toastId, {
      type: toast.TYPE[type ?? 'SUCCESS'],
      render: <Typography variant='caption'>{render ?? 'Success'}</Typography>,
      closeButton: closeButton ?? false,
      hideProgressBar: hideProgressBar ?? true,
      autoClose: autoClose ?? 5000,
      closeOnClick: true,
      icon:
        icon !== undefined ? icon : () => <DoneAllRounded color="success" />,
    });
}

export default useNotification;
