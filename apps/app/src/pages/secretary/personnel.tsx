import { Box } from '@mui/material';
import { theme } from '@squoolr/theme';
import { useEffect, useState } from 'react';
import ActionBar from '../../components/secretary/personnel/actionBar';
import PersonnelTabs, {
  TabItem,
} from '../../components/secretary/personnel/personnelTabs';

export default function Personnel() {
  const [activeTabItem, setActiveTabItem] = useState<TabItem>('allPersonnel');
  const [searchValue, setSearchValue] = useState<string>('');
  const [isAddNewPersonnelDialogOpen, setIsAddNewPersonnelDialogOPen] =
    useState<boolean>(false);

  const getPersonnels = () => {
    alert('changing value');
  };

  useEffect(() => {
    getPersonnels();
  }, [searchValue, activeTabItem]);
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto auto 1fr',
        height: '100%',
        gap: theme.spacing(3),
      }}
    >
      <PersonnelTabs setActiveTabItem={setActiveTabItem} />
      <ActionBar
        search={{ searchValue, setSearchValue }}
        handleAddClick={() =>
          isAddNewPersonnelDialogOpen
            ? null
            : setIsAddNewPersonnelDialogOPen(true)
        }
      />
      <Box sx={{ height: '100%' }}>{activeTabItem}</Box>
    </Box>
  );
}
