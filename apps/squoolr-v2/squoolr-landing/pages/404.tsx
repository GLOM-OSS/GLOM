import { useTheme } from '@glom/theme';
import left from '@iconify/icons-fluent/arrow-left-20-filled';
import { Icon } from '@iconify/react';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import Navbar from '../components/navigation/Navbar';
import ContactUs from '../components/contact-us/ContactUs';
import { useState } from 'react';

export default function NotFound() {
  const { formatMessage } = useIntl();
  const { push } = useRouter();
  const theme = useTheme();
  const [isContactUsDialogOpen, setIsContactUsDialogOpen] =
    useState<boolean>(true);
  return (
    <>
      <ContactUs
        closeDialog={() => setIsContactUsDialogOpen(false)}
        open={isContactUsDialogOpen}
      />
      <Box sx={{ height: '100vh', gridTemplateRows: 'auto 1fr', rowGap: 1 }}>
        <Navbar openContactUs={() => setIsContactUsDialogOpen(true)} />
        <Box
          sx={{
            display: 'grid',
            justifyItems: 'center',
            alignContent: 'center',
            rowGap: 2,
            height: '100%',
            padding: '70px 32px',
          }}
        >
          <img src="404.png" alt="page not found" />
          <Typography
            className="title-landing-page"
            sx={{
              color: 'var(--titleActive)',
            }}
          >
            {formatMessage({ id: 'pageNotFound' })}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: theme.common.label,
              textAlign: 'center',
              fontSize: {
                mobile: '16px',
                laptop: theme.typography.h5.fontSize,
              },
            }}
          >
            {formatMessage({ id: 'missingPage' })}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Icon icon={left} />}
            onClick={() => push('/')}
          >
            {formatMessage({ id: 'goHome' })}
          </Button>
        </Box>
      </Box>
    </>
  );
}
