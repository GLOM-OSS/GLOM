import { useTheme } from '@glom/theme';
import { Icon } from '@iconify/react';
import { Box, Collapse, Tooltip, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { INavItem } from '../SideNav.interfaces';

export default function SideNavItem({
  item: { icon, route, title },
  isExpanded,
}: {
  item: INavItem;
  isExpanded: boolean;
}) {
  const { asPath, push } = useRouter();
  const theme = useTheme();
  const isActive = asPath.startsWith(route);
  return (
    <>
      <Tooltip arrow title={title} placement="right">
        <Box
          onClick={() => push(route)}
          sx={{
            display: isExpanded ? 'none' : 'grid',
            alignItems: 'center',
            gridTemplateColumns: 'auto 1fr',
            columnGap: isExpanded ? 1 : 0,
            padding: 1,
            cursor: 'pointer',
            justifySelf: isExpanded ? 'left' : 'center',
            background: isActive ? theme.common.backgroundSelect : 'none',
            borderRadius: 1,
            width: isExpanded ? '100%' : 'fit-content',
            '&:hover': {
              backgroundColor: isActive
                ? theme.common.backgroundSelect
                : theme.common.blueTransparent,
            },
          }}
        >
          <Icon
            icon={icon}
            color={theme.common.label}
            fontSize={24}
            style={{
              display: isExpanded ? 'none' : 'initial',
            }}
          />
          <Typography
            component={Collapse}
            in={isExpanded}
            orientation="horizontal"
          >
            {title}
          </Typography>
        </Box>
      </Tooltip>
      <Box
        onClick={() => push(route)}
        sx={{
          display: isExpanded ? 'grid' : 'none',
          alignItems: 'center',
          gridTemplateColumns: 'auto 1fr',
          columnGap: isExpanded ? 1 : 0,
          padding: 1,
          cursor: 'pointer',
          justifySelf: isExpanded ? 'left' : 'center',
          background: isActive ? theme.common.backgroundSelect : 'none',
          borderRadius: 1,
          width: isExpanded ? '100%' : 'fit-content',
          '&:hover': {
            backgroundColor: isActive
              ? theme.common.backgroundSelect
              : theme.common.blueTransparent,
          },
        }}
      >
        <Icon
          icon={icon}
          color={theme.common.label}
          fontSize={24}
          style={{ display: isExpanded ? 'initial' : 'none' }}
        />
        <Typography
          component={Collapse}
          in={isExpanded}
          orientation="horizontal"
        >
          {title}
        </Typography>
      </Box>
    </>
  );
}
