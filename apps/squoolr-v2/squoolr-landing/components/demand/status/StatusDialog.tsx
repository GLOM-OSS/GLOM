import { getSchool } from '@glom/data-access/squoolr';
import { SchoolEntity } from '@glom/data-types';
import { useTheme } from '@glom/theme';
import checkCircle from '@iconify/icons-fluent/checkmark-circle-48-regular';
import { Icon } from '@iconify/react';
import { Box, Button, Dialog, TextField, Typography } from '@mui/material';
import { DialogTransition } from '@squoolr/confirm-dialogs';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function StatusDialog({
  open,
  closeDialog,
  demandCode: initialDemandCode,
}: {
  open: boolean;
  closeDialog: () => void;
  demandCode: string;
}) {
  const { formatMessage, formatDate } = useIntl();
  const theme = useTheme();

  const initialValues: { demandCode: string } = {
    demandCode: initialDemandCode,
  };

  const [isSubmitting, setIsSubmitting] = useState<boolean>();
  const [school, setSchool] = useState<SchoolEntity>();

  const validationSchema = Yup.object().shape({
    demandCode: Yup.string().required(formatMessage({ id: 'requiredField' })),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      getSchool(values.demandCode)
        .then((school) => setSchool(school))
        //TODO toast error
        .catch((error) => {
          console.log(error.error);
          console.log(error);
        })
        .finally(() => setIsSubmitting(false));
    },
  });

  return (
    <Dialog
      TransitionComponent={DialogTransition}
      open={open}
      keepMounted
      sx={{
        '& .MuiPaper-root': {
          padding: { laptop: '2% 10%', mobile: 0 },
        },
      }}
      onClose={closeDialog}
    >
      <Box
        sx={{
          padding: '30px 24px',
          display: 'grid',
          justifyItems: 'center',
          rowGap: 2,
        }}
      >
        <img src="logo.png" alt="squoolr logo" />
        <Typography
          variant="h1"
          className="h1--mobile"
          sx={{
            paddingBottom: 0,
            textAlign: 'center',
            textTransform: 'capitalize',
          }}
        >
          {formatMessage({ id: 'verifyDemandStatus' })}
        </Typography>
      </Box>
      <Box
        sx={{ padding: '0 16px 30px 16px', display: 'grid', rowGap: 4 }}
        onSubmit={formik.handleSubmit}
        component="form"
      >
        <Box sx={{ display: 'grid', rowGap: 0.5 }}>
          <Typography
            className="p2--space"
            sx={{
              color: `${theme.common.body} !important`,
              textAlign: 'center',
            }}
          >
            {formatMessage({ id: 'enterCodeToGetStatus' })}
          </Typography>
          <TextField
            fullWidth
            required
            autoFocus
            label={formatMessage({ id: 'demandCode' })}
            placeholder={formatMessage({ id: 'demandCode' })}
            variant="outlined"
            size="small"
            error={
              formik.touched.demandCode && Boolean(formik.errors.demandCode)
            }
            helperText={formik.touched.demandCode && formik.errors.demandCode}
            {...formik.getFieldProps('demandCode')}
            disabled={isSubmitting}
          />
        </Box>

        {school && school.school_code === formik.values.demandCode && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              columnGap: 0.5,
              alignItems: 'center',
              justifySelf: 'center',
            }}
          >
            <Icon
              icon={checkCircle}
              style={{
                color:
                  school.school_demand_status === 'VALIDATED'
                    ? theme.palette.success.main
                    : school.school_demand_status === 'PROCESSING'
                    ? theme.palette.primary.main
                    : theme.palette.error.main,
                height: '20px',
                width: '20px',
              }}
            />

            <Typography
              className="p3--space"
              sx={{
                color: `${
                  school.school_demand_status === 'VALIDATED'
                    ? theme.palette.success.main
                    : school.school_demand_status === 'PROCESSING'
                    ? theme.palette.primary.main
                    : theme.palette.error.main
                } !important`,
              }}
            >
              {formatMessage({ id: school.school_demand_status })}
            </Typography>
          </Box>
        )}

        {school && school.school_demand_status === formik.values.demandCode ? (
          <Box>
            <Typography
              className="p3--space"
              sx={{ textAlign: 'center !important' }}
            >{`${formatMessage({
              id: 'submittedOn',
            })} ${formatDate(school.created_at, {
              weekday: 'short',
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}`}</Typography>
            {school.school_demand_status === 'PROCESSING' ||
            school.school_demand_status === 'PENDING' ? (
              <>
                <Typography className="p3--space" sx={{ textAlign: 'center' }}>
                  {formatMessage({ id: 'weAreWorkingActively' })}
                </Typography>
                <Typography className="p3--space" sx={{ textAlign: 'center' }}>
                  {formatMessage({ id: 'pleaseBePatient' })}
                </Typography>
              </>
            ) : (
              <Box sx={{ display: 'grid', rowGap: 2, justifyItems: 'center' }}>
                <Box>
                  <Typography className="p3--space">
                    {formatMessage({ id: 'yourRequestHasBeenValidated' })}
                  </Typography>
                  <Typography className="p3--space">
                    {formatMessage({ id: 'thankYouForYourPatience' })}
                  </Typography>
                </Box>
                <Typography className="p3--space">
                  {formatMessage({ id: 'yourSchoolDomain' })}
                  <Typography
                    className="p3--space"
                    component="a"
                    target="_blank"
                    href={school.subdomain}
                    sx={{
                      color: `${theme.palette.primary.main} !important`,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {school.subdomain}
                  </Typography>
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={isSubmitting}
          >
            {formatMessage({ id: 'verifyStatus' })}
          </Button>
        )}
      </Box>
    </Dialog>
  );
}
