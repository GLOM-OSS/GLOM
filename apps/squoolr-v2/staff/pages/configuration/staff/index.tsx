import {
  ConfirmDialog,
  NoTableElement,
  TableHeaderItem,
  TableSkeleton,
} from '@glom/components';
import { MajorEntity, SatffEntity, StaffRole } from '@glom/data-types/squoolr';
import { useDispatchBreadcrumb } from '@glom/squoolr-v2/side-nav';
import { useTheme } from '@glom/theme';
import add from '@iconify/icons-fluent/add-48-regular';
import reset from '@iconify/icons-fluent/arrow-counterclockwise-48-regular';
import checked from '@iconify/icons-fluent/checkbox-checked-16-filled';
import unchecked from '@iconify/icons-fluent/checkbox-unchecked-16-filled';
import filter from '@iconify/icons-fluent/filter-28-regular';
import more from '@iconify/icons-fluent/more-vertical-48-regular';
import search from '@iconify/icons-fluent/search-48-regular';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Checkbox,
  Chip,
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
  lighten,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import FilterMenu from '../../../components/configuration/departments/FilterMenu';
import AddMajorDialog from '../../../components/configuration/majors/AddMajorDialog';
import EditMajorDialog from '../../../components/configuration/majors/EditMajorDialog';
import ManageMajorMenu from '../../../components/configuration/majors/ManageMajorMenu';
export default function Staff() {
  const theme = useTheme();
  const { push, asPath } = useRouter();
  const breadcrumbDispatch = useDispatchBreadcrumb();
  const { formatMessage, formatDate, formatNumber } = useIntl();

  const tableHeaders = [
    '',
    'staffName',
    'telephone',
    'email',
    'roles',
    'lastConnected',
    '',
  ];

  //TODO: REPLACE WITH with reactQuery own
  const [isStaffDataFetching, setIsStaffDataFetching] = useState<boolean>(true);

  //TODO: FETCH LIST OF majors HERE
  const [staffData, setStaffData] = useState<SatffEntity[]>();

  //TODO: REMOVE THIS WHEN INTEGRATION IS DONE
  useEffect(() => {
    setTimeout(() => {
      setStaffData([
        {
          first_name: 'Tchakoumi Lorrain',
          last_name: 'Kouatchoua',
          email: 'lorraintchakoumi@gmail.com',
          phone_number: '+237657140183',
          birthdate: '',
          gender: 'Male',
          role: 'TEACHER',
          roles: ['TEACHER', 'REGISTRY', 'COORDINATOR', 'CONFIGURATOR'],
          is_deleted: false,
          last_connected: new Date().toISOString(),
          login_id: 'lsi',
          matricule: 'massa',
        },
      ]);
      setIsStaffDataFetching(false);
    }, 3000);
  }, []);

  const [canSearchExpand, setCanSearchExpand] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [showArchives, setShowArchives] = useState<boolean>(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    //TODO: CALL fetch list of major API HERE with searchValue and showArchives use it to filter. MUTATE majors DATA WHEN IT'S DONE
    alert('hello world');
  }, [searchValue, showArchives]);

  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

  function selectAllStaff() {
    alert('select all staff');
  }

  function selectStaff(annual_major_id: string) {
    alert('boston lor');
  }

  const [activeStaffId, setActiveStaffId] = useState<string>();
  const [isActiveStaffArchived, setIsActiveStaffArchived] =
    useState<boolean>(false);

  const [isConfirmArchiveDialogOpen, setIsConfirmArchiveDialogOpen] =
    useState<boolean>(false);
  const [isConfirmUnarchiveDialogOpen, setIsConfirmUnarchiveDialogOpen] =
    useState<boolean>(false);

  //TODO: REMOVE THIS AND USE reactQuery own
  const [isEditingStaff, setIsEditingStaff] = useState<boolean>(false);

  //TODO: REMOVE THIS AND USE reactQuery own
  const [isArchiving, setIsArchiving] = useState<boolean>(false);
  //TODO: REMOVE THIS AND USE reactQuery own
  const [isUnarchiving, setIsUnarchiving] = useState<boolean>(false);
  function confirmArchiveUnarchive() {
    if (isConfirmArchiveDialogOpen) {
      setIsArchiving(true);
      //TODO: CALL API HERE TO ARCHIVE major with data selectedMajorIds if length>1 or otherwise [activeMajorId]
      setTimeout(() => {
        alert('done archiving');
        //TODO: MUTATE MajorData here so the data updates
        setIsArchiving(false);
        setIsConfirmArchiveDialogOpen(false);
        setActiveStaffId(undefined);
      }, 3000);
    }
    if (isConfirmUnarchiveDialogOpen) {
      setIsUnarchiving(true);
      //TODO: CALL API HERE TO ARCHIVE MAJOR with data selectedMajorIds if length>1 or otherwise [activeMajorId]
      setTimeout(() => {
        alert('done unarchiving');
        //TODO: MUTATE majorData here so the data updates
        setIsUnarchiving(false);
        setIsConfirmUnarchiveDialogOpen(false);
        setActiveStaffId(undefined);
      }, 3000);
    }
  }

  const [isNewMajorDialogOpen, setIsNewMajorDialogOpen] =
    useState<boolean>(false);
  const [isEditMajorDialogOpen, setIsEditMajorDialogOpen] =
    useState<boolean>(false);

  const [editableMajor, setEditableMajor] = useState<MajorEntity>();

  const ROLE_COLOR: Record<
    StaffRole,
    'warning' | 'success' | 'secondary' | 'primary'
  > = {
    CONFIGURATOR: 'warning',
    COORDINATOR: 'success',
    REGISTRY: 'secondary',
    TEACHER: 'primary',
  };

  return (
    <>
      {/* <AddMajorDialog
        isDialogOpen={isNewMajorDialogOpen}
        closeDialog={() => setIsNewMajorDialogOpen(false)}
      /> */}
      {/* {editableMajor && (
        <EditMajorDialog
          isDialogOpen={isEditMajorDialogOpen}
          closeDialog={() => setIsEditMajorDialogOpen(false)}
          editableMajor={editableMajor}
        />
      )} */}
      <FilterMenu
        closeMenu={() => {
          setFilterAnchorEl(null);
        }}
        isOpen={!!filterAnchorEl}
        onShowArchives={() => setShowArchives((prev) => !prev)}
        anchorEl={filterAnchorEl}
        showArchives={showArchives}
      />

      {/* <ManageMajorMenu
        anchorEl={anchorEl}
        closeMenu={() => setAnchorEl(null)}
        isOpen={!!anchorEl}
        isArchived={isActiveStaffArchived}
        confirmArchive={() => setIsConfirmArchiveDialogOpen(true)}
        confirmUnarchive={() => setIsConfirmUnarchiveDialogOpen(true)}
        editMajor={() => {
          setActiveStaffId(undefined);
          setIsEditMajorDialogOpen(true);
        }}
        openClassrooms={() => {
          breadcrumbDispatch({
            action: 'ADD',
            payload: [
              {
                title: editableMajor.major_acronym,
                route: editableMajor.annual_major_id,
              },
            ],
          });
          push(`${asPath}/${editableMajor.annual_major_id}`);
        }}
      /> */}
      {/* <ConfirmDialog
        closeDialog={() => {
          setIsConfirmArchiveDialogOpen(false);
          setIsConfirmUnarchiveDialogOpen(false);
        }}
        dialogMessage={formatMessage({
          id: isConfirmArchiveDialogOpen
            ? selectedStaffIds.length > 1
              ? 'confirmArchiveMajorsDialogMessage'
              : 'confirmArchiveMajorDialogMessage'
            : selectedStaffIds.length > 1
            ? 'confirmUnarchiveMajorsDialogMessage'
            : 'confirmUnarchiveMajorDialogMessage',
        })}
        isDialogOpen={
          isConfirmArchiveDialogOpen || isConfirmUnarchiveDialogOpen
        }
        confirm={confirmArchiveUnarchive}
        dialogTitle={formatMessage({
          id: isConfirmArchiveDialogOpen
            ? selectedStaffIds.length > 1
              ? 'archiveMajors'
              : 'archiveMajor'
            : selectedStaffIds.length > 1
            ? 'unarchiveMajors'
            : 'unarchiveMajor',
        })}
        confirmButton={formatMessage({
          id: isConfirmArchiveDialogOpen ? 'archive' : 'unarchive',
        })}
        danger
        closeOnConfirm
        isSubmitting={isArchiving || isUnarchiving}
      /> */}
      <Box sx={{ height: '100%', position: 'relative' }}>
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
              onClick={() => {
                //TODO: MUTATE TABLE VALUES HERE AND SEARCH AGAIN.
                alert('hello world');
              }}
            />
          </Box>
          {
            <Box
              sx={{
                display: 'grid',
                gridAutoFlow: 'column',
                alignItems: 'center',
                columnGap: 2,
              }}
            >
              {selectedStaffIds.length > 0 && showArchives && (
                <Button
                  variant="outlined"
                  color="warning"
                  disabled={isArchiving || isUnarchiving || isEditingStaff}
                  onClick={() => setIsConfirmUnarchiveDialogOpen(true)}
                >
                  {formatMessage({ id: 'unarchiveSelectedMajors' })}
                </Button>
              )}
              {selectedStaffIds.length > 0 && !showArchives && (
                <Button
                  variant="outlined"
                  color="warning"
                  disabled={isArchiving || isUnarchiving || isEditingStaff}
                  onClick={() => setIsConfirmArchiveDialogOpen(true)}
                >
                  {formatMessage({ id: 'archiveSelectedMajors' })}
                </Button>
              )}
              <TableHeaderItem
                icon={filter}
                title={formatMessage({ id: 'filter' })}
                onClick={(event) => {
                  setFilterAnchorEl(event.currentTarget);
                }}
              />
            </Box>
          }
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
                        disabled={
                          !staffData ||
                          isStaffDataFetching ||
                          isArchiving ||
                          isUnarchiving ||
                          isEditingStaff
                        }
                        onClick={() =>
                          isArchiving || isUnarchiving || isEditingStaff
                            ? null
                            : selectAllStaff()
                        }
                        checked={
                          !!staffData &&
                          selectedStaffIds.length === staffData.length
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
                          selectedStaffIds.length > 1 &&
                          selectedStaffIds.length < staffData.length
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
              {!staffData || isStaffDataFetching ? (
                <TableSkeleton cols={7} hasCheckbox hasMore />
              ) : staffData.length === 0 ? (
                <NoTableElement />
              ) : (
                staffData.map((major, index) => {
                  const {
                    first_name,
                    last_name,
                    phone_number,
                    email,
                    roles,
                    last_connected,
                    login_id,
                    is_deleted,
                  } = major;
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '& td': {
                          padding: '7px',
                        },
                      }}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedStaffIds.includes(login_id)}
                          onClick={() => selectStaff(login_id)}
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
                      <TableCell
                        sx={{
                          color: is_deleted
                            ? theme.common.line
                            : theme.common.body,
                        }}
                      >
                        {`${first_name} ${last_name}`}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: is_deleted
                            ? theme.common.line
                            : theme.common.body,
                        }}
                      >
                        {phone_number.split('+')[1]?.replace(/(.{3})/g, ' $1')}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: is_deleted
                            ? theme.common.line
                            : theme.palette.primary.main,
                        }}
                      >
                        {email}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: is_deleted
                            ? theme.common.line
                            : theme.common.body,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'grid',
                            gridAutoFlow: 'column',
                            columnGap: 0.5,
                          }}
                        >
                          {roles
                            .sort((a, b) => (a > b ? 1 : -1))
                            .map((role, index) => (
                              <Chip
                                key={index}
                                color={ROLE_COLOR[role]}
                                size="small"
                                variant="outlined"
                                label={formatMessage({
                                  id: role.toLowerCase(),
                                })}
                                sx={{
                                  color: theme.common.titleActive,
                                  fontWeight: '600',
                                  backgroundColor: lighten(
                                    theme.palette[ROLE_COLOR[role]].main,
                                    0.9
                                  ),
                                }}
                              />
                            ))}
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: is_deleted
                            ? theme.common.line
                            : theme.common.body,
                        }}
                      >
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
                        {selectedStaffIds.length > 0 ? (
                          ''
                        ) : (
                          <Tooltip arrow title={formatMessage({ id: 'more' })}>
                            <IconButton
                              size="small"
                              disabled={
                                isArchiving || isUnarchiving || isEditingStaff
                              }
                              onClick={(event) => {
                                if (
                                  isArchiving ||
                                  isUnarchiving ||
                                  isEditingStaff
                                )
                                  return null;
                                setAnchorEl(event.currentTarget);
                                // setActiveStaffId(annual_major_id);
                                setIsActiveStaffArchived(is_deleted);
                                // setEditableMajor(major);
                              }}
                            >
                              <Icon icon={more} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {!!staffData && !isStaffDataFetching && (
          <Tooltip
            arrow
            title={formatMessage({ id: 'addNewMajor' })}
            placement="left"
          >
            <IconButton
              onClick={() => setIsNewMajorDialogOpen(true)}
              color="primary"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: theme.palette.primary.light,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              <Icon icon={add} color="white" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </>
  );
}
