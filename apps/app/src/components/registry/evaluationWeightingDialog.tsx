import { ReportRounded } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { DialogTransition } from '@squoolr/dialogTransition';
import {
  Cycle,
  EvaluationType,
  EvaluationTypeWeighting,
} from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function EvaluationWeightingDialog({
  isDialogOpen,
  cycles,
  activeCycle,
  handleSubmit,
  closeDialog,
}: {
  isDialogOpen: boolean;
  activeCycle: string | undefined;
  cycles: Cycle[];
  handleSubmit: (value: {
    evaluationWeighting: EvaluationTypeWeighting;
    cycle_id: string;
  }) => void;
  closeDialog: () => void;
}) {
  const { formatMessage } = useIntl();

  const [isEvaluationWeightingLoading, setIsEvaluationWeightingLoading] =
    useState<boolean>(false);
  const [evaluationWeightingNotif, setEvaluationWeightingNotif] =
    useState<useNotification>();
  const [evaluationWeighting, setEvaluationWeighting] =
    useState<EvaluationTypeWeighting>();
  const [formikCa, setFormikCa] = useState<number>(0);
  const [formikExam, setFormikExam] = useState<number>(0);

  const initialValues: {
    minimum_modulation_score: number;
    ca: number;
    exam: number;
  } = {
    ca: 40,
    exam: 60,
    minimum_modulation_score: 8,
  };
  const validationSchema = Yup.object().shape({
    minimum_modulation_score: Yup.number()
      .min(0, formatMessage({ id: 'greaterOrEqual0' }))
      .max(20, formatMessage({ id: 'lesserOrEqual20' }))
      .required(formatMessage({ id: 'required' })),
    ca: Yup.number()
      .min(100 - formikExam, formatMessage({ id: 'greaterOrEqual0' }))
      .max(100 - formikExam, formatMessage({ id: 'lesserOrEqual100' }))
      .required(formatMessage({ id: 'required' })),
    exam: Yup.number()
      .min(100 - formikCa, formatMessage({ id: 'greaterOrEqual0' }))
      .max(100 - formikCa, formatMessage({ id: 'lesserOrEqual100' }))
      .required(formatMessage({ id: 'required' })),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: ({ ca, exam, minimum_modulation_score }, { resetForm }) => {
      if (evaluationWeighting && activeCycleId) {
        handleSubmit({
          evaluationWeighting: {
            minimum_modulation_score,
            evaluationTypeWeightings: [
              { evaluation_type: EvaluationType.CA, weight: ca },
              { evaluation_type: EvaluationType.EXAM, weight: exam },
            ],
          },
          cycle_id: activeCycleId,
        });
        resetForm();
        close();
      } else {
        const theNotif = new useNotification();
        theNotif.notify({
          render: formatMessage({ id: 'noEvaluationWeighting' }),
        });
        theNotif.update({
          type: 'ERROR',
          render: 'noEvaluationWeighting',
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    },
  });

  const close = () => {
    closeDialog();
    formik.resetForm();
  };

  const [adjustedWeighting, setAdjustedWeighting] = useState<{
    minimum_modulation_score: number;
    ca: number;
    exam: number;
  }>();
  const loadEvaluationWeighting = () => {
    setIsEvaluationWeightingLoading(true);
    const notif = new useNotification();
    if (evaluationWeightingNotif) {
      evaluationWeightingNotif.dismiss();
    }
    setEvaluationWeightingNotif(notif);
    setTimeout(() => {
      //TODO: call api here to load evaluationWeighting with data activeCycle
      if (6 > 5) {
        const newEvaluationWeighting: EvaluationTypeWeighting = {
          minimum_modulation_score: 8,
          evaluationTypeWeightings: [
            { evaluation_type: EvaluationType.CA, weight: 40 },
            { evaluation_type: EvaluationType.EXAM, weight: 60 },
          ],
        };
        setEvaluationWeighting(newEvaluationWeighting);
        const caa = newEvaluationWeighting.evaluationTypeWeightings.find(
          ({ evaluation_type: et }) => et === EvaluationType.CA
        );
        const exama = newEvaluationWeighting.evaluationTypeWeightings.find(
          ({ evaluation_type: et }) => et === EvaluationType.EXAM
        );
        setAdjustedWeighting({
          minimum_modulation_score:
            newEvaluationWeighting.minimum_modulation_score,
          ca: caa ? caa.weight : 39,
          exam: exama ? exama.weight : 61,
        });
        setIsEvaluationWeightingLoading(false);
        notif.dismiss();
        setEvaluationWeightingNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingEvaluationWeighting' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadEvaluationWeighting}
              notification={notif}
              message={formatMessage({ id: 'getEvaluationWeightingFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [activeCycleId, setActiveCycleId] = useState<string | undefined>(
    activeCycle
  );

  useEffect(() => {
    if (isDialogOpen && activeCycleId) {
      loadEvaluationWeighting();
    }
    return () => {
      //TODO: CLEANUP FETCH ABOVE
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogOpen, activeCycleId]);

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={close}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            columnGap: theme.spacing(2),
            alignItems: 'center',
            paddingRight: theme.spacing(3),
          }}
        >
          <DialogTitle>
            {formatMessage({ id: 'evaluationWeighting' })}
          </DialogTitle>
          <FormControl>
            <InputLabel id="cycle">{formatMessage({ id: 'cycle' })}</InputLabel>
            <Select
              size="small"
              labelId="cycle"
              disabled={isEvaluationWeightingLoading}
              onChange={(event) => setActiveCycleId(event.target.value)}
              value={activeCycleId}
              input={<OutlinedInput label={formatMessage({ id: 'cycle' })} />}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 48 * 4.5 + 8,
                  },
                },
              }}
            >
              {cycles.map(
                ({ cycle_id, cycle_name, number_of_years: noy }, index) => (
                  <MenuItem key={index} value={cycle_id}>
                    {`${cycle_name}(${noy} ${formatMessage({ id: 'years' })})`}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </Box>
        <DialogContent sx={{ display: 'grid', rowGap: theme.spacing(2) }}>
          <DialogContentText>
            {formatMessage({ id: 'evaluationWeightingDialogMessage' })}
          </DialogContentText>
          <Box
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              columnGap: theme.spacing(2),
              alignItems: 'center',
            }}
          >
            <TextField
              placeholder={formatMessage({ id: 'ca' })}
              label={formatMessage({ id: 'ca' })}
              fullWidth
              required
              color="primary"
              type="number"
              disabled={isEvaluationWeightingLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2">%</Typography>
                  </InputAdornment>
                ),
              }}
              {...formik.getFieldProps('ca')}
              onChange={(event) => {
                formik.setFieldValue('ca', event.target.value);
                setFormikCa(Number(event.target.value));
              }}
              error={formik.touched.ca && Boolean(formik.errors.ca)}
              helperText={formik.touched.ca && formik.errors.ca}
            />
            <TextField
              placeholder={formatMessage({ id: 'exam' })}
              label={formatMessage({ id: 'exam' })}
              fullWidth
              required
              color="primary"
              disabled={isEvaluationWeightingLoading}
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2">%</Typography>
                  </InputAdornment>
                ),
              }}
              {...formik.getFieldProps('exam')}
              onChange={(event) => {
                formik.setFieldValue('exam', event.target.value);
                setFormikExam(Number(event.target.value));
              }}
              error={formik.touched.exam && Boolean(formik.errors.exam)}
              helperText={formik.touched.exam && formik.errors.exam}
            />
          </Box>
          <Divider />
          <DialogContentText>
            {formatMessage({ id: 'minimumModulationScoreMessage' })}
          </DialogContentText>
          <TextField
            placeholder={formatMessage({ id: 'minimum_modulation_score' })}
            label={formatMessage({ id: 'minimum_modulation_score' })}
            fullWidth
            required
            color="primary"
            disabled={isEvaluationWeightingLoading}
            type="number"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="body2">%</Typography>
                </InputAdornment>
              ),
            }}
            {...formik.getFieldProps('minimum_modulation_score')}
            error={
              formik.touched.minimum_modulation_score &&
              Boolean(formik.errors.minimum_modulation_score)
            }
            helperText={
              formik.touched.minimum_modulation_score &&
              formik.errors.minimum_modulation_score
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ textTransform: 'none' }}
            color="error"
            variant="text"
            onClick={close}
          >
            {formatMessage({ id: 'cancel' })}
          </Button>
          <Button
            sx={{ textTransform: 'none' }}
            color="primary"
            variant="contained"
            disabled={
              isEvaluationWeightingLoading ||
              (formik.values.ca === adjustedWeighting?.ca &&
                formik.values.exam === adjustedWeighting?.exam &&
                formik.values.minimum_modulation_score ===
                  adjustedWeighting?.minimum_modulation_score)
            }
            type="submit"
          >
            {formatMessage({ id: 'save' })}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
