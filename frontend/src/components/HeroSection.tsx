import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const { t } = useApp();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent opacity-20 pointer-events-none" />
      
      {/* Animated Pulse */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-accent via-foreground to-accent bg-clip-text text-transparent animate-gradient">
              {t('hero_title')}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('hero_subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate('/demo')}
              className="shadow-glow hover:scale-105 transition-all text-lg px-8 py-6"
            >
              {t('try_demo')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/resources')}
              className="transition-all hover:border-accent text-lg px-8 py-6"
            >
              {t('get_help')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
