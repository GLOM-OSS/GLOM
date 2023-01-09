import { ReportRounded } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import { getEvaluationSubTypes } from '@squoolr/api-services';
import { DialogTransition } from '@squoolr/dialogTransition';
import { EvaluationSubType } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function PublishAssessmentDialog({
  isDialogOpen,
  closeDialog,
  handleSubmit,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  handleSubmit: (evaluation_sub_type_id: string) => void;
}) {
  const { formatMessage } = useIntl();
  const initialValues: { evaluation_sub_type_id: string } = {
    evaluation_sub_type_id: '',
  };
  const validationSchema = Yup.object().shape({
    evaluation_sub_type_id: Yup.string().required(
      formatMessage({ id: 'required' })
    ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values.evaluation_sub_type_id);
      resetForm();
      closeDialog();
    },
  });

  const [evaluationSubTypes, setEvaluationSubTypes] = useState<
    EvaluationSubType[]
  >([]);
  const [areEvaluationSubTypesLoading, setAreEvaluationSubTypesLoading] =
    useState<boolean>(false);
  const [evaluationSubTypeNotif, setEvaluationSubTypeNotif] =
    useState<useNotification>();

  const loadEvaluationSubTypes = () => {
    setAreEvaluationSubTypesLoading(true);
    const notif = new useNotification();
    if (evaluationSubTypeNotif) {
      evaluationSubTypeNotif.dismiss();
    }
    setEvaluationSubTypeNotif(notif);
    getEvaluationSubTypes()
      .then((evaluationSubTypes) => {
        setEvaluationSubTypes(evaluationSubTypes);
        setAreEvaluationSubTypesLoading(false);
        notif.dismiss();
        setEvaluationSubTypeNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingEvaluationSubTypes' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadEvaluationSubTypes}
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'getEvaluationSubTypesFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    if (isDialogOpen) {
      loadEvaluationSubTypes();
    }
    return () => {
      //TODO: CLEANUP AXIOS FETCH ABOVE
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogOpen]);

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={closeDialog}
    >
      <DialogTitle>
        {formatMessage({ id: 'publishAssessmentMarks' })}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: theme.spacing(2) }}>
            {formatMessage({ id: 'confirmPublishAssessmentDialogMessage' })}
          </DialogContentText>
          <FormControl>
            <InputLabel id="evaluationType">
              {formatMessage({ id: 'evaluationType' })}
            </InputLabel>
            <Select
              size="small"
              labelId="evaluationType"
              disabled={areEvaluationSubTypesLoading}
              onChange={(event) =>
                formik.setFieldValue(
                  'evaluation_sub_type_id',
                  event.target.value
                )
              }
              value={formik.values.evaluation_sub_type_id}
              input={
                <OutlinedInput
                fullWidth
                  sx={{ minWidth: '300px' }}
                  label={formatMessage({ id: 'evaluationType' })}
                />
              }
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 48 * 4.5 + 8,
                  },
                },
              }}
            >
              {evaluationSubTypes.map(
                (
                  {
                    annual_evaluation_sub_type_id: est_id,
                    evaluation_sub_type_name: estn,
                  },
                  index
                ) => (
                  <MenuItem key={index} value={est_id}>
                    {formatMessage({ id: estn })}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ textTransform: 'none' }}
            color="error"
            variant="text"
            onClick={closeDialog}
          >
            {formatMessage({ id: 'cancel' })}
          </Button>
          <Button
            sx={{ textTransform: 'none' }}
            color="primary"
            variant="contained"
            type="submit"
          >
            {formatMessage({ id: 'publish' })}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
