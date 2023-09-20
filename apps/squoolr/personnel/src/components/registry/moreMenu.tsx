import { Box, Menu, MenuItem } from '@mui/material';
import { theme } from '@squoolr/theme';
import { useIntl } from 'react-intl';

export default function MoreMenu({
  anchorEl,
  setAnchorEl,
  openCarryOverDialog,
  openEvaluationWeightingDialog,
  openExamAccessDialog,
}: {
  openCarryOverDialog: () => void;
  openEvaluationWeightingDialog: () => void;
  openExamAccessDialog: () => void;
  anchorEl: HTMLAnchorElement | null;
  setAnchorEl: (anchor: HTMLAnchorElement | null) => void;
}) {
  const { formatMessage } = useIntl();
  const menuItems: { menu_title: string; executeFunction: () => void }[] = [
    { menu_title: 'carryOverSystem', executeFunction: openCarryOverDialog },
    {
      menu_title: 'evaluationWeighting',
      executeFunction: openEvaluationWeightingDialog,
    },
    {
      menu_title: 'examAccessConditions',
      executeFunction: openExamAccessDialog,
    },
  ];
  return (
    <Menu
      anchorEl={anchorEl}
      open={anchorEl !== null}
      onClose={() => setAnchorEl(null)}
    >
      <Box
        sx={{
          p: 1,
          display: 'grid',
          minWidth: 150,
          rowGap: theme.spacing(1),
        }}
      >
        {menuItems.map(({ menu_title, executeFunction }, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              executeFunction();
              setAnchorEl(null);
            }}
            sx={{ padding: theme.spacing(1), minHeight: 'fit-content' }}
          >
            {formatMessage({ id: menu_title })}
          </MenuItem>
        ))}
      </Box>
    </Menu>
  );
}
