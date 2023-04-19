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
  Typography
} from '@mui/material';
import {
  addNewCreditUnitSubject,
  deleteCreditUnitSubject,
  getCreditUnitDetails,
  getCreditUnitSubjects,
  getSubjectParts,
  updateCreditUnitSubject
} from '@squoolr/api-services';
import { ConfirmDeleteDialog } from '@squoolr/dialogTransition';
import {
  CreateCreditUnitSubject,
  CreditUnit,
  CreditUnitSubject
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
  SubjectSkeleton
} from '../../components/coordinator/subjectLane';

export default function SubjectManagement() {
  const { formatMessage } = useIntl();
  const { annual_credit_unit_id } = useParams();

  const [subjects, setSubjects] = useState<DisplaySubject[]>([]);
  const [areSubjectsLoading, setAreSubjectsLoading] = useState<boolean>(false);
  const [subjectNotif, setSubjectNotif] = useState<useNotification>();

  const [subjectParts, setSubjectParts] = useState<{
    theory_id: string;
    pratical_id: string;
    guided_work_id: string;
  }>();

  const transformCreditUnitSubjectToDisplaySubject = (
    s: CreditUnitSubject
  ): DisplaySubject => {
    const theory = s.subjectParts.find(
      ({ subject_part_id: sp_id }) => sp_id === subjectParts?.theory_id
    );
    const p = s.subjectParts.find(
      ({ subject_part_id: sp_id }) => sp_id === subjectParts?.pratical_id
    );
    const gw = s.subjectParts.find(
      ({ subject_part_id: sp_id }) => sp_id === subjectParts?.guided_work_id
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
      annual_teacher_id:
        s.subjectParts.length === 0
          ? undefined
          : s.subjectParts[0].annual_teacher_id,
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
          subject_part_id: subjectParts?.theory_id as string,
        },
        {
          annual_teacher_id: s.annual_teacher_id as string,
          number_of_hours: s.practical,
          subject_part_id: subjectParts?.pratical_id as string,
        },
        {
          annual_teacher_id: s.annual_teacher_id as string,
          number_of_hours: s.guided_work,
          subject_part_id: subjectParts?.guided_work_id as string,
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
          subject_part_id: subjectParts?.theory_id as string,
        },
        {
          annual_teacher_id: s.annual_teacher_id as string,
          number_of_hours: s.practical,
          subject_part_id: subjectParts?.pratical_id as string,
        },
        {
          annual_teacher_id: s.annual_teacher_id as string,
          number_of_hours: s.guided_work,
          subject_part_id: subjectParts?.guided_work_id as string,
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
    if (annual_credit_unit_id)
      getCreditUnitSubjects(annual_credit_unit_id)
        .then(async (creditUnitSubjects) => {
          const subjectParts = await getSubjectParts();
          setSubjectParts({
            theory_id: subjectParts.find(
              (_) => _.subject_part_name === 'THEORY'
            )?.subject_part_id as string,
            pratical_id: subjectParts.find(
              (_) => _.subject_part_name === 'PRACTICAL'
            )?.subject_part_id as string,
            guided_work_id: subjectParts.find(
              (_) => _.subject_part_name === 'GUIDED_WORK'
            )?.subject_part_id as string,
          });
          setSubjects(
            creditUnitSubjects.map((subject) =>
              transformCreditUnitSubjectToDisplaySubject(subject)
            )
          );
          setAreSubjectsLoading(false);
          notif.dismiss();
          setSubjectNotif(undefined);
        })
        .catch((error) => {
          notif.notify({ render: formatMessage({ id: 'loadingSubjects' }) });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={loadSubjects}
                notification={notif}
                message={
                  error?.message || formatMessage({ id: 'getSubjectsFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        });
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
    if (annual_credit_unit_id)
      getCreditUnitDetails(annual_credit_unit_id)
        .then((creditUnit) => {
          setCreditUnit(creditUnit);
          setIsCreditUnitLoading(false);
          notif.dismiss();
          setCreditUnitNotif(undefined);
        })
        .catch((error) => {
          notif.notify({ render: formatMessage({ id: 'loadingCreditUnit' }) });
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={loadCreditUnitData}
                notification={notif}
                message={
                  error?.message ||
                  formatMessage({ id: 'getCreditUnitDataFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        });
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
      deleteCreditUnitSubject(subject.annual_credit_unit_subject_id)
        .then(() => {
          notif.update({
            render: formatMessage({ id: 'deletedSuccessfully' }),
          });
          setIsManagingSubject(false);
          setSubjects(
            subjects.filter(
              ({ annual_credit_unit_subject_id: acu }) =>
                acu !== subject.annual_credit_unit_subject_id
            )
          );
          setActionnedSubject(undefined);
          setIsConfirmDeleteDialogOpen(false);
        })
        .catch((error) => {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => deleteSubject(subject)}
                notification={notif}
                message={
                  error?.message || formatMessage({ id: 'deleteSubjectFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        });
    }
  };

  const manageSubject = (subject: DisplaySubject) => {
    setIsManagingSubject(true);
    const notif = new useNotification();
    if (manageNotif) manageNotif.dismiss();
    setManageNotif(notif);
    if (actionnedSubject) {
      notif.notify({ render: formatMessage({ id: 'editingSubject' }) });
      const submitData = transformDisplaySubjectToCreditUnitSubect(subject);
      const {
        annual_credit_unit_subject_id,
        main_teacher_fullname,
        objective,
        ...updatedSubject
      } = submitData;
      updateCreditUnitSubject(actionnedSubject.annual_credit_unit_subject_id, {
        objective: objective as string,
        ...updatedSubject,
      })
        .then(() => {
          notif.update({
            render: formatMessage({ id: 'editedSuccessfully' }),
          });
          setIsManagingSubject(false);
          setSubjects([
            ...subjects.map((_) =>
              _.annual_credit_unit_subject_id ===
              subject.annual_credit_unit_subject_id
                ? { ...subject, main_teacher_fullname }
                : _
            ),
          ]);
          setActionnedSubject(undefined);
        })
        .catch((error) => {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => manageSubject(subject)}
                notification={notif}
                message={
                  error?.message || formatMessage({ id: 'editSubjectFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        });
    } else {
      notif.notify({ render: formatMessage({ id: 'creatingSubject' }) });
      const submitData =
        transformDisplaySubjectToCreateCreditUnitSubect(subject);
      addNewCreditUnitSubject({
        ...submitData,
        annual_credit_unit_id: annual_credit_unit_id as string,
      })
        .then((newSubject) => {
          notif.update({
            render: formatMessage({ id: 'createdSuccessfully' }),
          });
          setSubjects([
            transformCreditUnitSubjectToDisplaySubject({
              ...newSubject,
              subjectParts: submitData.subjectParts,
            }),
            ...subjects,
          ]);
          setActionnedSubject(undefined);
        })
        .catch((error) => {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => manageSubject(subject)}
                notification={notif}
                message={
                  error?.message || formatMessage({ id: 'createSubjectFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        })
        .finally(() => setIsManagingSubject(false));
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
        subjects={subjects}
      />
      <ConfirmDeleteDialog
        closeDialog={() => {
          setIsConfirmDeleteDialogOpen(false);
          setActionnedSubject(undefined);
        }}
        confirm={() =>
          actionnedSubject ? deleteSubject(actionnedSubject) : null
        }
        dialogMessage={formatMessage({ id: 'confirmDeleteSubjectMessage' })}
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
