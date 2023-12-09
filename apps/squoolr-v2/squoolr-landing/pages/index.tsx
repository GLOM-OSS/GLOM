import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Faq from '../components/faq/Faq';
import Features from '../components/features/Features';
import { Footer } from '../components/footer/Footer';
import Hero from '../components/hero/Hero';
import Partner from '../components/partner/Partner';

export function Index({
  setIsContactUsDialogOpen,
  setIsEarlyAccesDialogOpen,
  setDemandCode,
  setIsStatusDialogOpen,
}: {
  setIsEarlyAccesDialogOpen: (val: boolean) => void;
  setIsContactUsDialogOpen: (val: boolean) => void;
  setIsStatusDialogOpen: (val: boolean) => void;
  setDemandCode: (val: string) => void;
}) {
  const { query, pathname } = useRouter();
  useEffect(() => {
    if (
      typeof query.status !== 'undefined' &&
      pathname.split('/').join('') === ''
    ) {
      if (query.status !== 'true') setDemandCode(query.status as string);
      setIsStatusDialogOpen(true);
    }
  }, [query.status]);

  return (
    <>
      <Hero openEarlyAccess={() => setIsEarlyAccesDialogOpen(true)} />
      <Features openEarlyAccess={() => setIsEarlyAccesDialogOpen(true)} />
      <Partner />
      <Faq />
      <Footer
        canDemand={false}
        openContactUs={() => setIsContactUsDialogOpen(true)}
        openEarlyAccess={() => setIsEarlyAccesDialogOpen(true)}
      />
    </>
  );
}

export default Index;
