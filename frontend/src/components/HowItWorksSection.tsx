import { useApp } from '@/contexts/AppContext';
import { Mic, Brain, Shield, PhoneCall } from 'lucide-react';

const HowItWorksSection = () => {
  const { t } = useApp();

  const steps = [
    {
      icon: Mic,
      title: t('step1_title'),
      description: t('step1_desc'),
    },
    {
      icon: Brain,
      title: t('step2_title'),
      description: t('step2_desc'),
    },
    {
      icon: Shield,
      title: t('step3_title'),
      description: t('step3_desc'),
    },
    {
      icon: PhoneCall,
      title: t('step4_title'),
      description: t('step4_desc'),
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          {t('how_title')}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:border-accent transition-all hover:shadow-glow group"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6 group-hover:bg-accent/20 transition-colors">
                <step.icon className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-accent">
                {index + 1}. {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
