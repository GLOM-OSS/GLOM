import { Box } from '@mui/material';
import { useState } from 'react';
import PersonnelTabs, {
  TabItem,
} from '../../components/secretary/personnelTabs';

export default function Personnel() {
  const [activeTabItem, setActiveTabItem] = useState<TabItem>('allPersonnel');
  return (
    <Box>
      <PersonnelTabs setActiveTabItem={setActiveTabItem} />
    </Box>
  );
}
