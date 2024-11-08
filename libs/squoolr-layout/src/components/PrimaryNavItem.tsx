import { Box, Tooltip } from '@mui/material';
import { INavItem } from '@squoolr/interfaces';
import { theme } from '@glom/theme';
import { useIntl } from 'react-intl';

export default function PrimaryNavItem({
  navItem: { Icon, title, id },
  activeNavItem,
  handleSelect,
}: {
  navItem: INavItem;
  activeNavItem?: INavItem;
  handleSelect: () => void;
}) {
  const intl = useIntl();
  const { formatMessage } = intl;
  return (
    <Box
      sx={{
        height: 50,
        position: 'relative',
        display: 'grid',
        justifyItems: 'center',
        alignItems: 'center',
        transition: '0.2s',
        '&::before': {
          transition: '0.2s',
          position: 'absolute',
          left: '0px',
          bottom: '0px',
          width: activeNavItem?.id === id ? '4px' : 0,
          content: '""',
          height: '100%',
          backgroundColor: theme.common.background,
        },
        ':hover': {
          transition: '0.2s',
          background: theme.palette.primary.dark,
        },
      }}
      onClick={handleSelect}
    >
      <Tooltip arrow title={formatMessage({ id: title })}>
        <Icon
          fontSize="medium"
          sx={{ color: theme.common.background, fontSize: 30 }}
        />
      </Tooltip>
    </Box>
  );
}
