import { Box } from '@mui/material';
import { useEffect } from 'react';
import { SideNav } from './SideNav';
import { INavSection } from './SideNav.interfaces';
import BreadcrumbContextProvider, {
  useDispatchBreadcrumb,
} from './breadcrumbContext/BreadcrumbContextProvider';
import LayoutHeader from './components/LayoutHeader';
import { IAppType } from '@glom/squoolr-v2/auth-ui';

function Layout({
  navSections,
  children,
  callingApp,
}: {
  callingApp: IAppType;

  navSections: INavSection[];
  children?: JSX.Element;
}) {
  const breadcrumbDispatch = useDispatchBreadcrumb();
  useEffect(() => {
    breadcrumbDispatch({
      action: 'RESET',
      payload: [
        { route: undefined, title: navSections[0].title },
        {
          route: `${navSections[0].route}/${navSections[0].navItems[0].route}`,
          title: `${navSections[0].navItems[0].title}`,
        },
      ],
    });
  }, []);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        height: '100%',
      }}
    >
      <SideNav callingApp={callingApp} navSections={navSections} />
      <Box
        sx={{ height: '100%', display: 'grid', gridTemplateRows: 'auto 1fr' }}
      >
        <LayoutHeader callingApp={callingApp} />
        <Box sx={{ padding: '24px 40px' }}>{children}</Box>
      </Box>
    </Box>
  );
}

export function SquoolrV2Layout({
  navSections,
  children,
  callingApp,
}: {
  navSections: INavSection[];
  children?: JSX.Element;
  callingApp: IAppType;
}) {
  return (
    <BreadcrumbContextProvider>
      <Layout navSections={navSections} callingApp={callingApp}>
        {children}
      </Layout>
    </BreadcrumbContextProvider>
  );
}
