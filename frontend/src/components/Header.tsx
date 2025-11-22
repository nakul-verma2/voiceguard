import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Moon, Sun } from 'lucide-react';

const Header = () => {
  const { mode, toggleMode, language, setLanguage, t } = useApp();
  const navigate = useNavigate();

  const handleQuickExit = () => {
    window.location.replace('https://www.google.com');
  };

  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇬🇧' },
    { value: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { value: 'bn', label: 'বাংলা', flag: '🇧🇩' },
    { value: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
    { value: 'te', label: 'తెలుగు', flag: '🇮🇳' },
    { value: 'mr', label: 'मराठी', flag: '🇮🇳' },
  ];

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-background/95 border-b border-white/10 shadow-2xl shadow-black/20"
    >
      {/* Ambient gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 pointer-events-none" />
      
      <nav className="container mx-auto px-6 py-4 relative">
        <div className="flex items-center justify-between">
          
          {/* Logo Section - Enhanced */}
          <motion.button 
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 group relative"
          >
            {/* Icon/Shield */}
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full group-hover:bg-accent/30 transition-all duration-300" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg shadow-accent/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            
            {/* Brand Name */}
            <div className="flex flex-col items-start">
              <span className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                VoiceGuard
              </span>
              <span className="text-[10px] text-muted-foreground/60 font-medium tracking-wider uppercase">
                Safety First
              </span>
            </div>
            
            {/* Hover effect line */}
            <div className="absolute -bottom-2 left-0 w-0 h-[2px] bg-gradient-to-r from-accent to-transparent group-hover:w-full transition-all duration-500" />
          </motion.button>

          {/* Controls Section - Modernized */}
          <div className="flex items-center gap-4">
            
            {/* Mode Toggle - Icon Based */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMode}
                className="relative h-10 px-4 rounded-xl border border-white/10 bg-card/50 backdrop-blur-md hover:bg-accent/10 hover:border-accent/40 transition-all duration-300 shadow-lg hover:shadow-accent/20"
              >
                <span className="flex items-center gap-2 font-medium text-sm">
                  {mode === 'impact' ? (
                    <>
                      <Moon className="w-4 h-4" />
                      <span className="hidden sm:inline">{t('calm_mode')}</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4" />
                      <span className="hidden sm:inline">{t('impact_mode')}</span>
                    </>
                  )}
                </span>
              </Button>
            </motion.div>
            
            {/* Language Selector - Custom Styled */}
            <div className="relative group">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="h-10 pl-10 pr-10 rounded-xl border border-white/10 bg-card/50 backdrop-blur-md text-foreground text-sm font-medium transition-all duration-300 hover:border-accent/40 hover:bg-accent/5 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent shadow-lg hover:shadow-accent/20 cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23888'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.25rem',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {languageOptions.map(opt => (
                  <option 
                    key={opt.value} 
                    value={opt.value}
                    className="bg-card text-foreground py-2"
                  >
                    {opt.flag} {opt.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Quick Exit Button - Prominent */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                onClick={handleQuickExit}
                className="relative h-10 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 border-0 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {t('quick_exit')}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>
      
      {/* Bottom accent glow line */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-accent/40 to-transparent blur-sm"
      />
    </motion.header>
  );
};

export default Header;