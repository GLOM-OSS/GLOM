import {
  ConfirmDialog,
  NoTableElement,
  TableHeaderItem,
  TableSkeleton,
} from '@glom/components';
import { MajorEntity } from '@glom/data-types/squoolr';
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
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import FilterMenu from '../../../components/configuration/departments/FilterMenu';
import AddMajorDialog from '../../../components/configuration/majors/AddMajorDialog';
import EditMajorDialog from '../../../components/configuration/majors/EditMajorDialog';
import ManageMajorMenu from '../../../components/configuration/majors/ManageMajorMenu';
import {
  useDisableMajors,
  useMajors,
  useUpdateMajor,
} from '@glom/data-access/squoolr';

export function Index() {
  const theme = useTheme();
  const { push, asPath } = useRouter();
  const breadcrumbDispatch = useDispatchBreadcrumb();
  const { formatMessage, formatDate, formatNumber } = useIntl();

  const tableHeaders = [
    '',
    'code#',
    'majorName',
    'departmentCode',
    'cursus',
    'createdAt',
    '',
  ];

  const [searchValue, setSearchValue] = useState<string>('');
  const [showArchives, setShowArchives] = useState<boolean>(false);
  const {
    data: majorData,
    isFetching: isMajorDataFetching,
    refetch: refetchMajors,
  } = useMajors({
    is_deleted: showArchives,
    keywords: searchValue,
  });

  const [canSearchExpand, setCanSearchExpand] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(
    null
  );

  const [selectedMajorIds, setSelectedMajorIds] = useState<string[]>([]);

  function selectAllMajors() {
    setSelectedMajorIds(
      selectedMajorIds.length === majorData.length
        ? []
        : majorData.map(({ annual_major_id }) => annual_major_id)
    );
  }

  function selectMajor(annual_major_id: string) {
    setSelectedMajorIds(
      selectedMajorIds.includes(annual_major_id)
        ? selectedMajorIds.filter(
            (selectedMajorId) => selectedMajorId !== annual_major_id
          )
        : [...selectedMajorIds, annual_major_id]
    );
  }

  const [activeMajorId, setActiveMajorId] = useState<string>();
  const [isActiveMajorArchived, setIsActiveMajorArchived] =
    useState<boolean>(false);

  const [isConfirmArchiveDialogOpen, setIsConfirmArchiveDialogOpen] =
    useState<boolean>(false);
  const [isConfirmUnarchiveDialogOpen, setIsConfirmUnarchiveDialogOpen] =
    useState<boolean>(false);

  const { mutate: archiveMajors, isPending: isHandlingArchive } =
    useDisableMajors();

  function handleArchive() {
    archiveMajors(
      {
        disable: isConfirmArchiveDialogOpen || !isConfirmUnarchiveDialogOpen,
        annualMajorIds:
          selectedMajorIds.length > 1 ? selectedMajorIds : [activeMajorId],
      },
      {
        onSuccess() {
          (isConfirmArchiveDialogOpen
            ? setIsConfirmArchiveDialogOpen
            : setIsConfirmUnarchiveDialogOpen)(false);
          setActiveMajorId(undefined);
          refetchMajors();
        },
      }
    );
  }

  const [isNewMajorDialogOpen, setIsNewMajorDialogOpen] =
    useState<boolean>(false);
  const [isEditMajorDialogOpen, setIsEditMajorDialogOpen] =
    useState<boolean>(false);

  const [editableMajor, setEditableMajor] = useState<MajorEntity>();

  return (
    <>
      <AddMajorDialog
        isDialogOpen={isNewMajorDialogOpen}
        closeDialog={() => {
          setIsNewMajorDialogOpen(false);
          refetchMajors();
        }}
      />
      {editableMajor && (
        <EditMajorDialog
          isDialogOpen={isEditMajorDialogOpen}
          closeDialog={() => {
            refetchMajors();
            setIsEditMajorDialogOpen(false);
          }}
          editableMajor={editableMajor}
        />
      )}
      <FilterMenu
        closeMenu={() => {
          setFilterAnchorEl(null);
        }}
        isOpen={!!filterAnchorEl}
        onShowArchives={() => setShowArchives((prev) => !prev)}
        anchorEl={filterAnchorEl}
        showArchives={showArchives}
      />

      <ManageMajorMenu
        anchorEl={anchorEl}
        closeMenu={() => setAnchorEl(null)}
        isOpen={!!anchorEl}
        isArchived={isActiveMajorArchived}
        confirmArchive={() => setIsConfirmArchiveDialogOpen(true)}
        confirmUnarchive={() => setIsConfirmUnarchiveDialogOpen(true)}
        editMajor={() => {
          setActiveMajorId(undefined);
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
      />
      <ConfirmDialog
        closeDialog={() => {
          setIsConfirmArchiveDialogOpen(false);
          setIsConfirmUnarchiveDialogOpen(false);
        }}
        dialogMessage={formatMessage({
          id: isConfirmArchiveDialogOpen
            ? selectedMajorIds.length > 1
              ? 'confirmArchiveMajorsDialogMessage'
              : 'confirmArchiveMajorDialogMessage'
            : selectedMajorIds.length > 1
            ? 'confirmUnarchiveMajorsDialogMessage'
            : 'confirmUnarchiveMajorDialogMessage',
        })}
        isDialogOpen={
          isConfirmArchiveDialogOpen || isConfirmUnarchiveDialogOpen
        }
        confirm={handleArchive}
        dialogTitle={formatMessage({
          id: isConfirmArchiveDialogOpen
            ? selectedMajorIds.length > 1
              ? 'archiveMajors'
              : 'archiveMajor'
            : selectedMajorIds.length > 1
            ? 'unarchiveMajors'
            : 'unarchiveMajor',
        })}
        confirmButton={formatMessage({
          id: isConfirmArchiveDialogOpen ? 'archive' : 'unarchive',
        })}
        danger
        closeOnConfirm
        isSubmitting={isHandlingArchive}
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
              onClick={() => refetchMajors()}
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
              {selectedMajorIds.length > 0 && showArchives && (
                <Button
                  variant="outlined"
                  color="warning"
                  disabled={isHandlingArchive}
                  onClick={() => setIsConfirmUnarchiveDialogOpen(true)}
                >
                  {formatMessage({ id: 'unarchiveSelectedMajors' })}
                </Button>
              )}
              {selectedMajorIds.length > 0 && !showArchives && (
                <Button
                  variant="outlined"
                  color="warning"
                  disabled={isHandlingArchive}
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
                          !majorData || isMajorDataFetching || isHandlingArchive
                        }
                        onClick={() =>
                          isHandlingArchive ? null : selectAllMajors()
                        }
                        checked={
                          !!majorData &&
                          selectedMajorIds.length === majorData.length
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
                          selectedMajorIds.length > 1 &&
                          selectedMajorIds.length < majorData.length
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
              {!majorData || isMajorDataFetching ? (
                <TableSkeleton cols={7} hasCheckbox hasMore />
              ) : majorData.length === 0 ? (
                <NoTableElement rowSpan={7} />
              ) : (
                majorData.map((major, index) => {
                  const {
                    major_acronym,
                    major_name,
                    department_acronym,
                    cycle: { cycle_name, number_of_years },
                    annual_major_id,
                    is_deleted,
                    created_at,
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
                          checked={selectedMajorIds.includes(annual_major_id)}
                          onClick={() => selectMajor(annual_major_id)}
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
                        {major_acronym}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: is_deleted
                            ? theme.common.line
                            : theme.common.body,
                        }}
                      >
                        {major_name}
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
                          color: theme.palette.primary.main,
                        }}
                      >
                        {`${formatMessage({
                          id: cycle_name,
                        })} (${formatNumber(number_of_years, {
                          style: 'unit',
                          unit: 'year',
                          unitDisplay: 'short',
                        })})`}
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
                        {selectedMajorIds.length > 0 ? (
                          ''
                        ) : (
                          <Tooltip arrow title={formatMessage({ id: 'more' })}>
                            <IconButton
                              size="small"
                              disabled={isHandlingArchive}
                              onClick={(event) => {
                                if (isHandlingArchive) return null;
                                setAnchorEl(event.currentTarget);
                                setActiveMajorId(annual_major_id);
                                setIsActiveMajorArchived(is_deleted);
                                setEditableMajor(major);
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

        {!!majorData && !isMajorDataFetching && (
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

export default Index;
