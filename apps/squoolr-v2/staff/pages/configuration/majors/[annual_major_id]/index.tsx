import {
  useBreadcrumb,
  useDispatchBreadcrumb,
} from '@glom/squoolr-v2/side-nav';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Index() {
  const breadcrumbDispatch = useDispatchBreadcrumb();
  const breadcrumbs = useBreadcrumb();
  const {
    query: { annual_major_id },
    asPath,
  } = useRouter();
  useEffect(() => {
    if (
      !breadcrumbs.find(
        ({ route }) => route && route.includes(annual_major_id as string)
      )
    ) {
      breadcrumbDispatch({
        action: 'ADD',
        // TODO: THE IRT HERE SHOULD BE SWAPPED WITH ACTUAL DATA WHEN IT IS FETCHED
        payload: [{ title: 'IRT', route: asPath }],
      });
    }
  }, [annual_major_id]);
  return <div>Major classrooms</div>;
}
