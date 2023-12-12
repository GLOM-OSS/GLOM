import { DialogTransition } from '@glom/components';
import {
  useStaffMember,
  useTeacherTypes,
  useTeachingGrades,
} from '@glom/data-access/squoolr';
import { StaffEntity, TeacherEntity } from '@glom/data-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useIntl } from 'react-intl';
import ReviewColumn from './ReviewColumn';

export default function StaffDetailsDialog({
  isDialogOpen,
  closeDialog,
  staff,
  handleEdit,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  staff: StaffEntity;
  handleEdit: () => void;
}) {
  const { formatMessage } = useIntl();

  const { data: teacherTypes } = useTeacherTypes();
  const { data: teachingGrades } = useTeachingGrades();
  const { data: teacher } = useStaffMember<TeacherEntity>(
    staff.annual_teacher_id,
    'TEACHER'
  );

  const ELEMENTS = [
    'email',
    'first_name',
    'last_name',
    'phone_number',
    'national_id_number',
    'birthdate',
    'gender',
    'address',
    ...(staff.roles.includes('TEACHER')
      ? [
          'teacher_grade',
          'teacher_type',
          'has_tax_payers_card',
          'has_signed_convention',
        ]
      : []),
  ];

  const data = {
    ...staff,
    ...teacher, 
    ...(staff.roles.includes('TEACHER')
      ? {
          teacher_grade: teachingGrades.find(
            ({ teaching_grade_id: tg_id }) =>
              tg_id === teacher.teaching_grade_id
          )?.teaching_grade,
          teacher_type: teacherTypes.find(
            ({ teacher_type_id: tt_id }) => tt_id === teacher.teacher_type_id
          )?.teacher_type,
          has_signed_convention: formatMessage({
            id: teacher.has_signed_convention ? 'yes' : 'no',
          }),
          has_tax_payers_card: formatMessage({
            id: teacher.has_tax_payers_card ? 'yes' : 'no',
          }),
        }
      : {}),
  };

  return (
    <Dialog
      TransitionComponent={DialogTransition}
      open={isDialogOpen}
      onClose={closeDialog}
      sx={{
        '& .MuiPaper-root': {
          padding: { laptop: '2% 10%', mobile: 0 },
        },
      }}
    >
      <DialogTitle>
        {formatMessage({
          id: staff.roles.includes('TEACHER')
            ? 'teacherDetails'
            : staff.roles.includes('CONFIGURATOR')
            ? 'configuratorDetails'
            : 'registryDetails',
        })}
      </DialogTitle>
      <DialogContent>
        <ReviewColumn data={data} order={ELEMENTS} title="" />
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={handleEdit}>
            {formatMessage({ id: 'edit' })}
          </Button>
          <Button variant="contained" color="primary" onClick={closeDialog}>
            {formatMessage({ id: 'ok' })}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
