import { ReportRounded } from '@mui/icons-material';
import { Box } from '@mui/material';
import {
  getCoordinatorMajors,
  getCreditUnitMarkStatus,
  publishCreditUnit,
} from '@squoolr/api-services';
import { ConfirmDeleteDialog } from '@squoolr/confirm-dialogs';
import { CreditUnitMarkStatus, UEMajor } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import ActionBar from '../../../components/coordinator/moduleFollowUp/actionBar';
import ModuleDisplay from '../../../components/coordinator/moduleFollowUp/moduleDisplay';
import ModuleStatusSkeleton, {
  NoModuleStatus,
} from '../../../components/coordinator/moduleFollowUp/moduleStatusSkeleton';

export default function ModulePublishing() {
  const { formatMessage } = useIntl();

  const [majors, setMajors] = useState<UEMajor[]>([]);
  const [areMajorsLoading, setAreMajorsLoading] = useState<boolean>(false);
  const [majorNotif, setMajorNotif] = useState<useNotification>();
  const [activeSemester, setActiveSemester] = useState<number>();
  const [activeMajor, setActiveMajor] = useState<UEMajor>();

  const loadMajors = () => {
    setAreMajorsLoading(true);
    const notif = new useNotification();
    if (majorNotif) {
      majorNotif.dismiss();
    }
    setMajorNotif(notif);
    getCoordinatorMajors()
      .then((majors) => {
        setMajors(majors);
        setAreMajorsLoading(false);
        notif.dismiss();
        setMajorNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingMajors' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadMajors}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getMajorsFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  const [moduleStatus, setModuleStatus] = useState<CreditUnitMarkStatus[]>([]);
  const [areModuleStatusLoading, setAreModuleStatusLoading] =
    useState<boolean>(false);
  const [moduleStatusNotif, setModuleStatusNotif] = useState<useNotification>();

  const loadModuleStatus = () => {
    setAreModuleStatusLoading(true);
    const notif = new useNotification();
    if (moduleStatusNotif) {
      moduleStatusNotif.dismiss();
    }
    setModuleStatusNotif(notif);
    getCreditUnitMarkStatus({
      major_code: activeMajor?.major_code,
      semester_number: activeSemester,
    })
      .then((creditUnitSubjects) => {
        setModuleStatus(creditUnitSubjects);
        setAreModuleStatusLoading(false);
        notif.dismiss();
        setModuleStatusNotif(undefined);
      })
      .catch((error) => {
        notif.notify({
          render: formatMessage({ id: 'loadingModuleStatus' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadModuleStatus}
              notification={notif}
              message={
                error?.message || formatMessage({ id: 'getModuleStatusFailed' })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      });
  };

  useEffect(() => {
    loadMajors();
    return () => {
      //TODO: CLEANUP AXIOS FETCH ABOVE
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadModuleStatus();
    return () => {
      //TODO: CLEANUP AXIOS FETCH ABOVE
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMajor, activeSemester]);

  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [activeModule, setActiveModule] = useState<CreditUnitMarkStatus>();
  const [isConfirmPublishDialogOpen, setIsConfirmPublishDialogOpen] =
    useState<boolean>(false);

  const publishModule = (module: CreditUnitMarkStatus) => {
    if (module.availability_percentage === 100) {
      setIsPublishing(true);
      const notif = new useNotification();
      if (moduleStatusNotif) {
        moduleStatusNotif.dismiss();
      }
      setModuleStatusNotif(notif);
      notif.notify({ render: formatMessage({ id: 'validating' }) });
      publishCreditUnit(module.annual_credit_unit_id)
        .then(() => {
          setIsPublishing(false);
          setModuleStatus(
            moduleStatus.map((mdl) => {
              const { annual_credit_unit_id: acu_id } = mdl;
              if (acu_id === module.annual_credit_unit_id) {
                return {
                  ...mdl,
                  is_resit_published: module.is_exam_published,
                  is_exam_published: module.is_exam_published ?? true,
                };
              }
              return mdl;
            })
          );
          notif.dismiss();
          setModuleStatusNotif(undefined);
        })
        .catch((error) => {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => publishModule(module)}
                notification={notif}
                message={
                  error?.message || formatMessage({ id: 'validatingFailed' })
                }
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        })
        .finally(() => setIsPublishing(false));
    } else {
      toast.error(
        'availability percentage must be 100 for publications to be possible.'
      );
    }
  };

  return (
    <>
      <ConfirmDeleteDialog
        closeDialog={() => setIsConfirmPublishDialogOpen(false)}
        confirm={() =>
          activeModule
            ? publishModule(activeModule)
            : toast.error('no active module')
        }
        dialogMessage={'confirmModulePublishingMessage'}
        isDialogOpen={isConfirmPublishDialogOpen}
        dialogTitle={'confirmModulePublishing'}
        confirmButton={'publish'}
      />
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          rowGap: theme.spacing(2),
        }}
      >
        <ActionBar
          activeSemester={activeSemester}
          disabled={areMajorsLoading || areModuleStatusLoading || isPublishing}
          majors={majors}
          setActiveMajor={setActiveMajor}
          setActiveSemester={setActiveSemester}
          activeMajor={activeMajor}
        />

        <Scrollbars autoHide>
          {areModuleStatusLoading ? (
            <Box sx={{ display: 'grid', gridTemplateRows: theme.spacing(0.5) }}>
              {[...new Array(10)].map((_, index) => (
                <ModuleStatusSkeleton key={index} />
              ))}
            </Box>
          ) : moduleStatus.length === 0 ? (
            <NoModuleStatus />
          ) : (
            moduleStatus.map((module, index) => (
              <ModuleDisplay
                module={module}
                disabled={
                  isPublishing ||
                  (module.is_exam_published && module.is_resit_published)
                }
                open={
                  module.annual_credit_unit_id ===
                  activeModule?.annual_credit_unit_id
                }
                showMore={(module: CreditUnitMarkStatus | undefined) =>
                  setActiveModule(module)
                }
                publishModule={(module: CreditUnitMarkStatus) => {
                  setActiveModule(module);
                  setIsConfirmPublishDialogOpen(true);
                }}
                key={index}
              />
            ))
          )}
        </Scrollbars>
      </Box>
    </>
  );
}
