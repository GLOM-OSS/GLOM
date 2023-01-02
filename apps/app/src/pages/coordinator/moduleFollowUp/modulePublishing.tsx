import { ReportRounded } from '@mui/icons-material';
import { Box } from '@mui/material';
import { Major } from '@squoolr/api-services';
import { ConfirmDeleteDialog } from '@squoolr/dialogTransition';
import { CreditUnitMarkStatus } from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import ActionBar from 'apps/app/src/components/coordinator/moduleFollowUp/actionBar';
import ModuleDisplay from 'apps/app/src/components/coordinator/moduleFollowUp/moduleDisplay';
import ModuleStatusSkeleton, {
  NoModuleStatus,
} from 'apps/app/src/components/coordinator/moduleFollowUp/moduleStatusSkeleton';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';

export default function ModulePublishing() {
  const { formatMessage } = useIntl();

  const [majors, setMajors] = useState<Major[]>([]);
  const [areMajorsLoading, setAreMajorsLoading] = useState<boolean>(false);
  const [majorNotif, setMajorNotif] = useState<useNotification>();
  const [activeSemester, setActiveSemester] = useState<number>();
  const [activeMajor, setActiveMajor] = useState<Major>();

  const loadMajors = () => {
    setAreMajorsLoading(true);
    const notif = new useNotification();
    if (majorNotif) {
      majorNotif.dismiss();
    }
    setMajorNotif(notif);
    setTimeout(() => {
      //TODO: call api here to load majors
      if (6 > 5) {
        const newMajors: Major[] = [];
        setMajors(newMajors);
        setAreMajorsLoading(false);
        notif.dismiss();
        setMajorNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingMajors' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadMajors}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'getMajorsFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
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
    setTimeout(() => {
      //TODO: call api here to load moduleStatus with data activeMajor and activeSemester
      if (6 > 5) {
        const newModuleStatus: CreditUnitMarkStatus[] = [
          {
            annual_credit_unit_id: 'sueios',
            availability_percentage: 79,
            credit_points: 7,
            credit_unit_code: 'uc0116',
            credit_unit_name: 'Informatique I',
            is_published: true,
            subjectMarkStatus: [
              {
                annual_credit_unit_subject_id: 'eisoe',
                is_ca_available: true,
                is_exam_available: true,
                is_resit_available: false,
                subject_code: 'SSII001',
                subject_title: "Securite des systems d'information",
              },
            ],
          },
        ];
        setModuleStatus(newModuleStatus);
        setAreModuleStatusLoading(false);
        notif.dismiss();
        setModuleStatusNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingModuleStatus' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadModuleStatus}
              notification={notif}
              //TODO: message should come from backend
              message={formatMessage({ id: 'getModuleStatusFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
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
      setTimeout(() => {
        //TODO: call api here to validateAnonimation
        if (6 > 5) {
          setIsPublishing(false);
          setModuleStatus(
            moduleStatus.map((mdl) => {
              const { annual_credit_unit_id: acu_id } = mdl;
              if (acu_id === module.annual_credit_unit_id) {
                return { ...mdl, is_published: true };
              }
              return mdl;
            })
          );
          notif.dismiss();
          setModuleStatusNotif(undefined);
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => publishModule}
                notification={notif}
                //TODO: message should come from backend
                message={formatMessage({ id: 'validatingFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    } else {
      alert(
        'availability percentage must be 100 for publications to be possible.'
      );
      //TODO: CHANGE THIS TO TOAST MESSAGE
    }
  };

  return (
    <>
      <ConfirmDeleteDialog
        closeDialog={() => setIsConfirmPublishDialogOpen(false)}
        confirm={() =>
          activeModule ? publishModule(activeModule) : alert('no active module')
        }
        // TODO: CHANGE ALERT ABOVE TO TOAST
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
                disabled={isPublishing}
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
