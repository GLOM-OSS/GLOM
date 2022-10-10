import { ReportRounded } from '@mui/icons-material';
import {
  Box,
  lighten,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { theme } from '@squoolr/theme';
import { ErrorMessage, useNotification } from '@squoolr/toast';
import { random } from '@squoolr/utils';
import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useIntl } from 'react-intl';
import ActionBar from '../../components/secretary/personnel/actionBar';
import ConfirmResetDialog from '../../components/secretary/personnel/confirmResetDialog';
import PersonnelRow, {
  PersonnelInterface,
} from '../../components/secretary/personnel/PersonnelRow';
import { PersonnelRowSkeleton } from '../../components/secretary/personnel/personnelRowSkeleton';
import PersonnelTabs, {
  TabItem,
} from '../../components/secretary/personnel/personnelTabs';

export default function Personnel() {
  const { formatMessage } = useIntl();
  const [activeTabItem, setActiveTabItem] = useState<TabItem>('allPersonnel');
  const [searchValue, setSearchValue] = useState<string>('');
  const [isAddNewPersonnelDialogOpen, setIsAddNewPersonnelDialogOPen] =
    useState<boolean>(false);

  const [personnels, setPersonnels] = useState<PersonnelInterface[]>([]);
  const [arePersonnelLoading, setArePersonnelLoading] =
    useState<boolean>(false);

  const [notifications, setNotifications] = useState<
    {
      usage: 'load' | 'edit' | 'password_reset' | 'code_reset';
      notif: useNotification;
    }[]
  >([]);

  const getPersonnels = () => {
    setArePersonnelLoading(true);

    const notif = new useNotification();
    const newNotifs = notifications.filter(({ usage, notif }) => {
      if (usage === 'load') notif.dismiss();
      return usage !== 'load';
    });
    setNotifications([...newNotifs, { usage: 'load', notif }]);

    //TODO: call api here to load personnel with data activeTabItem or searchValue
    setTimeout(() => {
      if (random() > 5) {
        const newPersonnels: PersonnelInterface[] = [
          {
            personnel_id: 'PersonnelInterfaceshess',
            first_name: 'Kouatchoua',
            personnel_code: 'shgels',
            last_name: 'Tchakoumi Lorrain',
            email: 'lorraintchakoumi@gmail.com',
            phone: '657140183',
            last_connected: new Date(),
            is_coordo: false,
            is_academic_service: false,
            is_teacher: false,
            is_secretariat: true,
          },
          {
            personnel_id: 'PersonnelInterfaceshses',
            first_name: 'Kouatchoua',
            personnel_code: 'shelfs',
            last_name: 'Tchakoumi Lorrain',
            email: 'lorraintchakoumi@gmail.com',
            phone: '657140183',
            last_connected: new Date(),
            is_coordo: false,
            is_academic_service: false,
            is_teacher: true,
            is_secretariat: true,
          },
          {
            personnel_id: 'PersonnelInterfacesshes',
            first_name: 'Kouatchoua',
            personnel_code: 'sdhels',
            last_name: 'Tchakoumi Lorrain',
            email: 'lorraintchakoumi@gmail.com',
            phone: '657140183',
            last_connected: new Date(),
            is_coordo: true,
            is_academic_service: true,
            is_teacher: true,
            is_secretariat: false,
          },
          {
            personnel_id: 'PersonnelInterfacesshess',
            first_name: 'Kouatchoua',
            personnel_code: 'shelhs',
            last_name: 'Tchakoumi Lorrain',
            email: 'lorraintchakoumi@gmail.com',
            phone: '657140183',
            last_connected: new Date(),
            is_coordo: true,
            is_academic_service: true,
            is_teacher: true,
            is_secretariat: true,
          },
        ];
        setPersonnels(newPersonnels);
        setArePersonnelLoading(false);
        notif.dismiss();
      } else {
        notif.notify({ render: formatMessage({ id: 'loadingPersonnel' }) });
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={getPersonnels}
              notification={notif}
              //TODO: MESSAGE SHOULD COME FROM BACKEND
              message={formatMessage({ id: 'failedToLoadPersonnel' })}
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  };

  useEffect(() => {
    getPersonnels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, activeTabItem]);

  const [activePersonnel, setActivePersonnel] = useState<PersonnelInterface>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] =
    useState<boolean>(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState<boolean>(false);
  const [isResetCodeDialogOpen, setIsResetCodeDialogOpen] =
    useState<boolean>(false);

    const[isSubmittingMenuAction, setIsSubmittingMenuAction] = useState<boolean>(false)
    // const confirmReset = () =>{
    //     const notif = new useNotification()
    // }

  return (
    <>
      {activePersonnel && (
        <ConfirmResetDialog
          close={() => {
            setIsResetCodeDialogOpen(false);
            setIsResetPasswordDialogOpen(false);
          }}
          handleConfirm={() => alert('confirmed')}
          isResetCodeDialogOpen={isResetCodeDialogOpen}
          isResetPasswordDialogOpen={isResetPasswordDialogOpen}
          personnel_code={activePersonnel.personnel_code}
        />
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: 'auto auto 1fr',
          height: '100%',
          gap: theme.spacing(3),
        }}
      >
        <PersonnelTabs setActiveTabItem={setActiveTabItem} />
        <ActionBar
          search={{ searchValue, setSearchValue }}
          handleAddClick={() =>
            isAddNewPersonnelDialogOpen
              ? null
              : setIsAddNewPersonnelDialogOPen(true)
          }
        />
        <Scrollbars>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead
              sx={{ backgroundColor: lighten(theme.palette.primary.main, 0.8) }}
            >
              <TableRow>
                {['personnelName', 'email', 'phone', 'lastConnect', 'role'].map(
                  (value, index) => (
                    <TableCell
                      key={index}
                      sx={{
                        ...theme.typography.body1,
                        color: theme.common.body,
                        fontWeight: 300,
                      }}
                    >
                      {formatMessage({ id: value })}
                    </TableCell>
                  )
                )}
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {arePersonnelLoading &&
                [...new Array(10)].map((_, index) => (
                  <PersonnelRowSkeleton index={index} key={index} />
                ))}
              {!arePersonnelLoading &&
                personnels.map((personnel, index) => (
                  <PersonnelRow
                  isSubmitting = {isSubmittingMenuAction}
                    index={index}
                    personnel={personnel}
                    key={index}
                    openEditDialog={(personnel: PersonnelInterface) => {
                      setActivePersonnel(personnel);
                      setIsEditDialogOpen(true);
                    }}
                    openProfileDialog={(personnel: PersonnelInterface) => {
                      setActivePersonnel(personnel);
                      setIsProfileDialogOpen(true);
                    }}
                    openResetPasswordDialog={(
                      personnel: PersonnelInterface
                    ) => {
                      setActivePersonnel(personnel);
                      setIsResetPasswordDialogOpen(true);
                    }}
                    openResetCodeDialog={(personnel: PersonnelInterface) => {
                      setActivePersonnel(personnel);
                      setIsResetCodeDialogOpen(true);
                    }}
                  />
                ))}
            </TableBody>
          </Table>
        </Scrollbars>
      </Box>
    </>
  );
}
