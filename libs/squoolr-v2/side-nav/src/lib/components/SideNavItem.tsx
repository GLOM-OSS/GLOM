import { useTheme } from '@glom/theme';
import { Icon } from '@iconify/react';
import { Box, Collapse, Tooltip, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { INavItem } from '../SideNav.interfaces';
import { useDispatchBreadcrumb } from '../breadcrumbContext/BreadcrumbContextProvider';

export default function SideNavItem({
  item: { icon, route, title },
  item,
  isExpanded,
  sectionRoute,
  sectionTitle,
}: {
  item: INavItem;
  isExpanded: boolean;
  sectionRoute: string;
  sectionTitle: string;
}) {
  const { asPath, push } = useRouter();
  const theme = useTheme();
  const breadcrumbDispatch = useDispatchBreadcrumb();
  const isActive = asPath.startsWith(route);

  function openItem(item: INavItem, sectionRoute: string) {
    breadcrumbDispatch({
      action: 'RESET',
      payload: [
        { route: undefined, title: sectionTitle },
        {
          route: `${sectionRoute}/${item.route}`,
          title: `${item.title}`,
        },
      ],
    });
  }

  return (
    <>
      <Tooltip arrow title={title} placement="right">
        <Box
          onClick={() => {
            push(`/${sectionRoute}/${route}`);
            openItem(item, sectionRoute);
          }}
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
        onClick={() => {
          openItem(item, sectionRoute);
          push(`/${sectionRoute}/${route}`);
        }}
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
