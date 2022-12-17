import { AddRounded, ReportRounded } from '@mui/icons-material';
import {
  Box,
  Chip,
  Fab,
  lighten,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { ConfirmDeleteDialog } from '@squoolr/dialogTransition';
import {
  CreateCreditUnitSubject,
  CreditUnit,
  CreditUnitSubject,
} from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import { RowMenu } from '../../components/coordinator/CreditUnitLane';
import SubjectDialog from '../../components/coordinator/subjectDialog';
import SubjectLane, {
  DisplaySubject,
  SubjectSkeleton,
} from '../../components/coordinator/subjectLane';

export default function SubjectManagement() {
  const { formatMessage } = useIntl();
  const { annual_credit_unit_id } = useParams();

  const [subjects, setSubjects] = useState<DisplaySubject[]>([]);
  const [areSubjectsLoading, setAreSubjectsLoading] = useState<boolean>(false);
  const [subjectNotif, setSubjectNotif] = useState<useNotification>();

  const transformCreditUnitSubjectToDisplaySubject = (
    s: CreditUnitSubject
  ): DisplaySubject => {
    const theory = s.subjectParts.find(
      ({ subject_part_id: sp_id }) =>
        sp_id === process.env['NX_THEORY_SUBJECT_PART_ID']
    );
    const p = s.subjectParts.find(
      ({ subject_part_id: sp_id }) =>
        sp_id === process.env['NX_PRACTICAL_SUBJECT_PART_ID']
    );
    const gw = s.subjectParts.find(
      ({ subject_part_id: sp_id }) =>
        sp_id === process.env['NX_GUIDED_WORK_SUBJECT_PART_ID']
    );
    return {
      annual_credit_unit_id: s.annual_credit_unit_id,
      annual_credit_unit_subject_id: s.annual_credit_unit_subject_id,
      main_teacher_fullname: s.main_teacher_fullname,
      objective: s.objective,
      subject_code: s.subject_code,
      subject_title: s.subject_title,
      weighting: s.weighting,
      theory: theory ? theory.number_of_hours : 0,
      guided_work: gw ? gw.number_of_hours : 0,
      practical: p ? p.number_of_hours : 0,
      annual_teacher_id: s.subjectParts.length===0?undefined: s.subjectParts[0].annual_teacher_id
    } as DisplaySubject;
  };

  const transformDisplaySubjectToCreateCreditUnitSubect = (
    s: DisplaySubject
  ): CreateCreditUnitSubject => {
    return {
      annual_credit_unit_id: s.annual_credit_unit_id,
      objective: s.objective as string,
      subject_code: s.subject_code,
      subject_title: s.subject_title,
      subjectParts: [
        {
          annual_teacher_id: s.annual_teacher_id as string,
          number_of_hours: s.theory,
          subject_part_id: process.env['NX_THEORY_SUBJECT_PART_ID'] as string,
        },
        {
          annual_teacher_id: s.annual_teacher_id as string,
          number_of_hours: s.practical,
          subject_part_id: process.env[
            'NX_PRACTICAL_SUBJECT_PART_ID'
          ] as string,
        },
        {
          annual_teacher_id: s.annual_teacher_id as string,
          number_of_hours: s.guided_work,
          subject_part_id: process.env[
            'NX_GUIDED_WORK_SUBJECT_PART_ID'
          ] as string,
        },
      ],
      weighting: s.weighting,
    };
  };

  const transformDisplaySubjectToCreditUnitSubect = (
    s: DisplaySubject
  ): CreditUnitSubject => {
    return {
      annual_credit_unit_id: s.annual_credit_unit_id,
      annual_credit_unit_subject_id: s.annual_credit_unit_subject_id,
      main_teacher_fullname: s.main_teacher_fullname,
      objective: s.objective,
      subject_code: s.subject_code,
      subject_title: s.subject_title,
      subjectParts: [
        {
          annual_teacher_id: s.annual_teacher_id as string,
          number_of_hours: s.theory,
          subject_part_id: process.env['NX_THEORY_SUBJECT_PART_ID'] as string,
        },
        {
          annual_teacher_id: s.annual_teacher_id as string,
          number_of_hours: s.practical,
          subject_part_id: process.env[
            'NX_PRACTICAL_SUBJECT_PART_ID'
          ] as string,
        },
        {
          annual_teacher_id: s.annual_teacher_id as string,
          number_of_hours: s.guided_work,
          subject_part_id: process.env[
            'NX_GUIDED_WORK_SUBJECT_PART_ID'
          ] as string,
        },
      ],
      weighting: s.weighting,
    };
  };

  const loadSubjects = () => {
    setAreSubjectsLoading(true);
    const notif = new useNotification();
    if (subjectNotif) {
      subjectNotif.dismiss();
    }
    setSubjectNotif(notif);
    setTimeout(() => {
      //TODO: call api here to load creditUnit's subjects with data annual_credit_unit_id
      if (6 > 5) {
        const newSubjects: CreditUnitSubject[] = [
          {
            annual_credit_unit_id: '',
            annual_credit_unit_subject_id: '',
            main_teacher_fullname: 'Dr. Kuidja Marco Aristin',
            objective: null,
            subject_code: 'UV0015D',
            subject_title: 'Algorithmes II',
            weighting: 0.6,
            subjectParts: [
              {
                annual_teacher_id: '',
                number_of_hours: 32,
                subject_part_id: 'b0e4bcf8-7ccb-11ed-a1eb-0242ac120002',
              },
              {
                annual_teacher_id: '',
                number_of_hours: 32,
                subject_part_id: 'b0e4c298-7ccb-11ed-a1eb-0242ac120002',
              },
              {
                annual_teacher_id: '',
                number_of_hours: 32,
                subject_part_id: 'b0e4c46e-7ccb-11ed-a1eb-0242ac120002',
              },
            ],
          },
        ];

        setSubjects(
          newSubjects.map((subject) =>
            transformCreditUnitSubjectToDisplaySubject(subject)
          )
        );
        setAreSubjectsLoading(false);
        notif.dismiss();
        setSubjectNotif(undefined);
      } else {
        notif.notify({ render: formatMessage({ id: 'loadingSubjects' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadSubjects}
              notification={notif}
              message={formatMessage({ id: 'getSubjectsFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [creditUnit, setCreditUnit] = useState<CreditUnit>();
  const [isCreditUnitLoading, setIsCreditUnitLoading] =
    useState<boolean>(false);
  const [creditUnitNotif, setCreditUnitNotif] = useState<useNotification>();

  const loadCreditUnitData = () => {
    setIsCreditUnitLoading(true);
    const notif = new useNotification();
    if (creditUnitNotif) {
      creditUnitNotif.dismiss();
    }
    setCreditUnitNotif(notif);
    setTimeout(() => {
      //TODO: CALL API HERE to get creditUnit with data annual_credit_unit_id
      if (6 > 5) {
        const newCreditUnit: CreditUnit = {
          annual_credit_unit_id: '',
          credit_points: 8,
          credit_unit_code: 'UE00125',
          credit_unit_name: 'Informatique II',
          major_id: '',
          semester_number: 2,
        };
        setCreditUnit(newCreditUnit);
        setIsCreditUnitLoading(false);
        notif.dismiss();
        setCreditUnitNotif(undefined);
      } else {
        notif.notify({ render: formatMessage({ id: 'loadingCreditUnit' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadCreditUnitData}
              notification={notif}
              message={formatMessage({ id: 'getCreditUnitDataFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  useEffect(() => {
    loadSubjects();
    loadCreditUnitData();
    return () => {
      //TODO: ABORT PREVIOUS AXIOS FETCH HERE
      console.log('cleanup previous axios fetch here by aborting it');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [actionnedSubject, setActionnedSubject] = useState<DisplaySubject>();
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);

  const getActionnedSubject = (subject: DisplaySubject) => {
    setActionnedSubject(subject);
  };

  const [isSubmittingSubject, setIsManagingSubject] = useState<boolean>(false);
  const [manageNotif, setManageNotif] = useState<useNotification>();

  const deleteSubject = (subject: DisplaySubject) => {
    if (actionnedSubject) {
      setIsManagingSubject(true);
      const notif = new useNotification();
      if (manageNotif) manageNotif.dismiss();
      setManageNotif(notif);
      notif.notify({ render: formatMessage({ id: 'deletingSubject' }) });
      setTimeout(() => {
        //TODO: CALL API HERE TO DELETE CREDIT UNIT WITH DATA subject.annual_credit_unit_id
        if (5 > 4) {
          notif.update({
            render: formatMessage({ id: 'deletedSuccessfully' }),
          });
          setIsManagingSubject(false);
          setSubjects(
            subjects.filter(
              ({ annual_credit_unit_id: acu }) =>
                acu !== subject.annual_credit_unit_id
            )
          );
          setActionnedSubject(undefined);
          setIsConfirmDeleteDialogOpen(false);
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => deleteSubject(subject)}
                notification={notif}
                message={formatMessage({ id: 'deleteSubjectFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    }
  };

  const manageSubject = (subject: DisplaySubject) => {
    setIsManagingSubject(true);
    const notif = new useNotification();
    if (manageNotif) manageNotif.dismiss();
    setManageNotif(notif);
    if (actionnedSubject) {
      notif.notify({ render: formatMessage({ id: 'editingSubject' }) });
      setTimeout(() => {
        const submitData = transformDisplaySubjectToCreditUnitSubect(subject);
        //TODO: CALL API HERE TO edit CREDIT UNIT WITH DATA submitData
        if (5 > 4) {
          notif.update({
            render: formatMessage({ id: 'editedSuccessfully' }),
          });
          setIsManagingSubject(false);
          setSubjects([
            ...subjects.filter(
              ({ annual_credit_unit_id: acu }) =>
                acu !== subject.annual_credit_unit_id
            ),
            subject,
          ]);
          setActionnedSubject(undefined);
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => manageSubject(subject)}
                notification={notif}
                message={formatMessage({ id: 'editSubjectFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    } else {
      notif.notify({ render: formatMessage({ id: 'creatingSubject' }) });
      setTimeout(() => {
        const submitData =
          transformDisplaySubjectToCreateCreditUnitSubect(subject);
        //TODO: CALL API HERE TO create CREDIT UNIT WITH DATA submitData
        if (5 > 4) {
          notif.update({
            render: formatMessage({ id: 'createdSuccessfully' }),
          });
          setIsManagingSubject(false);
          //TODO: replace newSubject object with response from backend after creation
          const newSubject: CreditUnitSubject = {
            ...submitData,
            annual_credit_unit_subject_id: 'lsie',
            main_teacher_fullname: 'siels',
          };
          setSubjects([
            transformCreditUnitSubjectToDisplaySubject(newSubject),
            ...subjects,
          ]);
          setActionnedSubject(undefined);
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => manageSubject(subject)}
                notification={notif}
                message={formatMessage({ id: 'createSubjectFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    }
  };

  return (
    <>
      <RowMenu
        anchorEl={anchorEl}
        closeMenu={() => setAnchorEl(null)}
        deleteItem={() => setIsConfirmDeleteDialogOpen(true)}
        editItem={() => setIsEditDialogOpen(true)}
      />
      <SubjectDialog
        handleSubmit={(values: DisplaySubject) => manageSubject(values)}
        closeDialog={() => {
          setActionnedSubject(undefined);
          setIsEditDialogOpen(false);
        }}
        isDialogOpen={isEditDialogOpen}
        editableCreditUnit={actionnedSubject}
        maxWeighting={
          1 -
          subjects.reduce((total, { weighting }) => {
            return weighting + total;
          }, 0)
        }
      />
      <ConfirmDeleteDialog
        closeDialog={() => {
          setIsConfirmDeleteDialogOpen(false);
          setActionnedSubject(undefined);
        }}
        confirm={() =>
          actionnedSubject ? deleteSubject(actionnedSubject) : null
        }
        deleteMessage={formatMessage({ id: 'confirmDeleteSubjectMessage' })}
        isDialogOpen={isConfirmDeleteDialogOpen}
      />
      <Box
        sx={{ display: 'grid', gridTemplateRows: 'auto 1fr', height: '100%' }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto auto auto 1fr',
            columnGap: theme.spacing(2),
            marginBottom: theme.spacing(2),
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 400 }}>
            {creditUnit ? (
              `${creditUnit.credit_unit_code} : ${creditUnit.credit_unit_name}`
            ) : (
              <Skeleton animation="wave" sx={{ width: '100px' }} />
            )}
          </Typography>
          <Chip
            sx={{ backgroundColor: lighten(theme.palette.success.light, 0.6) }}
            label={
              creditUnit ? (
                `${creditUnit.credit_points} ${formatMessage({
                  id: 'credits',
                })}`
              ) : (
                <Skeleton animation="wave" sx={{ width: '50px' }} />
              )
            }
            size="small"
          />
          <Chip
            sx={{ backgroundColor: lighten(theme.palette.success.light, 0.6) }}
            label={
              creditUnit ? (
                `${formatMessage({ id: 'semester' })} ${
                  creditUnit.semester_number
                }`
              ) : (
                <Skeleton animation="wave" sx={{ width: '100px' }} />
              )
            }
            size="small"
          />
        </Box>
        <Box sx={{ height: '100%', display: 'relative' }}>
          <Scrollbars autoHide>
            <Table sx={{ minWidth: 650 }}>
              <TableHead
                sx={{
                  backgroundColor: lighten(theme.palette.primary.light, 0.6),
                }}
              >
                <TableRow>
                  {[
                    'code',
                    'title',
                    'weight',
                    'cm',
                    'tp',
                    'td',
                    'total_hours',
                    'teacher',
                    'objectives',
                  ].map((val, index) => (
                    <TableCell key={index}>
                      {formatMessage({ id: val })}
                    </TableCell>
                  ))}
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {areSubjectsLoading ? (
                  [...new Array(10)].map((_, index) => (
                    <SubjectSkeleton key={index} />
                  ))
                ) : subjects.length === 0 ? (
                  <TableRow
                    sx={{
                      borderBottom: `1px solid ${theme.common.line}`,
                      borderTop: `1px solid ${theme.common.line}`,
                      padding: `0 ${theme.spacing(4.625)}`,
                    }}
                  >
                    <TableCell
                      colSpan={10}
                      align="center"
                      sx={{ textAlign: 'center' }}
                    >
                      {formatMessage({ id: 'noSubjectsYet' })}
                    </TableCell>
                  </TableRow>
                ) : (
                  subjects.map((subject, index) => (
                    <SubjectLane
                      setAnchorEl={setAnchorEl}
                      subject={subject}
                      getActionnedSubject={getActionnedSubject}
                      key={index}
                      isSubmitting={isSubmittingSubject}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </Scrollbars>
          <Fab
            disabled={
              areSubjectsLoading || isSubmittingSubject || isEditDialogOpen
            }
            onClick={() => setIsEditDialogOpen(true)}
            color="primary"
            sx={{ position: 'absolute', bottom: 16, right: 24 }}
          >
            <Tooltip arrow title={formatMessage({ id: `newSubject` })}>
              <AddRounded />
            </Tooltip>
          </Fab>
        </Box>
      </Box>
    </>
  );
}
