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
import { Assessment, EvaluationSubTypeEnum } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
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
    setTimeout(() => {
      //TODO: call api here to load assessments
      if (6 > 5) {
        const newAssessments: Assessment[] = [
          {
            annual_credit_unit_subject_id: 'lsei',
            assessment_date: null,
            assessment_id: 'sei',
            chapter_id: 'sei',
            created_at: new Date(),
            duration: 10,
            evaluation_sub_type_name: EvaluationSubTypeEnum.ASSIGNMENT,
            total_mark: 0,
          },
        ];
        setAssessments(newAssessments);
        setAreAssessmentsLoading(false);
        notif.dismiss();
        setAssessmentNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingAssessments' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadAssessments()}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'getAssessmentsFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
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
