import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { DialogTransition } from '@squoolr/confirm-dialogs';
import { CreateAssessment } from '@squoolr/interfaces';
import { theme } from '@glom/theme';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';

export default function CreateAssignmentDialog({
  isDialogOpen,
  handleSubmit,
  closeDialog,
  totalStudents,
}: {
  isDialogOpen: boolean;
  handleSubmit: (value: CreateAssessment) => void;
  closeDialog: () => void;
  totalStudents: number;
}) {
  const { formatMessage, formatNumber } = useIntl();
  const { annual_credit_unit_subject_id } = useParams();

  const [numberPerGoup, setNumberPerGroup] = useState<number>(1);
  const [submissionType, setSubmissionType] = useState<'Individual' | 'Group'>(
    'Group'
  );

  const close = () => {
    closeDialog();
    setNumberPerGroup(1);
    setSubmissionType('Group');
  };

  useEffect(() => {
    if (totalStudents <= 1) {
      setSubmissionType('Individual');
      setNumberPerGroup(1);
    } else {
      setSubmissionType('Group');
      setNumberPerGroup(2);
    }
  }, [totalStudents, isDialogOpen]);

  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={close}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const val: CreateAssessment = {
            annual_credit_unit_subject_id:
              annual_credit_unit_subject_id as string,
            submission_type: submissionType,
            is_assignment: true,
          };
          if (submissionType === 'Individual' && numberPerGoup === 1) {
            handleSubmit(val);
            close();
          } else if (submissionType === 'Group' && numberPerGoup > 1) {
            handleSubmit({ ...val, number_per_group: numberPerGoup });
            close();
          } else
            alert(
              formatMessage({
                id:
                  submissionType === 'Group'
                    ? 'atLeastTwoPerGroup'
                    : 'mustBeOnePersonPerSubmission',
              })
            );
        }}
      >
        <DialogTitle>
          {formatMessage({
            id: 'assignmentType',
          })}
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'grid',
            rowGap: 2,
          }}
        >
          <FormControl sx={{ marginTop: 1 }}>
            <InputLabel id="submissionType">
              {formatMessage({ id: 'submissionType' })}
            </InputLabel>
            <Select
              labelId="submissionType"
              value={submissionType}
              sx={{ minWidth: '200px' }}
              size="small"
              onChange={(event) => {
                setSubmissionType(event.target.value as 'Individual' | 'Group');
                setNumberPerGroup(event.target.value === 'Group' ? 2 : 1);
              }}
              input={
                <OutlinedInput
                  label={formatMessage({ id: 'submissionType' })}
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
              {(totalStudents > 1
                ? ['Individual', 'Group']
                : ['Individual']
              ).map((_, index) => (
                <MenuItem key={index} value={_}>
                  {formatMessage({ id: _ })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {submissionType === 'Group' && (
            <Box>
              <Typography>
                {formatMessage({ id: 'totalStudents' })}{' '}
                <Typography fontWeight={700} component="span">
                  {formatNumber(totalStudents)}
                </Typography>
              </Typography>
              <TextField
                sx={{ marginTop: theme.spacing(1) }}
                placeholder={formatMessage({ id: 'numberPerGroup' })}
                label={formatMessage({ id: 'numberPerGroup' })}
                required
                color="primary"
                size="small"
                type="number"
                value={numberPerGoup}
                onChange={(event) => {
                  const val = Number(event.target.value);
                  if (val >= 2 && val <= totalStudents)
                    setNumberPerGroup(Number(event.target.value));
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ textTransform: 'none' }}
            color="error"
            variant="text"
            onClick={close}
            size="small"
          >
            {formatMessage({ id: 'cancel' })}
          </Button>
          <Button
            sx={{ textTransform: 'none' }}
            color="primary"
            variant="contained"
            type="submit"
            size="small"
          >
            {formatMessage({ id: 'confirmCreate' })}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
