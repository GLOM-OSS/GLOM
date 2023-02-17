import { KeyboardBackspaceOutlined, ReportRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  lighten,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import { StudentDetail } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import DetailLine from 'apps/app/src/components/registry/students/detailLine';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router';

export default function StudentDetails() {
  const { formatMessage, formatDate } = useIntl();
  const { student_id } = useParams();
  const navigate = useNavigate();

  const [isStudentDetailLoading, setIsStudentDetailLoading] =
    useState<boolean>(false);
  const [studentDetail, setStudentDetail] = useState<StudentDetail>();
  const [studentDetailNotif, setStudentDetailNotif] =
    useState<useNotification>();

  const loadStudentDetails = (student_id: string) => {
    setIsStudentDetailLoading(true);
    const notif = new useNotification();
    if (studentDetailNotif) {
      studentDetailNotif.dismiss();
    }
    setStudentDetailNotif(notif);
    setTimeout(() => {
      //TODO: CALL API HERE TO LOAD student detail with data student_id
      // eslint-disable-next-line no-constant-condition
      if (5 > 4) {
        const newStudentDetail: StudentDetail = {
          annual_student_id: 'sieodsl',
          birthdate: new Date(),
          classroom_acronym: 'IRT3',
          email: 'nguemeteulriche@gmail.com',
          first_name: 'Ulriche Gaella',
          gender: 'Female',
          is_active: true,
          last_name: 'Mache Nguemete',
          matricule: '18C005',
          national_id_number: '000310122',
          phone_number: '693256789',
          preferred_lang: 'en',
          tutorInfo: {
            birthdate: new Date(),
            email: 'lorraintchakoumi@gmail.com',
            first_name: 'Lorrain',
            gender: 'Male',
            last_name: 'Kouatchoua Tchakoumi',
            national_id_number: '000316122',
            phone_number: '681382151',
          },
        };
        setStudentDetail(newStudentDetail);
        setIsStudentDetailLoading(false);
        notif.dismiss();
        setStudentDetailNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingStudentDetail' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => loadStudentDetails(student_id)}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'getStudentDetailFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  useEffect(() => {
    loadStudentDetails(student_id as string);
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
        <Tooltip arrow title={formatMessage({ id: 'back' })}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => navigate('/registry/student-management/students')}
            startIcon={<KeyboardBackspaceOutlined fontSize="large" />}
          />
        </Tooltip>
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
