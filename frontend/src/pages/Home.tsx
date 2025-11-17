import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import ContentWarningModal from '@/components/ContentWarningModal';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <ContentWarningModal />
      <main>
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
      </main>
    </div>
  );
};

export default Home;
