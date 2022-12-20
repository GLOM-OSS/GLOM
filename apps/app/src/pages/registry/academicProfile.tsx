import { AddRounded, ReportRounded } from '@mui/icons-material';
import {
    Box,
    Fab,
    lighten,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip
} from '@mui/material';
import { ConfirmDeleteDialog } from '@squoolr/dialogTransition';
import {
    AcademicProfile,
    CreateAcademicProfile,
    CreateWeightingSystem
} from '@squoolr/interfaces';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import { RowMenu } from '../../components/coordinator/CreditUnitLane';
import ActionBar from '../../components/registry/academicProfile/actionBar';
import ProfileDialog from '../../components/registry/academicProfile/profileDialog';
import ProfileLane, {
    ProfileSkeleton
} from '../../components/registry/academicProfile/profileLane';
import SelectWeightingSystem from '../../components/registry/selectWeightingSystem';

export default function AcademicProfileTable() {
  const { formatMessage } = useIntl();

//   const [cycles, setCycles] = useState<Cycle[]>([]);
//   const [areCyclesLoading, setAreCyclesLoading] = useState<boolean>(false);
//   const [cycleNotif, setCycleNotif] = useState<useNotification>();
//   const [activeCycle, setActiveCycle] = useState<Cycle>();

  //   const loadCycles = () => {
  //     setAreCyclesLoading(true);
  //     const notif = new useNotification();
  //     if (cycleNotif) {
  //       cycleNotif.dismiss();
  //     }
  //     setCycleNotif(notif);
  //     setTimeout(() => {
  //       //TODO: call api here to load school's offered cycle here
  //       if (6 > 5) {
  //         const newCycles: Cycle[] = [
  //           {
  //             cycle_id: 'weils',
  //             cycle_name: CycleName.BACHELOR,
  //             cycle_type: CycleType.LONG,
  //             number_of_years: 3,
  //           },
  //           {
  //             cycle_id: 'weisls',
  //             cycle_name: CycleName.MASTER,
  //             cycle_type: CycleType.SHORT,
  //             number_of_years: 2,
  //           },
  //         ];

  //         setCycles(newCycles);
  //         if (newCycles.length > 0)
  //           setActiveCycle(
  //             newCycles.sort((a, b) =>
  //               a.cycle_type < b.cycle_type
  //                 ? 1
  //                 : a.cycle_name > b.cycle_name
  //                 ? 1
  //                 : -1
  //             )[0]
  //           );
  //         setAreCyclesLoading(false);
  //         notif.dismiss();
  //         setCycleNotif(undefined);
  //       } else {
  //         notif.notify({ render: formatMessage({ id: 'loadingCycles' }) });
  //         notif.update({
  //           type: 'ERROR',
  //           render: (
  //             <ErrorMessage
  //               retryFunction={loadCycles}
  //               notification={notif}
  //               message={formatMessage({ id: 'getCyclesFailed' })}
  //             />
  //           ),
  //           autoClose: false,
  //           icon: () => <ReportRounded fontSize="medium" color="error" />,
  //         });
  //       }
  //     }, 3000);
  //   };

  const [weightingSystem, setWeightingSystem] = useState<number>();
  const [isWeightingSystemLoading, setIsWeightingSystemLoading] =
    useState<boolean>(false);
  const [weightingSystemNotif, setWeightingSystemNotif] =
    useState<useNotification>();

  const loadWeightingSystem = () => {
    setIsWeightingSystemLoading(true);
    const notif = new useNotification();
    if (weightingSystemNotif) {
      weightingSystemNotif.dismiss();
    }
    setWeightingSystemNotif(notif);
    setTimeout(() => {
      //TODO: call api here to load activeCycle's weighting system
      if (6 > 5) {
        const newWeightingSystem = undefined;
        setWeightingSystem(newWeightingSystem);
        setIsWeightingSystemLoading(false);
        notif.dismiss();
        setWeightingSystemNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingWeightingSystem' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadWeightingSystem}
              notification={notif}
              message={formatMessage({ id: 'getWeightingSystem' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [academicProfileData, setAcademicProfileData] = useState<
    AcademicProfile[]
  >([]);
  const [areAcademicProfileDataLoading, setAreAcademicProfileDataLoading] =
    useState<boolean>(false);
  const [academicProfileNotif, setAcademicProfileNotif] =
    useState<useNotification>();

  const loadAcademicProfileData = () => {
    setAreAcademicProfileDataLoading(true);
    const notif = new useNotification();
    if (academicProfileNotif) {
      academicProfileNotif.dismiss();
    }
    setAcademicProfileNotif(notif);
    setTimeout(() => {
      //TODO: call api here to load weightingData
      if (6 > 5) {
        const newAcademicProfileData: AcademicProfile[] = [
          {
            academic_profile_id: 'lsei',
            comment: 'Avertissement',
            maximum_score: 0,
            minimum_score: 0,
          },
        ];
        setAcademicProfileData(newAcademicProfileData);
        setAreAcademicProfileDataLoading(false);
        notif.dismiss();
        setAcademicProfileNotif(undefined);
      } else {
        notif.notify({
          render: formatMessage({ id: 'loadingAcademicProfileData' }),
        });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={loadAcademicProfileData}
              notification={notif}
              message={formatMessage({ id: 'getAcademicProfileDataFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  useEffect(() => {
    loadWeightingSystem();
    return () => {
      //TODO: cleanup axios fetch above
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (weightingSystem) {
      loadAcademicProfileData();
    }
    return () => {
      //TODO: cleanup axios fetch above
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weightingSystem]);

  const [isCreatingWeightingSystem, setIsCreatingWeightingSystem] =
    useState<boolean>(false);

  const createWeightingSystem = (newWeightingSystem: CreateWeightingSystem) => {
    setIsCreatingWeightingSystem(true);
    const notif = new useNotification();
    if (weightingSystemNotif) weightingSystemNotif.dismiss();
    setWeightingSystemNotif(notif);
    notif.notify({ render: formatMessage({ id: 'savingWeightingSystem' }) });
    setTimeout(() => {
      //TODO: CALL API HERE TO createWeighting system with data newWeightingSystem
      if (5 > 4) {
        notif.update({
          render: formatMessage({ id: 'savedSuccessfully' }),
        });
        setIsCreatingWeightingSystem(false);
        setWeightingSystem(newWeightingSystem.weighting_system);
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => createWeightingSystem(newWeightingSystem)}
              notification={notif}
              message={formatMessage({ id: 'saveWeightingSystemFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [isEditingAcademicProfile, setIsEditingAcademicProfile] =
    useState<boolean>(false);
  const [profileNotif, setProfileNotif] = useState<useNotification>();
  const editAcademicProfile = (profile: AcademicProfile) => {
    setIsEditingAcademicProfile(true);
    const notif = new useNotification();
    if (profileNotif) profileNotif.dismiss();
    setProfileNotif(notif);
    notif.notify({ render: formatMessage({ id: 'savingProfile' }) });
    if (actionnedProfile) {
      setTimeout(() => {
        //TODO: CALL API HERE TO edit academicProfile with data profile
        if (5 > 4) {
          notif.update({
            render: formatMessage({ id: 'savedSuccessfully' }),
          });
          setIsEditingAcademicProfile(false);
          setAcademicProfileData(
            academicProfileData.map((academicProfile) => {
              const { academic_profile_id: ap_id } = academicProfile;
              if (ap_id === actionnedProfile.academic_profile_id)
                return profile;
              return academicProfile;
            })
          );
          setActionnedProfile(undefined);
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => editAcademicProfile(profile)}
                notification={notif}
                message={formatMessage({ id: 'saveAcademicProfileFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    } else {
      setTimeout(() => {
        const newProfile: CreateAcademicProfile = {
          comment: profile.comment,
          maximum_score: profile.maximum_score,
          minimum_score: profile.minimum_score,
        };
        //TODO: CALL API HERE TO createProfile with data newProfile
        if (5 > 4) {
          notif.update({
            render: formatMessage({ id: 'savedSuccessfully' }),
          });
          setIsEditingAcademicProfile(false);
          //TODO: Put repsonse data after creation here
          const responseProfile: AcademicProfile = {
            ...newProfile,
            academic_profile_id: 'lskei',
          };
          setAcademicProfileData([responseProfile, ...academicProfileData]);
          setActionnedProfile(undefined);
        } else {
          notif.update({
            type: 'ERROR',
            render: (
              <ErrorMessage
                retryFunction={() => editAcademicProfile(profile)}
                notification={notif}
                message={formatMessage({ id: 'saveAcademicProfileFailed' })}
              />
            ),
            autoClose: false,
            icon: () => <ReportRounded fontSize="medium" color="error" />,
          });
        }
      }, 3000);
    }
  };

  const [isDeletingProfile, setIsDeletingProfile] = useState<boolean>(false);
  const deleteProfile = (profile: AcademicProfile) => {
    setIsDeletingProfile(true);
    const notif = new useNotification();
    if (profileNotif) profileNotif.dismiss();
    setProfileNotif(notif);
    notif.notify({ render: formatMessage({ id: 'deleingProfile' }) });
    setTimeout(() => {
      //TODO: CALL API HERE TO deleting profile with data profile
      if (5 > 4) {
        notif.update({
          render: formatMessage({ id: 'deletedSuccessfully' }),
        });
        setIsDeletingProfile(false);
        setAcademicProfileData(
          academicProfileData.filter(
            ({ academic_profile_id: ap_id }) =>
              ap_id !== profile.academic_profile_id
          )
        );
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => deleteProfile(profile)}
              notification={notif}
              message={formatMessage({ id: 'deleteAcademicProfileFailed' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [actionnedProfile, setActionnedProfile] = useState<AcademicProfile>();

  if (!isWeightingSystemLoading && !weightingSystem)
    return (
      <SelectWeightingSystem
        handleSubmit={createWeightingSystem}
        isDataLoading={isCreatingWeightingSystem}
      />
    );

  return (
    <>
      <RowMenu
        anchorEl={anchorEl}
        closeMenu={() => setAnchorEl(null)}
        deleteItem={() => setIsConfirmDeleteDialogOpen(true)}
        editItem={() => setIsEditDialogOpen(true)}
      />
      <ProfileDialog
        closeDialog={() => setIsEditDialogOpen(false)}
        handleSubmit={editAcademicProfile}
        isDialogOpen={isEditDialogOpen}
        weightingSystem={weightingSystem ?? 0}
        editableProfile={actionnedProfile}
      />
      <ConfirmDeleteDialog
        closeDialog={() => setIsConfirmDeleteDialogOpen(false)}
        confirm={() =>
          actionnedProfile
            ? deleteProfile(actionnedProfile)
            : alert(formatMessage({ id: 'noActionnedAcademicProfilePresent' }))
        }
        deleteMessage={formatMessage({ id: 'confirmDeleteAcademicProfile' })}
        isDialogOpen={isConfirmDeleteDialogOpen}
      />
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          rowGap: theme.spacing(1),
        }}
      >
        <ActionBar
          weightingSystem={weightingSystem}
          isDataLoading={
            areAcademicProfileDataLoading ||
            isCreatingWeightingSystem ||
            isEditingAcademicProfile ||
            isDeletingProfile ||
            isWeightingSystemLoading
          }
          editWeightingSystem={createWeightingSystem}
        />
        <Box sx={{ position: 'relative', height: '100%' }}>
          <Fab
            disabled={
              areAcademicProfileDataLoading ||
              isCreatingWeightingSystem ||
              isWeightingSystemLoading ||
              isEditDialogOpen ||
              isEditingAcademicProfile ||
              isDeletingProfile
            }
            onClick={() => setIsEditDialogOpen(true)}
            color="primary"
            sx={{ position: 'absolute', bottom: 16, right: 24 }}
          >
            <Tooltip arrow title={formatMessage({ id: `newSubject` })}>
              <AddRounded />
            </Tooltip>
          </Fab>

          <Scrollbars autoHide>
            <Table sx={{ minWidth: 650 }}>
              <TableHead
                sx={{
                  backgroundColor: lighten(theme.palette.primary.light, 0.6),
                }}
              >
                <TableRow>
                  {['number', 'minimum', 'maximum', 'mention'].map(
                    (val, index) => (
                      <TableCell key={index}>
                        {formatMessage({ id: val })}
                      </TableCell>
                    )
                  )}
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {areAcademicProfileDataLoading ||
                isWeightingSystemLoading ? (
                  [...new Array(10)].map((_, index) => (
                    <ProfileSkeleton key={index} />
                  ))
                ) : academicProfileData.length === 0 ? (
                  <TableRow
                    sx={{
                      borderBottom: `1px solid ${theme.common.line}`,
                      borderTop: `1px solid ${theme.common.line}`,
                      padding: `0 ${theme.spacing(4.625)}`,
                    }}
                  >
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ textAlign: 'center' }}
                    >
                      {formatMessage({ id: 'noProfileYet' })}
                    </TableCell>
                  </TableRow>
                ) : (
                  academicProfileData.map((profile, index) => (
                    <ProfileLane
                      setAnchorEl={setAnchorEl}
                      profile={profile}
                      getActionnedProfile={setActionnedProfile}
                      key={index}
                      position={index + 1}
                      isSubmitting={isCreatingWeightingSystem}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </Scrollbars>
        </Box>
      </Box>
    </>
  );
}
