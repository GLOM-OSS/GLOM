import { useEffect, useState } from 'react';
import Faq from '../components/faq/Faq';
import Features from '../components/features/Features';
import { Footer } from '../components/footer/Footer';
import Hero from '../components/hero/Hero';
import Partner from '../components/partner/Partner';
import { useRouter } from 'next/router';
import StatusDialog from '../components/demand/status/StatusDialog';

export function Index({
  setIsContactUsDialogOpen,
  setIsEarlyAccesDialogOpen,
}: {
  setIsEarlyAccesDialogOpen: (val: boolean) => void;
  setIsContactUsDialogOpen: (val: boolean) => void;
}) {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState<boolean>(false);
  const [demandCode, setDemandCode] = useState<string>('');
  const { query } = useRouter();

  useEffect(() => {
    if (typeof query.status !== 'undefined') {
      if (query.status !== 'true') setDemandCode(query.status as string);
      setIsStatusDialogOpen(true);
    }
  }, []);

  return (
    <>
      <StatusDialog
        closeDialog={() => setIsStatusDialogOpen(false)}
        open={isStatusDialogOpen}
        demandCode={demandCode}
      />
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
