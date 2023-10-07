import { Box, Tab, Tabs } from '@mui/material';
import { theme } from '@glom/theme';
import { useState } from 'react';
import { useIntl } from 'react-intl';

export type TabItem =
  | 'allPersonnel'
  | 'secretariat'
  | 'academicService'
  | 'coordinator'
  | 'teacher';

export default function PersonnelTabs({
  setActiveTabItem,
}: {
  setActiveTabItem: (item: TabItem) => void;
}) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const { formatMessage } = useIntl();

  const tabItems: TabItem[] = [
    'allPersonnel',
    'secretariat',
    'academicService',
    'coordinator',
    'teacher',
  ];
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={activeTab}
        onChange={(event: React.SyntheticEvent, value: number) => {
          setActiveTab(value);
          setActiveTabItem(tabItems[value]);
        }}
        aria-label="basic tabs example"
      >
        {tabItems.map((tab_title, index) => (
          <Tab
            key={index}
            label={formatMessage({ id: tab_title })}
            sx={{
              ...theme.typography.body1,
              fontWeight: 500,
              textTransform: 'none',
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
}
