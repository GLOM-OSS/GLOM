import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

interface IPaymentDialogProps {
  link: string;
  isOpen: boolean;
  onClose: () => void;
  onCompleted: (iframeUrl: string) => void;
}
export default function PaymentDialog({
  link,
  isOpen,
  onClose,
  onCompleted,
}: IPaymentDialogProps) {
  const router = useRouter();

  console.log({ link });
  useEffect(() => {
    const { trxref, reference, status } = router.query;
    if (status && trxref && reference) {
      onCompleted(iframeRef.current.src);
      console.log({ status, trxref, reference });
    }
  }, [router.query]);

  const iframeRef = React.createRef<HTMLIFrameElement>();

  return (
    <Dialog open={isOpen} fullScreen>
      <IconButton
        edge="end"
        color="inherit"
        onClick={onClose}
        aria-label="close"
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <iframe
        title="Complete Payment"
        src={link}
        width="100%"
        height="100%"
      ></iframe>
    </Dialog>
  );
}
