import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { mode, toggleMode, language, setLanguage, t } = useApp();
  const navigate = useNavigate();

  const handleQuickExit = () => {
    window.location.replace('https://www.google.com');
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <svg className="w-48 h-10" viewBox="0 0 200 40">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: 'hsl(var(--foreground))', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <text x="10" y="28" className="text-2xl font-bold" fill="url(#logoGrad)">
                VoiceGuard
              </text>
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMode}
              className="transition-smooth"
            >
              {mode === 'impact' ? t('calm_mode') : t('impact_mode')}
            </Button>
            
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="h-9 px-3 rounded-md border border-border bg-transparent text-foreground text-sm transition-smooth hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="en">EN</option>
              <option value="hi">हिं</option>
              <option value="bn">বাংলা</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
              <option value="mr">मराठी</option>
            </select>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={handleQuickExit}
              className="transition-smooth"
            >
              {t('quick_exit')}
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
