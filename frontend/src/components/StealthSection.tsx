import { useApp } from '@/contexts/AppContext';
import { EyeOff, History, Lock, Smartphone, ShieldAlert } from 'lucide-react';

const StealthSection = () => {
  const { t } = useApp();

  return (
    <section className="py-16 md:py-24 bg-black relative border-t border-border">
      <div className="container mx-auto px-4 text-center">
        
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 mb-6">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('stealth_title')}</h2>
          <p className="text-muted-foreground text-base md:text-lg mb-4">{t('stealth_subtitle')}</p>
          <div className="w-16 h-1 bg-destructive mx-auto rounded-full"></div>
        </div>

        {/* Privacy Protection List */}
        <div className="mb-12 md:mb-16">
          <h3 className="text-xl md:text-2xl font-semibold text-white mb-8">{t('stealth_features_title')}</h3>
          <ul className="inline-block text-left space-y-4 text-muted-foreground text-sm md:text-base">
            {[1, 2, 3, 4, 5].map((n) => (
              <li key={n} className="flex items-start md:items-center gap-3">
                <span className="text-destructive text-xl shrink-0">✓</span>
                <span>{t(`feature${n}`)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: EyeOff, title: t('feature_fake') },
            { icon: History, title: t('feature_hist') },
            { icon: Lock, title: t('feature_vpn') },
            { icon: Smartphone, title: t('feature_cam') },
          ].map((item, i) => (
            <div key={i} className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 text-left group hover:border-destructive/50 transition-all">
              <div className="mb-6">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <h4 className="text-white font-semibold text-lg mb-4">{item.title}</h4>
              <div className="w-8 h-1 bg-destructive rounded-full group-hover:w-16 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StealthSection;