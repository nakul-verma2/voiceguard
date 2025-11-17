import { useApp } from '@/contexts/AppContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

const FooterSection = () => {
  const { t, reducedMotion, toggleReducedMotion, highContrast, toggleHighContrast, setLanguage } = useApp();

  return (
    <>
      {/* Accessibility & Language - Matches image_63f702.png */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t('accessibility_title')}</h2>
            <div className="w-16 h-1 bg-destructive mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-20">
            {/* Controls */}
            <div className="space-y-8">
              <h3 className="text-xl font-semibold mb-6">{t('accessibility_controls_title')}</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="motion" className="text-foreground">{t('reduced_motion')}</Label>
                <Switch id="motion" checked={reducedMotion} onCheckedChange={toggleReducedMotion} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="contrast" className="text-foreground">{t('high_contrast')}</Label>
                <Switch id="contrast" checked={highContrast} onCheckedChange={toggleHighContrast} />
              </div>
              <div className="space-y-4">
                <Label className="text-foreground">{t('font_size')}</Label>
                <Slider defaultValue={[16]} max={24} min={14} step={1} className="w-full" />
              </div>
            </div>

            {/* Language Support */}
            <div>
              <h3 className="text-xl font-semibold mb-6">{t('language_support_title')}</h3>
              <p className="text-muted-foreground mb-4">{t('language_desc')}</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { code: 'hi', label: 'हिंदी' },
                  { code: 'en', label: 'English' },
                  { code: 'bn', label: 'বাংলা' },
                  { code: 'ta', label: 'தமிழ்' },
                  { code: 'te', label: 'తెలుగు' },
                  { code: 'mr', label: 'मराठी' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className="px-3 py-1 rounded-full bg-white/10 border border-white/10 hover:bg-destructive hover:border-destructive hover:text-white transition-all text-sm"
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Roadmap & Ethics - Matches image_63f702.png */}
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center md:text-left">
                {t('roadmap_title')}
                <div className="w-12 h-1 bg-destructive mt-2 mx-auto md:mx-0 rounded-full"></div>
              </h3>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {[1, 2, 3, 4, 5].map(n => (
                  <span key={n} className="px-3 py-1.5 rounded-full border border-accent/50 text-accent bg-accent/10 text-sm font-medium">
                    {t(`roadmap${n}`)}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6 text-center md:text-left">
                {t('ethics_title')}
                <div className="w-12 h-1 bg-destructive mt-2 mx-auto md:mx-0 rounded-full"></div>
              </h3>
              <p className="text-muted-foreground mb-4">{t('ethics_desc')}</p>
              <ul className="space-y-2">
                {[1, 2, 3, 4].map(n => (
                  <li key={n} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-destructive text-2xl leading-none">•</span>
                    {t(`ethics${n}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Site Footer - Matches image_63f9ad.png */}
      <footer className="bg-black py-8 border-t border-border text-muted-foreground text-sm">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <nav className="flex gap-6">
            <a href="#ngos" className="hover:text-destructive transition-colors">{t('footer_resources')}</a>
            <a href="#" className="hover:text-destructive transition-colors">{t('footer_terms')}</a>
            <a href="#" className="hover:text-destructive transition-colors">{t('footer_privacy')}</a>
            <a href="#" className="hover:text-destructive transition-colors">{t('footer_contact')}</a>
            <a href="#" className="hover:text-destructive transition-colors">{t('footer_github')}</a>
          </nav>
          <p>{t('footer_disclaimer')}</p>
        </div>
      </footer>
    </>
  );
};

export default FooterSection;