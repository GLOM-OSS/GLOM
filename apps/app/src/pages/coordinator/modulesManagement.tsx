import { Box } from '@mui/material';
import CreditUnitLane from '../../components/coordinator/CreditUnitLane';

export default function ModulesManagement() {
  return (
    <Box>
      <CreditUnitLane
        creditUnit={{
          credit_points: 8,
          credit_unit_code: 'UC0116',
          credit_unit_name: 'Informatique 1',
          semester_number: 2,
        }}
      />
    </Box>
  );
}
