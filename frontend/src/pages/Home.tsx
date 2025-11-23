import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import LegalSection from '@/components/LegalSection';
import NGOSection from '@/components/NGOSection';
import StealthSection from '@/components/StealthSection';
import FooterSection from '@/components/FooterSection';
import ContentWarningModal from '@/components/ContentWarningModal';
import Chatbot from '@/components/Chatbot';

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ContentWarningModal />
      <main>
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
        <LegalSection />
        <NGOSection />
        <StealthSection />
        <FooterSection />
      </main>
      <Chatbot />
    </div>
  );
};

export default Home;