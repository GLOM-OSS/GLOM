import { ReportRounded } from '@mui/icons-material';
import {
  Box,
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
import { NoTableElement, TableLaneSkeleton } from '../helpers/tables';
import AssessmentLane from './assessmentLane';

export default function AssessmentList({
  isCreatingAssessment,
  setActiveAssessment,
  isAssignment = false,
}: {
  createAssessment: () => void;
  isCreatingAssessment: boolean;
  setActiveAssessment: (assessment: Assessment) => void;
  isAssignment?: boolean;
}) {
  const { formatMessage } = useIntl();
  const { annual_credit_unit_subject_id } = useParams();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [areAssessmentsLoading, setAreAssessmentsLoading] =
    useState<boolean>(false);
  const [assessmentNotif, setAssessmentNotif] = useState<useNotification>();

  const loadAssessments = (
    annual_credit_unit_subject_id: string,
    isAssignment: boolean
  ) => {
    setAreAssessmentsLoading(true);
    const notif = new useNotification();
    if (assessmentNotif) {
      assessmentNotif.dismiss();
    }
    setAssessmentNotif(notif);
    getCourseAssessments(annual_credit_unit_subject_id, isAssignment)
      .then((assessments) => {
        setAssessments(assessments);
        setAreAssessmentsLoading(false);
        notif.dismiss();
        setAssessmentNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({
            id: isAssignment ? 'loadingAssignments' : 'loadingAssessments',
          }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() =>
                loadAssessments(annual_credit_unit_subject_id, isAssignment)
              }
              notification={notif}
              message={
                error?.message ||
                formatMessage({
                  id: isAssignment
                    ? 'getAssignmentsFailed'
                    : 'getAssessmentsFailed',
                })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    loadAssessments(annual_credit_unit_subject_id as string, isAssignment);
    return () => {
      //TODO: cleanup axios call above
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ll = [
    'number',
    'createdAt',
    'evaluationDate',
    'evaluationType',
    'duration',
  ];

  const kk = ['number', 'creationDate', 'dueDate', 'submissionType'];

  const displayTableHeader = isAssignment ? kk : ll;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        rowGap: theme.spacing(1),
        height: '100%',
      }}
    >
      <Typography variant="h6">
        {formatMessage({ id: isAssignment ? 'assignments' : 'assessments' })}
      </Typography>
      <Scrollbars autoHide>
        <Table sx={{ minWidth: 650 }}>
          <TableHead
            sx={{
              backgroundColor: lighten(theme.palette.primary.light, 0.6),
            }}
          >
            <TableRow>
              {displayTableHeader.map((val, index) => (
                <TableCell key={index}>{formatMessage({ id: val })}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {areAssessmentsLoading ? (
              [...new Array(10)].map((_, index) => (
                <TableLaneSkeleton cols={isAssignment ? 4 : 5} key={index} />
              ))
            ) : assessments.length === 0 ? (
              <NoTableElement
                message={formatMessage({
                  id: isAssignment
                    ? 'noAssignmentAvailableYet'
                    : 'noAssessmentsAvailableYet',
                })}
                colSpan={isAssignment ? 4 : 5}
              />
            ) : (
              assessments.map((assessment, index) => (
                <AssessmentLane
                  disabled={isCreatingAssessment}
                  assessment={assessment}
                  position={index + 1}
                  onSelect={() => setActiveAssessment(assessment)}
                  isAssignment={isAssignment}
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
