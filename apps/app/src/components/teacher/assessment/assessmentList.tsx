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
  Typography,
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
    if (isAssignment) {
      setTimeout(() => {
        //TODO: CALL API HERE TO LOAD course assignments
        // eslint-disable-next-line no-constant-condition
        if (5 > 4) {
          const newAssignments: Assessment[] = [
            {
              annual_credit_unit_subject_id: 'lsie',
              assessment_date: new Date(),
              assessment_id: 'eisoe',
              chapter_id: 'sieo',
              created_at: new Date(),
              duration: null,
              evaluation_sub_type_name: 'eiwo',
              is_published: false,
              number_per_group: 1,
              submission_type: 'Group',
              total_mark: 4,
            },
          ];
          setAssessments(newAssignments);
          setAreAssessmentsLoading(false);
          notif.dismiss();
          setAssessmentNotif(undefined);
        } else {
          notif.notify({
            render: formatMessage({ id: 'loadingAssignments' }),
          });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() =>
                  loadAssessments(annual_credit_unit_subject_id, isAssignment)
                }
                notification={notif}
                //TODO: message should come from backend
                message={formatMessage({ id: 'getAssignmentsFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    } else {
      getCourseAssessments(annual_credit_unit_subject_id)
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
    }
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
          {formatMessage({ id: isAssignment ? 'assignments' : 'assessments' })}
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
          {formatMessage({
            id: isAssignment ? 'newAssignment' : 'newAssessment',
          })}
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
