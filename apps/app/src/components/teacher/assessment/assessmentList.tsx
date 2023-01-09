import { AddOutlined, ReportRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  lighten,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { getCourseAssessments } from '@squoolr/api-services';
import { Assessment } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import { NoTableElement, TableLaneSkeleton } from '../courseLane';
import AssessmentLane from './assessmentLane';

export default function AssessmentList({
  createAssessment,
  isCreatingAssessment,
  setActiveAssessment,
}: {
  createAssessment: () => void;
  isCreatingAssessment: boolean;
  setActiveAssessment: (assessment: Assessment) => void;
}) {
  const { formatMessage } = useIntl();
  const { annual_credit_unit_subject_id } = useParams();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [areAssessmentsLoading, setAreAssessmentsLoading] =
    useState<boolean>(false);
  const [assessmentNotif, setAssessmentNotif] = useState<useNotification>();

  const loadAssessments = () => {
    setAreAssessmentsLoading(true);
    const notif = new useNotification();
    if (assessmentNotif) {
      assessmentNotif.dismiss();
    }
    setAssessmentNotif(notif);
    getCourseAssessments(annual_credit_unit_subject_id as string)
      .then((assessments) => {
        setAssessments(assessments);
        setAreAssessmentsLoading(false);
        notif.dismiss();
        setAssessmentNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingAssessments' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadAssessments()}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getAssessmentsFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    loadAssessments();
    return () => {
      //TODO: cleanup axios call above
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        rowGap: theme.spacing(1),
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          columnGap: theme.spacing(2),
        }}
      >
        <Typography variant="h6">
          {formatMessage({ id: 'assessments' })}
        </Typography>
        <Button
          onClick={createAssessment}
          variant="outlined"
          color="primary"
          sx={{ textTransform: 'none' }}
          size="small"
          disabled={isCreatingAssessment || areAssessmentsLoading}
          startIcon={
            <AddOutlined
              sx={{
                color: theme.palette.primary.light,
              }}
            />
          }
        >
          {formatMessage({ id: 'newAssessment' })}
        </Button>
      </Box>
      <Scrollbars autoHide>
        <Table sx={{ minWidth: 650 }}>
          <TableHead
            sx={{
              backgroundColor: lighten(theme.palette.primary.light, 0.6),
            }}
          >
            <TableRow>
              {[
                'number',
                'createdAt',
                'evaluationType',
                'evaluationDate',
                'duration',
              ].map((val, index) => (
                <TableCell key={index}>{formatMessage({ id: val })}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {areAssessmentsLoading ? (
              [...new Array(10)].map((_, index) => (
                <TableLaneSkeleton cols={5} key={index} />
              ))
            ) : assessments.length === 0 ? (
              <NoTableElement
                message={formatMessage({ id: 'noAssessmentsAvailableYet' })}
                colSpan={5}
              />
            ) : (
              assessments.map((assessment, index) => (
                <AssessmentLane
                  disabled={isCreatingAssessment}
                  assessment={assessment}
                  position={index + 1}
                  onSelect={() => setActiveAssessment(assessment)}
                  key={index}
                />
              ))
            )}
          </TableBody>
        </Table>
      </Scrollbars>
    </Box>
  );
}
