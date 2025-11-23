import { useApp } from '@/contexts/AppContext';
import { useEffect, useRef, useState } from 'react';

const StatsSection = () => {
  const { t } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: 31, label: t('stat1'), source: 'National Family Health Survey, 2019-21' },
    { value: 86, label: t('stat2'), source: 'UN Women India, 2023' },
    { value: 19, label: t('stat3'), source: 'National Crime Records Bureau, 2022' },
  ];

  return (
    <section ref={sectionRef} className="py-12 md:py-20 bg-card/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl md:text-5xl font-bold text-center mb-10 md:mb-16">
          {t('stats_title')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 md:p-8 text-center hover:border-accent transition-all hover:shadow-glow"
            >
              <div className="text-5xl md:text-6xl font-bold text-accent mb-4">
                {isVisible ? <CountUp end={stat.value} /> : '0'}
                {index < 2 && '%'}
              </div>
              <p className="text-base md:text-lg mb-2">{stat.label}</p>
              <p className="text-xs md:text-sm text-muted-foreground">{stat.source}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CountUp = ({ end }: { end: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [end]);

  return <span>{count}</span>;
};

export default StatsSection;