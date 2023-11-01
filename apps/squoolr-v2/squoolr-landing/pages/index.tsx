import Faq from '../components/faq/Faq';
import Features from '../components/features/Features';
import { Footer } from '../components/footer/Footer';
import Hero from '../components/hero/Hero';
import Partner from '../components/partner/Partner';

export function Index({
  setIsContactUsDialogOpen,
  setIsEarlyAccesDialogOpen,
}: {
  setIsEarlyAccesDialogOpen: (val: boolean) => void;
  setIsContactUsDialogOpen: (val: boolean) => void;
}) {
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
