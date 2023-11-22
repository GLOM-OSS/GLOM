import {
  ConfirmDialog,
  NoTableElement,
  TableHeaderItem,
} from '@glom/components';
import { DepartmentEntity } from '@glom/data-types/squoolr';
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
} from '@mui/material';
import FilterMenu from 'apps/squoolr-v2/staff/components/configuration/departments/FilterMenu';
import ManageDepartmentMenu from 'apps/squoolr-v2/staff/components/configuration/departments/ManageDepartmentMenu';
import NewDepartmentDialog from 'apps/squoolr-v2/staff/components/configuration/departments/NewDepartmentDialog';
import TableSkeleton from 'libs/components/src/table/TableSkeleton';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

export function Index() {
  const theme = useTheme();
  const { formatMessage, formatDate } = useIntl();

  const tableHeaders = [
    '',
    'departmentName',
    'departmentAcronym',
    'createdAt',
    '',
  ];

  //TODO: REPLACE WITH with reactQuery own
  const [isDepartmentDataFetching, setIsDepartmentDataFetching] =
    useState<boolean>(true);

  //TODO: FETCH LIST OF departments HERE
  const [departmentData, setDepartmentData] = useState<DepartmentEntity[]>();

  //TODO: REMOVE THIS WHEN INTEGRATION IS DONE
  useEffect(() => {
    setTimeout(() => {
      setDepartmentData([
        {
          created_at: new Date().toISOString(),
          created_by: '',
          department_acronym: 'DS',
          department_code: 'EF1203',
          department_id: 'EF1203',
          department_name: 'Department des Sciences',
          is_deleted: false,
          school_id: 'slei',
        },
      ]);
      setIsDepartmentDataFetching(false);
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
    //TODO: CALL fetch list of departments API HERE with searchValue and showArchives use it to filter. MUTATE DEMAND DATA WHEN IT'S DONE
    alert('hello world');
  }, [searchValue, showArchives]);

  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<string[]>(
    []
  );

  function selectAllDepartments() {
    setSelectedDepartmentIds(
      selectedDepartmentIds.length === departmentData.length
        ? []
        : departmentData.map(({ department_id }) => department_id)
    );
  }

  function selectDepartment(department_id: string) {
    setSelectedDepartmentIds(
      selectedDepartmentIds.includes(department_id)
        ? selectedDepartmentIds.filter(
            (selectedDepartmentId) => selectedDepartmentId !== department_id
          )
        : [...selectedDepartmentIds, department_id]
    );
  }

  const [activeDepartmentId, setActiveDepartmentId] = useState<string>();
  const [isActiveDepartmentArchived, setIsActiveDepartmentArchived] =
    useState<boolean>(false);

  const [isConfirmArchiveDialogOpen, setIsConfirmArchiveDialogOpen] =
    useState<boolean>(false);
  const [isConfirmUnarchiveDialogOpen, setIsConfirmUnarchiveDialogOpen] =
    useState<boolean>(false);

  //TODO: REMOVE THIS AND USE reactQuery own
  const [isEditingDeparment, setIsEditingDepartment] = useState<boolean>(false);

  //TODO: REMOVE THIS AND USE reactQuery own
  const [isArchiving, setIsArchiving] = useState<boolean>(false);
  //TODO: REMOVE THIS AND USE reactQuery own
  const [isUnarchiving, setIsUnarchiving] = useState<boolean>(false);
  function confirmArchiveUnarchive() {
    if (isConfirmArchiveDialogOpen) {
      setIsArchiving(true);
      //TODO: CALL API HERE TO ARCHIVE DEPARTMENT with data selectedDepartmentIds if length>1 or otherwise [activeDepartmentId]
      setTimeout(() => {
        alert('done archiving');
        //TODO: MUTATE departmentData here so the data updates
        setIsArchiving(false);
        setIsConfirmArchiveDialogOpen(false);
        setActiveDepartmentId(undefined);
      }, 3000);
    }
    if (isConfirmUnarchiveDialogOpen) {
      setIsUnarchiving(true);
      //TODO: CALL API HERE TO ARCHIVE DEPARTMENT with data selectedDepartmentIds if length>1 or otherwise [activeDepartmentId]
      setTimeout(() => {
        alert('done unarchiving');
        //TODO: MUTATE departmentData here so the data updates
        setIsUnarchiving(false);
        setIsConfirmUnarchiveDialogOpen(false);
        setActiveDepartmentId(undefined);
      }, 3000);
    }
  }

  const [isNewDepartmentDialogOpen, setIsNewDepartmentDialogOpen] =
    useState<boolean>(false);

  return (
    <>
      <NewDepartmentDialog
        isDialogOpen={isNewDepartmentDialogOpen}
        closeDialog={() => setIsNewDepartmentDialogOpen(false)}
      />
      <FilterMenu
        closeMenu={() => {
          setFilterAnchorEl(null);
        }}
        isOpen={!!filterAnchorEl}
        onShowArchives={() => setShowArchives((prev) => !prev)}
        anchorEl={filterAnchorEl}
        showArchives={showArchives}
      />

      <ManageDepartmentMenu
        anchorEl={anchorEl}
        closeMenu={() => setAnchorEl(null)}
        isOpen={!!anchorEl}
        isArchived={isActiveDepartmentArchived}
        confirmArchive={() => setIsConfirmArchiveDialogOpen(true)}
        confirmUnarchive={() => setIsConfirmUnarchiveDialogOpen(true)}
      />
      <ConfirmDialog
        closeDialog={() => {
          setIsConfirmArchiveDialogOpen(false);
          setIsConfirmUnarchiveDialogOpen(false);
        }}
        dialogMessage={formatMessage({
          id: isConfirmArchiveDialogOpen
            ? selectedDepartmentIds.length > 1
              ? 'confirmArchiveDepartmentsDialogMessage'
              : 'confirmArchiveDepartmentDialogMessage'
            : selectedDepartmentIds.length > 1
            ? 'confirmUnarchiveDepartmentsDialogMessage'
            : 'confirmUnarchiveDepartmentDialogMessage',
        })}
        isDialogOpen={
          isConfirmArchiveDialogOpen || isConfirmUnarchiveDialogOpen
        }
        confirm={confirmArchiveUnarchive}
        dialogTitle={formatMessage({
          id: isConfirmArchiveDialogOpen
            ? selectedDepartmentIds.length > 1
              ? 'archiveDepartments'
              : 'archiveDepartment'
            : selectedDepartmentIds.length > 1
            ? 'unarchiveDepartments'
            : 'unarchiveDepartment',
        })}
        confirmButton={formatMessage({
          id: isConfirmArchiveDialogOpen ? 'archive' : 'unarchive',
        })}
        danger
        closeOnConfirm
        isSubmitting={isArchiving || isUnarchiving}
      />
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
              {selectedDepartmentIds.length > 0 && showArchives && (
                <Button
                  variant="outlined"
                  color="warning"
                  disabled={isArchiving || isUnarchiving || isEditingDeparment}
                  onClick={() => setIsConfirmUnarchiveDialogOpen(true)}
                >
                  {formatMessage({ id: 'unarchiveSelected' })}
                </Button>
              )}
              {selectedDepartmentIds.length > 0 && !showArchives && (
                <Button
                  variant="outlined"
                  color="warning"
                  disabled={isArchiving || isUnarchiving || isEditingDeparment}
                  onClick={() => setIsConfirmArchiveDialogOpen(true)}
                >
                  {formatMessage({ id: 'archiveSelected' })}
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
                          !departmentData ||
                          isDepartmentDataFetching ||
                          isArchiving ||
                          isUnarchiving ||
                          isEditingDeparment
                        }
                        onClick={() =>
                          isArchiving || isUnarchiving || isEditingDeparment
                            ? null
                            : selectAllDepartments()
                        }
                        checked={
                          departmentData &&
                          selectedDepartmentIds.length === departmentData.length
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
                          selectedDepartmentIds.length > 1 &&
                          selectedDepartmentIds.length < departmentData.length
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
              {!departmentData || isDepartmentDataFetching ? (
                [...new Array(4)].map((_, index) => (
                  <TableSkeleton key={index} hasCheckbox hasMore />
                ))
              ) : departmentData.length === 0 ? (
                <NoTableElement />
              ) : (
                departmentData.map(
                  (
                    {
                      created_at,
                      department_acronym,
                      department_name,
                      department_id,
                      is_deleted,
                    },
                    index
                  ) => (
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
                          checked={selectedDepartmentIds.includes(
                            department_id
                          )}
                          onClick={() => selectDepartment(department_id)}
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
                        {department_name}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: is_deleted
                            ? theme.common.line
                            : theme.common.body,
                        }}
                      >
                        {department_acronym}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: is_deleted
                            ? theme.common.line
                            : theme.common.body,
                        }}
                      >
                        {formatDate(created_at, {
                          weekday: 'short',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                          year: '2-digit',
                          day: '2-digit',
                        })}
                      </TableCell>
                      <TableCell align="right">
                        {selectedDepartmentIds.length > 0 ? (
                          ''
                        ) : (
                          <Tooltip arrow title={formatMessage({ id: 'more' })}>
                            <IconButton
                              size="small"
                              disabled={
                                isArchiving ||
                                isUnarchiving ||
                                isEditingDeparment
                              }
                              onClick={(event) => {
                                if (
                                  isArchiving ||
                                  isUnarchiving ||
                                  isEditingDeparment
                                )
                                  return null;
                                setAnchorEl(event.currentTarget);
                                setActiveDepartmentId(department_id);
                                setIsActiveDepartmentArchived(is_deleted);
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

        {!!departmentData && !isDepartmentDataFetching && (
          <Tooltip
            arrow
            title={formatMessage({ id: 'addNewDepartment' })}
            placement="left"
          >
            <IconButton
              onClick={() => setIsNewDepartmentDialogOpen(true)}
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

export default Index;
