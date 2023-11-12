import { Box } from '@mui/material';
import { useEffect } from 'react';
import { SideNav } from './SideNav';
import { INavSection } from './SideNav.interfaces';
import BreadcrumbContextProvider, {
  useDispatchBreadcrumb,
} from './breadcrumbContext/BreadcrumbContextProvider';
import { IBreadcrumbItem } from './breadcrumbContext/BreadcrumbContext';
import LayoutHeader from './components/LayoutHeader';
import { IAppType } from '@glom/squoolr-v2/auth-ui';
import { useRouter } from 'next/router';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

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

  const { asPath } = useRouter();
  useEffect(() => {
    const tt = asPath.split('/').filter((_) => _ !== '');
    if (tt.length === 0) {
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
    } else {
      const base = navSections.find((_) => _.route === tt[0]);
      let payload: IBreadcrumbItem[] = [
        { route: undefined, title: base?.title || '' },
      ];
      if (base && tt.length > 1) {
        const level2 = base.navItems.find((_) => _.route === tt[1]);
        payload.push({
          route: `${base.route}/${level2?.route}`,
          title: level2?.title || '',
        });
      }

      breadcrumbDispatch({
        action: 'RESET',
        payload,
      });
    }
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
  const queryClient = new QueryClient();
  return (
    <BreadcrumbContextProvider>
      <QueryClientProvider client={queryClient}>
        <Layout navSections={navSections} callingApp={callingApp}>
          {children}
        </Layout>
      </QueryClientProvider>
    </BreadcrumbContextProvider>
  );
}
