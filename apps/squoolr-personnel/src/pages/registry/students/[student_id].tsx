import { KeyboardBackspaceOutlined, ReportRounded } from '@mui/icons-material';
import { Box, Chip, Fab, lighten, Skeleton, Typography } from '@mui/material';
import { getStudentDetails } from '@squoolr/api-services';
import { StudentDetail } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router';
import DetailLine from '../../../components/registry/students/detailLine';

export default function StudentDetails() {
  const { formatMessage, formatDate } = useIntl();
  const { student_id: annual_student_id } = useParams();
  const navigate = useNavigate();

  const [isStudentDetailLoading, setIsStudentDetailLoading] =
    useState<boolean>(false);
  const [studentDetail, setStudentDetail] = useState<StudentDetail>();
  const [studentDetailNotif, setStudentDetailNotif] =
    useState<useNotification>();

  const loadStudentDetails = (annual_student_id: string) => {
    setIsStudentDetailLoading(true);
    const notif = new useNotification();
    if (studentDetailNotif) {
      studentDetailNotif.dismiss();
    }
    setStudentDetailNotif(notif);
    getStudentDetails(annual_student_id)
      .then((studentDetails) => {
        setStudentDetail(studentDetails);
        setIsStudentDetailLoading(false);
        notif.dismiss();
        setStudentDetailNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingStudentDetail' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadStudentDetails(annual_student_id)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({ id: 'getStudentDetailFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    loadStudentDetails(annual_student_id as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ display: 'grid', rowGap: 4 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto auto auto auto auto 1fr',
          alignItems: 'center',
          columnGap: 2,
        }}
      >
        <Fab
          color="primary"
          aria-label={formatMessage({ id: 'back' })}
          size="small"
          onClick={() => navigate('/registry/student-management/students')}
        >
          <KeyboardBackspaceOutlined fontSize="small" />
        </Fab>
        <Typography variant="h6">
          {isStudentDetailLoading ? (
            <Skeleton animation="wave" width={100} />
          ) : studentDetail ? (
            studentDetail.matricule
          ) : (
            formatMessage({ id: 'notAvailable' })
          )}
        </Typography>
        <Typography variant="h6">
          {isStudentDetailLoading ? (
            <Skeleton animation="wave" width={100} />
          ) : studentDetail ? (
            `${studentDetail.first_name} ${studentDetail.last_name}`
          ) : (
            formatMessage({ id: 'notAvailable' })
          )}
        </Typography>
        <Chip
          label={
            studentDetail
              ? studentDetail.classroom_acronym
              : formatMessage({ id: 'notAvailable' })
          }
          size="small"
          sx={{
            backgroundColor: lighten(theme.palette.primary.main, 0.6),
          }}
        />
        <Chip
          label={
            studentDetail
              ? formatMessage({
                  id: studentDetail.is_active ? 'active' : 'inactive',
                })
              : formatMessage({ id: 'notAvailable' })
          }
          size="small"
          sx={{
            backgroundColor: lighten(
              theme.palette[studentDetail?.is_active ? 'success' : 'error']
                .main,
              0.6
            ),
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto auto 1fr',
          columnGap: 6,
          alignItems: 'start',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            rowGap: 2,
            borderRight: `1px solid ${theme.common.line}`,
            paddingRight: 6,
          }}
        >
          <Typography variant="h6">
            {formatMessage({ id: 'studentInformation' })}
          </Typography>
          <Box sx={{ display: 'grid', rowGap: 2 }}>
            <DetailLine
              isLoading={isStudentDetailLoading}
              title={formatMessage({ id: 'phone' })}
              value={
                studentDetail
                  ? studentDetail.phone_number
                  : formatMessage({ id: 'notAvailable' })
              }
            />
            <DetailLine
              isLoading={isStudentDetailLoading}
              title={formatMessage({ id: 'email' })}
              value={
                studentDetail
                  ? studentDetail.email
                  : formatMessage({ id: 'notAvailable' })
              }
            />
            <DetailLine
              isLoading={isStudentDetailLoading}
              title={formatMessage({ id: 'gender' })}
              value={
                studentDetail
                  ? formatMessage({ id: studentDetail.gender })
                  : formatMessage({ id: 'notAvailable' })
              }
            />
            <DetailLine
              isLoading={isStudentDetailLoading}
              title={formatMessage({ id: 'originRegion' })}
              value={
                studentDetail
                  ? studentDetail.home_region
                    ? studentDetail.home_region
                    : formatMessage({
                        id: 'notAvailable',
                      })
                  : formatMessage({ id: 'notAvailable' })
              }
            />
            <DetailLine
              isLoading={isStudentDetailLoading}
              title={formatMessage({ id: 'employmentStatus' })}
              value={
                studentDetail
                  ? formatMessage({
                      id: studentDetail.employment_status
                        ? studentDetail.employment_status
                        : 'notAvailable',
                    })
                  : formatMessage({ id: 'notAvailable' })
              }
            />
            <DetailLine
              isLoading={isStudentDetailLoading}
              title={formatMessage({ id: 'birthdate' })}
              value={
                studentDetail
                  ? formatDate(studentDetail.birthdate, {
                      year: 'numeric',
                      month: 'long',
                      day: '2-digit',
                    })
                  : formatMessage({ id: 'notAvailable' })
              }
            />
            <DetailLine
              isLoading={isStudentDetailLoading}
              title={formatMessage({ id: 'primaryLanguage' })}
              value={
                studentDetail
                  ? formatMessage({
                      id: studentDetail.preferred_lang,
                    })
                  : formatMessage({ id: 'notAvailable' })
              }
            />
            <DetailLine
              isLoading={isStudentDetailLoading}
              title={formatMessage({ id: 'maritalStatus' })}
              value={
                studentDetail
                  ? formatMessage({
                      id: studentDetail.civil_status
                        ? studentDetail.civil_status
                        : 'notAvailable',
                    })
                  : formatMessage({ id: 'notAvailable' })
              }
            />
            <DetailLine
              isLoading={isStudentDetailLoading}
              title={formatMessage({ id: 'placeOfBirth' })}
              value={
                studentDetail
                  ? studentDetail.birthplace
                    ? studentDetail.birthplace
                    : formatMessage({
                        id: 'notAvailable',
                      })
                  : formatMessage({ id: 'notAvailable' })
              }
            />
            <DetailLine
              isLoading={isStudentDetailLoading}
              title={formatMessage({ id: 'religion' })}
              value={
                studentDetail
                  ? formatMessage({
                      id: studentDetail.religion
                        ? studentDetail.religion
                        : 'notAvailable',
                    })
                  : formatMessage({ id: 'notAvailable' })
              }
            />
            <DetailLine
              isLoading={isStudentDetailLoading}
              title={formatMessage({ id: 'nationality' })}
              value={
                studentDetail
                  ? studentDetail.nationality
                    ? studentDetail.nationality
                    : formatMessage({
                        id: 'notAvailable',
                      })
                  : formatMessage({ id: 'notAvailable' })
              }
            />
            <DetailLine
              isLoading={isStudentDetailLoading}
              title={formatMessage({ id: 'isHandicaped' })}
              value={
                studentDetail
                  ? studentDetail.handicap
                    ? studentDetail.handicap
                    : formatMessage({
                        id: 'notAvailable',
                      })
                  : formatMessage({ id: 'notAvailable' })
              }
            />
          </Box>
        </Box>
        <Box sx={{ display: 'grid', rowGap: 2 }}>
          <Typography variant="h6">
            {formatMessage({ id: 'tutorInformation' })}
          </Typography>
          <Box sx={{ display: 'grid', rowGap: 2 }}>
            <DetailLine
              isLoading={isStudentDetailLoading}
              title={formatMessage({ id: 'fullname' })}
              value={
                studentDetail
                  ? `${studentDetail.tutorInfo.first_name} ${studentDetail.tutorInfo.last_name}`
                  : formatMessage({ id: 'notAvailable' })
              }
            />
            <DetailLine
              isLoading={isStudentDetailLoading}
              title={formatMessage({ id: 'residenceCountry' })}
              value={
                studentDetail
                  ? studentDetail.tutorInfo.nationality
                    ? studentDetail.tutorInfo.nationality
                    : formatMessage({
                        id: 'notAvailable',
                      })
                  : formatMessage({ id: 'notAvailable' })
              }
            />

            <DetailLine
              isLoading={isStudentDetailLoading}
              title={formatMessage({ id: 'phoneNumber' })}
              value={
                studentDetail
                  ? studentDetail.tutorInfo.phone_number
                  : formatMessage({ id: 'notAvailable' })
              }
            />
            <DetailLine
              isLoading={isStudentDetailLoading}
              title={formatMessage({ id: 'residenceTown' })}
              value={
                studentDetail
                  ? studentDetail.tutorInfo.home_region
                    ? studentDetail.tutorInfo.home_region
                    : formatMessage({
                        id: 'notAvailable',
                      })
                  : formatMessage({ id: 'notAvailable' })
              }
            />
            <DetailLine
              isLoading={isStudentDetailLoading}
              title={formatMessage({ id: 'email' })}
              value={
                studentDetail
                  ? studentDetail.tutorInfo.email
                  : formatMessage({ id: 'notAvailable' })
              }
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
