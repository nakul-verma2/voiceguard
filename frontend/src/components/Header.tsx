import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Moon, Sun } from 'lucide-react';
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react"; // 👈 Import Clerk

const Header = () => {
  const { mode, toggleMode, language, setLanguage, t } = useApp();
  const navigate = useNavigate();
  const { isSignedIn } = useUser(); // 👈 Check login state

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
      
      {/* Adjusted padding for mobile */}
      <nav className="container mx-auto px-4 py-3 md:px-6 md:py-4 relative">
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <motion.button 
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 md:gap-3 group relative shrink-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full group-hover:bg-accent/30 transition-all duration-300" />
              <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg shadow-accent/30">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            
            <div className="flex flex-col items-start">
              {/* Responsive Text Size */}
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                VoiceGuard
              </span>
              <span className="text-[10px] text-muted-foreground/60 font-medium tracking-wider uppercase hidden xs:block">
                Safety First
              </span>
            </div>
          </motion.button>

          {/* Controls Section */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* 1. Mode Toggle - HIDDEN ON MOBILE (Requested Change) */}
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="hidden md:block" 
            >
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
                      <span>{t('calm_mode')}</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4" />
                      <span>{t('impact_mode')}</span>
                    </>
                  )}
                </span>
              </Button>
            </motion.div>
            
            {/* 2. Language Selector - Hidden on Mobile */}
            <div className="relative group hidden md:block">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="h-10 pl-10 pr-8 rounded-xl border border-white/10 bg-card/50 backdrop-blur-md text-foreground text-sm font-medium transition-all duration-300 hover:border-accent/40 hover:bg-accent/5 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent shadow-lg hover:shadow-accent/20 cursor-pointer appearance-none"
              >
                {languageOptions.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-card text-foreground">
                    {opt.flag} {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. CLERK AUTH BUTTONS */}
            <div className="flex items-center">
                {!isSignedIn && (
                    <SignInButton mode="modal">
                        {/* Smaller button on mobile */}
                        <Button variant="outline" className="rounded-xl border-white/10 hover:bg-accent/10 h-9 px-3 text-xs md:h-10 md:px-4 md:text-sm">
                            Sign In
                        </Button>
                    </SignInButton>
                )}
                {isSignedIn && (
                    <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "w-8 h-8 md:w-10 md:h-10 border-2 border-accent shadow-glow"
                            }
                        }}
                    />
                )}
            </div>
            
            {/* 4. Quick Exit Button - VISIBLE ON PHONE */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                onClick={handleQuickExit}
                className="relative h-9 px-3 md:h-10 md:px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 border-0 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-1 md:gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {/* Text is now visible on phone (text-xs) but smaller */}
                  <span className="text-xs md:text-sm whitespace-nowrap">{t('quick_exit')}</span>
                </span>
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