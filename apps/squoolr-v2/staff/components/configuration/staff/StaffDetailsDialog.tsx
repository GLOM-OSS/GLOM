import { StaffEntity } from '@glom/data-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useIntl } from 'react-intl';
import ReviewColumn from './ReviewColumn';
import { DialogTransition } from '@glom/components';
import { useState } from 'react';

//TODO: EXPOSE THIS INTERFACES AN DELETE THIS
interface TeacherTypeEntity {
  teacher_type_id: string;
  teacher_type: string;
}

//TODO: EXPOSE THIS INTERFACES AN DELETE THIS
interface TeacherGradeEntity {
  teacher_grade_id: string;
  teacher_grade: string;
}

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

  //TODO: CALL API HER TO FETCH teacherTypes
  const [teacherTypes, setTeacherTypes] = useState<TeacherTypeEntity[]>([
    { teacher_type: 'Vacataire', teacher_type_id: '1' },
    { teacher_type: 'Permanent', teacher_type_id: '3' },
    { teacher_type: 'Missionnaire', teacher_type_id: '2' },
  ]);
  //TODO: CALL API HER TO FETCH teacherGrades
  const [teacherGrades, setTeacherGrades] = useState<TeacherGradeEntity[]>([
    { teacher_grade: 'Professeur', teacher_grade_id: '1' },
    { teacher_grade: 'Maitre des conferences', teacher_grade_id: '2' },
    { teacher_grade: 'Licencie', teacher_grade_id: '3' },
  ]);

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
    ...(staff.roles.includes('TEACHER')
      ? {
          teacher_grade: teacherGrades.find(
            ({ teacher_grade_id: tg_id }) => tg_id === staff.teaching_grade_id
          )?.teacher_grade,
          teacher_type: teacherTypes.find(
            ({ teacher_type_id: tt_id }) => tt_id === staff.teacher_type_id
          )?.teacher_type,
          has_signed_convention: formatMessage({
            id: staff.has_signed_convention ? 'yes' : 'no',
          }),
          has_tax_payers_card: formatMessage({
            id: staff.has_tax_payers_card ? 'yes' : 'no',
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
