import {
  ConfirmDialog,
  NoTableElement,
  TableHeaderItem,
  TableSkeleton,
} from '@glom/components';
import {
  MajorEntity,
  StaffEntity,
  StaffRole,
  BulkDisableStaffPayload,
} from '@glom/data-types/squoolr';
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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  lighten,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import AddMajorDialog from '../../../components/configuration/majors/AddMajorDialog';
import EditMajorDialog from '../../../components/configuration/majors/EditMajorDialog';
import ManageMajorMenu from '../../../components/configuration/majors/ManageMajorMenu';
import FilterMenu from '../../../components/configuration/staff/FilterMenu';
import StaffRoles from '../../../components/configuration/staff/StaffRoles';
import TableHeader from '../../../components/configuration/staff/TableHeader';
import StaffTableHead from 'apps/squoolr-v2/staff/components/configuration/staff/StaffTableHead';
import StaffRow from 'apps/squoolr-v2/staff/components/configuration/staff/StaffRow';
export default function Staff() {
  const theme = useTheme();
  const { push, asPath } = useRouter();
  const breadcrumbDispatch = useDispatchBreadcrumb();
  const { formatMessage, formatDate, formatNumber } = useIntl();

  //TODO: REPLACE WITH with reactQuery own
  const [isStaffDataFetching, setIsStaffDataFetching] = useState<boolean>(true);

  const [searchValue, setSearchValue] = useState<string>('');
  const [showArchives, setShowArchives] = useState<boolean>(false);
  const [staffData, setStaffData] = useState<StaffEntity[]>();
  const [numberOfSelectedStaffIds, setNumberOfSelectedStaffIds] =
    useState<number>(0);
  const [totalNumberOfIds, setTotalNumberOfIds] = useState<number>(0);
  const [selectedStaff, setSelectedStaff] = useState<
    Record<keyof BulkDisableStaffPayload, string[]>
  >({
    configuratorIds: [],
    registryIds: [],
    teacherIds: [],
  });
  const [selectedRoles, setSelectedRoles] = useState<StaffRole[]>([
    'CONFIGURATOR',
    'COORDINATOR',
    'REGISTRY',
    'TEACHER',
  ]);
  function selectRole(role: StaffRole) {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((_) => _ !== role) : [...prev, role]
    );
  }

  useEffect(() => {
    setNumberOfSelectedStaffIds(
      Object.keys(selectedStaff)
        .map((category) => selectedStaff[category].length)
        .reduce((totalIds, categoryIdLength) => totalIds + categoryIdLength, 0)
    );
  }, [selectedStaff]);

  useEffect(() => {
    if (staffData) {
      setTotalNumberOfIds(
        staffData
          .map(({ roles }) =>
            roles.includes('COORDINATOR') ? roles.length - 1 : roles.length
          )
          .reduce(
            (totalRoles, staffNumberOfRoles) => totalRoles + staffNumberOfRoles,
            0
          )
      );
    }
  }, [staffData]);

  useEffect(() => {
    //TODO: CALL fetch staff API HERE with searchValue, showArchives and selectedRoles use it to filter. MUTATE majors DATA WHEN IT'S DONE
    alert('hello world');
  }, [searchValue, showArchives, selectedRoles]);

  //TODO: REMOVE THIS WHEN INTEGRATION IS DONE
  useEffect(() => {
    //TODO: FETCH staff list HERE
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
          // has_signed_convention: false,
          // has_tax_payers_card: false,
          // hourly_rate: 2000,
          // origin_institute: 'IAI',
          // teacher_type_id: '',
          // teaching_grade_id: '',
          address: '',
          annual_configurator_id: 'configurator_id',
          annual_coordinator_id: '',
          annual_registry_id: 'registry_id',
          annual_teacher_id: 'teacger_id',
          national_id_number: '000316122',
          // tax_payer_card_number: '',
        },
      ]);
      setIsStaffDataFetching(false);
    }, 3000);
  }, []);

  const [isConfirmBanDialogOpen, setIsConfirmBanDialogOpen] =
    useState<boolean>(false);
  const [isConfirmUnBanDialogOpen, setIsConfirmUnBanDialogOpen] =
    useState<boolean>(false);
  const [
    isConfirmResetPrivateCodeDialogOpen,
    setIsConfirmResetPrivateCodeDialogOpen,
  ] = useState<boolean>(false);
  const [
    isConfirmResetPasswordDialogOpen,
    setIsConfirmResetPasswordDialogOpen,
  ] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(
    null
  );

  /**
   * This function helps to select/unselect all staff members.
   * It does by:
   *
   * Def:
   * Staff role: roles of a staff member
   *
   * To unselect all, it counts all staff roles except coordinator in the staff list
   * and compares it to the joint list of elements in the selectedStaff list categories.
   *
   * if both numbers are same, then we've selected all and have to unselect all
   * hence returning empty arrays.
   *
   * if they're different, then all are not selected, and hence it selects all.
   * To select all, it maps through the staff member list.
   * for each of them, it verifies if they have configurator, registry and teacher ids,
   * and adds them to the corresponding list if they're not they yet
   */
  function selectAllStaff() {
    let configurators = selectedStaff.configuratorIds;
    let registries = selectedStaff.registryIds;
    let teachers = selectedStaff.teacherIds;
    if (
      staffData
        .map(({ roles }) =>
          roles.includes('COORDINATOR') ? roles.length - 1 : roles.length
        )
        .reduce(
          (totalRoles, staffNumberOfRoles) => totalRoles + staffNumberOfRoles,
          0
        ) ===
      Object.keys(selectedStaff)
        .map((category) => selectedStaff[category].length)
        .reduce((totalIds, categoryIdLength) => totalIds + categoryIdLength, 0)
    ) {
      configurators = [];
      registries = [];
      teachers = [];
    } else
      staffData.forEach(
        ({ annual_configurator_id, annual_registry_id, annual_teacher_id }) => {
          if (
            !!annual_configurator_id &&
            !configurators.includes(annual_configurator_id)
          )
            configurators.push(annual_configurator_id);
          if (!!annual_registry_id && !registries.includes(annual_registry_id))
            registries.push(annual_registry_id);
          if (!!annual_teacher_id && !teachers.includes(annual_teacher_id))
            teachers.push(annual_teacher_id);
        }
      );

    setSelectedStaff({
      configuratorIds: configurators,
      registryIds: registries,
      teacherIds: teachers,
    });
  }

  /**
   * This function helps to add a staff member in the selected staff list
   * it does so by checking if a role_id exists
   * and adding it to the corresponding role's list in selectedStaff
   * or removing it from the list if it already exists there.
   *
   * @param {string=} annual_configurator_id - staff's configurator id if exists
   * @param {string=} annual_registry_id - staff's registry id if exists
   * @param {string=} annual_teacher_id - staffs teacher id if exists
   */
  function selectStaff(
    annual_configurator_id?: string,
    annual_registry_id?: string,
    annual_teacher_id?: string
  ) {
    if (annual_configurator_id || annual_registry_id || annual_teacher_id) {
      let configurators = selectedStaff.configuratorIds;
      let registries = selectedStaff.registryIds;
      let teachers = selectedStaff.teacherIds;

      if (!!annual_configurator_id) {
        configurators = configurators.includes(annual_configurator_id)
          ? configurators.filter((_) => _ !== annual_configurator_id)
          : [...configurators, annual_configurator_id];
      }
      if (!!annual_registry_id) {
        registries = registries.includes(annual_registry_id)
          ? registries.filter((_) => _ !== annual_registry_id)
          : [...registries, annual_registry_id];
      }
      if (!!annual_teacher_id) {
        teachers = teachers.includes(annual_teacher_id)
          ? teachers.filter((_) => _ !== annual_teacher_id)
          : [...teachers, annual_teacher_id];
      }

      setSelectedStaff({
        configuratorIds: configurators,
        registryIds: registries,
        teacherIds: teachers,
      });
    }
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
        anchorEl={filterAnchorEl}
        selectedRoles={selectedRoles}
        onSelect={selectRole}
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
        <TableHeader
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          showArchives={showArchives}
          setShowArchives={setShowArchives}
          numberOfSelectedStaffIds={numberOfSelectedStaffIds}
          disabled={
            !staffData || isArchiving || isUnarchiving || isEditingStaff
          }
          canResetPrivateCode={!selectedRoles.includes('CONFIGURATOR')}
          setFilterAnchorEl={setFilterAnchorEl}
          resetPassword={() => setIsConfirmResetPasswordDialogOpen(true)}
          banUsers={() => setIsConfirmBanDialogOpen(true)}
          unbanUsers={() => setIsConfirmUnBanDialogOpen(true)}
          resetPrivateCode={() => setIsConfirmResetPrivateCodeDialogOpen(true)}
        />
        <TableContainer
          sx={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        >
          <Table stickyHeader>
            <StaffTableHead
              selectAllStaff={selectAllStaff}
              disabled={
                !staffData ||
                isStaffDataFetching ||
                isArchiving ||
                isUnarchiving ||
                isEditingStaff
              }
              isAllSelected={
                totalNumberOfIds === numberOfSelectedStaffIds && !!staffData
              }
              isIndeterminate={
                numberOfSelectedStaffIds > 1 &&
                numberOfSelectedStaffIds < totalNumberOfIds
              }
            />
            <TableBody>
              {!staffData || isStaffDataFetching ? (
                <TableSkeleton cols={7} hasCheckbox hasMore />
              ) : staffData.length === 0 ? (
                <NoTableElement />
              ) : (
                staffData.map((staff, index) => (
                  <StaffRow
                    key={index}
                    staff={staff}
                    disabled={isArchiving || isUnarchiving || isEditingStaff}
                    showMoreIcon={numberOfSelectedStaffIds > 0}
                    selectedStaff={selectedStaff}
                    selectStaff={selectStaff}
                    setAnchorEl={setAnchorEl}
                    showArchived={showArchives}
                  />
                ))
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
