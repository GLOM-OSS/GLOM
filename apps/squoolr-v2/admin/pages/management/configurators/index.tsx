import {
  ConfirmDialog,
  NoTableElement,
  TableHeaderItem,
} from '@glom/components';
import {
  useDisableStaffMembers,
  useResetStaffPasswords,
  useStaffMembers,
} from '@glom/data-access/squoolr';
import { useTheme } from '@glom/theme';
import reset from '@iconify/icons-fluent/arrow-counterclockwise-48-regular';
import checked from '@iconify/icons-fluent/checkbox-checked-16-filled';
import unchecked from '@iconify/icons-fluent/checkbox-unchecked-16-filled';
import more from '@iconify/icons-fluent/more-vertical-48-regular';
import search from '@iconify/icons-fluent/search-48-regular';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ManageConfiguratorMenu from '../../../component/management/configurators/ManageConfiguratorMenu';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import TableSkeleton from 'libs/components/src/table/TableSkeleton';

export function Index() {
  const theme = useTheme();
  const { formatMessage, formatDate } = useIntl();

  const tableHeaders = ['', 'name', 'email', 'phone', 'lastConnected', ''];

  const [searchValue, setSearchValue] = useState<string>('');
  const {
    data: configuratorsData,
    refetch: refetchStaffMembers,
    isLoading: isLoadingConfigurators,
  } = useStaffMembers({ roles: ['CONFIGURATOR'], keywords: searchValue });

  const [canSearchExpand, setCanSearchExpand] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [selectedConfiguratorIds, setSelectedConfiguratorIds] = useState<
    string[]
  >([]);

  function selectAllConfigurators() {
    setSelectedConfiguratorIds(
      selectedConfiguratorIds.length === configuratorsData.length
        ? []
        : configuratorsData.map(
            ({ annual_configurator_id }) => annual_configurator_id
          )
    );
  }

  function selectConfigurator(annual_configurator_id: string) {
    setSelectedConfiguratorIds(
      selectedConfiguratorIds.includes(annual_configurator_id)
        ? selectedConfiguratorIds.filter(
            (configuratorId) => configuratorId !== annual_configurator_id
          )
        : [...selectedConfiguratorIds, annual_configurator_id]
    );
  }

  const [activeAnnualConfiguratorId, setActiveAnnualConfiguratorId] = useState<
    string | undefined
  >();

  const { mutate: resetStaffPasswords, isPending: isResettingPassword } =
    useResetStaffPasswords();
  function resetConfiguratorPassword(annualConfiguratorId: string | string[]) {
    resetStaffPasswords(
      {
        teacherIds: [],
        registryIds: [],
        configuratorIds:
          typeof annualConfiguratorId === 'string'
            ? [annualConfiguratorId]
            : annualConfiguratorId,
      },
      {
        onSuccess() {
          refetchStaffMembers();
          setSelectedConfiguratorIds([]);
          setActiveAnnualConfiguratorId(undefined);
        },
      }
    );
  }

  const { mutate: disableAccounts, isPending: isDisablingAccount } =
    useDisableStaffMembers();
  function disableConfiguratorAccount(annualConfiguratorId: string | string[]) {
    disableAccounts(
      {
        teacherIds: [],
        registryIds: [],
        configuratorIds:
          typeof annualConfiguratorId === 'string'
            ? [annualConfiguratorId]
            : annualConfiguratorId,
      },
      {
        onSuccess() {
          refetchStaffMembers();
          setSelectedConfiguratorIds([]);
          setActiveAnnualConfiguratorId(undefined);
        },
      }
    );
  }

  const [isConfirmResetDialogOpen, setIsConfirmResetDialogOpen] =
    useState<boolean>(false);
  const [
    isConfirmDisableAccountDialogOpen,
    setIsConfirmDisableAccountDialogOpen,
  ] = useState<boolean>(false);

  return (
    <>
      <ManageConfiguratorMenu
        anchorEl={anchorEl}
        closeMenu={() => {
          setAnchorEl(null);
          //   setActiveAnnualConfiguratorId(undefined);
        }}
        isOpen={!!anchorEl && !!activeAnnualConfiguratorId}
        onResetPassword={() => setIsConfirmResetDialogOpen(true)}
        onDisableAccount={() => setIsConfirmDisableAccountDialogOpen(true)}
      />
      <ConfirmDialog
        closeDialog={() => setIsConfirmResetDialogOpen(false)}
        dialogMessage={formatMessage({
          id:
            selectedConfiguratorIds.length > 1
              ? 'resetConfiguratorPasswordsDialogMessage'
              : 'resetConfiguratorPasswordDialogMessage',
        })}
        confirmButton={formatMessage({
          id:
            selectedConfiguratorIds.length > 1
              ? 'resetPassword'
              : 'resetPasswords',
        })}
        isDialogOpen={isConfirmResetDialogOpen}
        dialogTitle={formatMessage({
          id:
            selectedConfiguratorIds.length > 1
              ? 'resetPasswords'
              : 'resetPassword',
        })}
        confirm={() =>
          resetConfiguratorPassword(
            selectedConfiguratorIds.length > 0
              ? selectedConfiguratorIds
              : activeAnnualConfiguratorId
          )
        }
      />
      <ConfirmDialog
        closeDialog={() => setIsConfirmDisableAccountDialogOpen(false)}
        dialogMessage={formatMessage({
          id:
            selectedConfiguratorIds.length > 1
              ? 'disableConfiguratorAccountsDialogMessage'
              : 'disableConfiguratorAccountDialogMessage',
        })}
        confirmButton={formatMessage({
          id:
            selectedConfiguratorIds.length > 1
              ? 'disableAccounts'
              : 'disableAccount',
        })}
        isDialogOpen={isConfirmDisableAccountDialogOpen}
        dialogTitle={formatMessage({
          id:
            selectedConfiguratorIds.length > 1
              ? 'disableAccounts'
              : 'disableAccount',
        })}
        confirm={() =>
          disableConfiguratorAccount(
            selectedConfiguratorIds.length > 0
              ? selectedConfiguratorIds
              : activeAnnualConfiguratorId
          )
        }
      />
      <Box>
        <Box
          sx={{
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            border: `1px solid ${theme.common.line}`,
            borderBottom: 'none',
            padding: '8px',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            alignItems: 'center',
            justifyItems: 'end',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              columnGap: 2,
              alignItems: 'center',
              justifyContent: 'start',
            }}
          >
            <TextField
              onClick={() => setCanSearchExpand(true)}
              onBlur={() =>
                !searchValue
                  ? setCanSearchExpand(false)
                  : setCanSearchExpand(true)
              }
              onChange={(e) => setSearchValue(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                transition: 'width 0.3s',
                '& .MuiInputBase-root': {
                  paddingLeft: '8px',
                },
                '& .MuiInputBase-input': {
                  padding: '8.5px 0',
                  transition: 'width 0.3s',
                  width: canSearchExpand ? '100%' : 0,
                },
                '&:hover': {
                  width: '100%',
                  '& .MuiInputBase-input': {
                    width: '100%',
                  },
                },
              }}
              placeholder={formatMessage({ id: 'search' })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ width: 'auto' }}>
                    <Icon icon={search} fontSize={20} />
                  </InputAdornment>
                ),
              }}
            />

            <TableHeaderItem
              icon={reset}
              title={formatMessage({ id: 'reload' })}
              onClick={() => refetchStaffMembers()}
            />
          </Box>
          {selectedConfiguratorIds.length > 0 && (
            <Box
              sx={{
                display: 'grid',
                gridAutoFlow: 'column',
                alignItems: 'center',
                columnGap: 2,
              }}
            >
              <Button
                variant="outlined"
                color="error"
                disabled={isResettingPassword || isDisablingAccount}
                onClick={() => setIsConfirmResetDialogOpen(true)}
              >
                {formatMessage({ id: 'resetPasswords' })}
              </Button>
              <Button
                variant="outlined"
                color="warning"
                disabled={isResettingPassword || isDisablingAccount}
                onClick={() => setIsConfirmDisableAccountDialogOpen(true)}
              >
                {formatMessage({ id: 'disableAccounts' })}
              </Button>
            </Box>
          )}
        </Box>
        <TableContainer
          sx={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow
                sx={{
                  '& th': {
                    padding: '8.5px',
                  },
                }}
              >
                {tableHeaders.map((columnTitle, index) => (
                  <TableCell key={index} align="left">
                    {index === 0 ? (
                      <Checkbox
                        disabled={isResettingPassword || isDisablingAccount}
                        onClick={() =>
                          isResettingPassword ? null : selectAllConfigurators()
                        }
                        checked={
                          selectedConfiguratorIds.length ===
                          configuratorsData.length
                        }
                        icon={
                          <Icon
                            icon={unchecked}
                            style={{
                              color: '#D1D5DB',
                              height: '100%',
                              width: '21px',
                            }}
                          />
                        }
                        checkedIcon={
                          <Icon
                            icon={checked}
                            style={{
                              color: theme.palette.primary.main,
                              height: '100%',
                              width: '21px',
                            }}
                          />
                        }
                        indeterminate={
                          selectedConfiguratorIds.length > 1 &&
                          selectedConfiguratorIds.length <
                            configuratorsData.length
                        }
                      />
                    ) : index > 0 && columnTitle === '' ? (
                      ''
                    ) : (
                      formatMessage({ id: columnTitle })
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoadingConfigurators ? (
                <TableSkeleton cols={6} hasCheckbox hasMore />
              ) : configuratorsData.length === 0 ? (
                <NoTableElement />
              ) : (
                configuratorsData.map(
                  (
                    {
                      first_name,
                      last_name,
                      email,
                      phone_number,
                      last_connected,
                      annual_configurator_id,
                    },
                    index
                  ) => (
                    <TableRow
                      key={index}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        cursor: 'pointer',
                        '& td': {
                          padding: '7px',
                        },
                      }}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedConfiguratorIds.includes(
                            annual_configurator_id
                          )}
                          onClick={() =>
                            selectConfigurator(annual_configurator_id)
                          }
                          icon={
                            <Icon
                              icon={unchecked}
                              style={{
                                color: '#D1D5DB',
                                height: '100%',
                                width: '21px',
                              }}
                            />
                          }
                          checkedIcon={
                            <Icon
                              icon={checked}
                              style={{
                                color: theme.palette.primary.main,
                                height: '100%',
                                width: '21px',
                              }}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>{`${first_name} ${last_name}`}</TableCell>
                      <TableCell>
                        <Typography
                          component="a"
                          href={`mailto:${email}`}
                          target="_blank"
                          style={{
                            color: theme.palette.primary.main,
                          }}
                        >
                          {email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {phone_number.split('+')[1]?.replace(/(.{3})/g, ' $1')}
                      </TableCell>
                      <TableCell>
                        {formatDate(last_connected, {
                          weekday: 'short',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                          year: '2-digit',
                          day: '2-digit',
                        })}
                      </TableCell>
                      <TableCell align="right">
                        {selectedConfiguratorIds.length > 0 ? (
                          ''
                        ) : (
                          <Tooltip arrow title={formatMessage({ id: 'more' })}>
                            <IconButton
                              size="small"
                              disabled={
                                isResettingPassword || isDisablingAccount
                              }
                              onClick={(event) => {
                                if (isResettingPassword) return null;
                                setAnchorEl(event.currentTarget);
                                setActiveAnnualConfiguratorId(
                                  annual_configurator_id
                                );
                              }}
                            >
                              <Icon icon={more} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default Index;
