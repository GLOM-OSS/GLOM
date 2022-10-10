import { Box } from '@mui/material';
import { theme } from '@squoolr/theme';
import { useState } from 'react';
import ActionBar from '../../components/secretary/personnel/actionBar';
import PersonnelTabs, {
  TabItem,
} from '../../components/secretary/personnel/personnelTabs';

export default function Personnel() {
  const [activeTabItem, setActiveTabItem] = useState<TabItem>('allPersonnel');
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto auto 1fr',
        height: '100%',
        gap: theme.spacing(2)
      }}
    >
      <PersonnelTabs setActiveTabItem={setActiveTabItem} />
      <ActionBar />
      <Box sx={{ height: '100%' }}>{activeTabItem}</Box>
    </Box>
  );
}
