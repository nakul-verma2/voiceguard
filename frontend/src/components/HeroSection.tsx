import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const { t } = useApp();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden select-none">

      {/* Cinematic Multi-Layer Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-accent/10" />

      {/* Moving Light Sweep */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none"
      >
        <motion.div
          animate={{ x: ['-50%', '120%'] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-3xl"
        />
      </motion.div>

      {/* Floating Particle Field */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:18px_18px] animate-[float_16s_linear_infinite]" />
      </div>

      {/* Deep atmospheric center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-accent/20 blur-[120px] rounded-full opacity-50" />

      {/* Fine-top vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-transparent" />

      {/* Main content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="max-w-5xl mx-auto text-center space-y-10"
        >

          {/* 🚫 Accent marker removed completely */}

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
            <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent drop-shadow-sm">
              {t('hero_title')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground/90 max-w-3xl mx-auto leading-[1.65] font-light">
            {t('hero_subtitle')}
          </p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
          >
            <Button
              size="lg"
              onClick={() => navigate('/demo')}
              className="relative group shadow-xl shadow-accent/20 hover:shadow-2xl hover:shadow-accent/40 hover:scale-[1.025] transition-all duration-300 text-lg px-10 py-7 rounded-xl font-semibold overflow-hidden"
            >
              <span className="relative z-10">{t('try_demo')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/resources')}
              className="relative group border-2 hover:border-accent/50 hover:bg-accent/10 backdrop-blur-sm transition-all duration-300 text-lg px-10 py-7 rounded-xl font-semibold"
            >
              {t('get_help')}
            </Button>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.8 }}
            className="pt-8"
          >
            <p className="text-sm text-muted-foreground/70 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {t('your_privacy_protected')}
            </p>
          </motion.div>

        </motion.div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
