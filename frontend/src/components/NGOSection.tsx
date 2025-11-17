import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone } from 'lucide-react';

const NGOSection = () => {
  const { t } = useApp();

  const ngos = [
    { name: "Women's Rights Initiative", city: "Delhi", type: "Legal", phone: "+91-11-2345-6789", hours: "24/7 Helpline", service: "Legal Aid, Counseling" },
    { name: "Safe Haven Shelter", city: "Mumbai", type: "Shelter", phone: "+91-22-9876-5432", hours: "24/7 Emergency", service: "Temporary Shelter, Medical Aid" },
    { name: "Healing Hearts Counseling", city: "Bangalore", type: "Counseling", phone: "+91-80-1111-2222", hours: "Mon-Fri 9AM-6PM", service: "Psychological Support" },
    { name: "Legal Aid Society", city: "Delhi", type: "Legal", phone: "+91-11-3333-4444", hours: "Mon-Sat 10AM-5PM", service: "Free Legal Consultation" },
    { name: "Women's Crisis Center", city: "Mumbai", type: "Counseling", phone: "+91-22-5555-6666", hours: "24/7 Crisis Line", service: "Crisis Intervention" },
    { name: "Phoenix Rising Shelter", city: "Bangalore", type: "Shelter", phone: "+91-80-7777-8888", hours: "24/7 Intake", service: "Long-term Housing" }
  ];

  return (
    <section className="py-20 bg-background text-foreground" id="ngos">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{t('ngos_title')}</h2>
          <div className="w-16 h-1 bg-destructive mx-auto rounded-full"></div>
        </div>

        {/* Emergency Numbers - Matches image_63f665.png */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <a href="tel:181" className="group block">
            <div className="bg-card border border-accent/30 hover:border-accent hover:-translate-y-1 transition-all duration-300 rounded-xl p-8 text-center">
              <span className="block text-5xl font-black text-destructive mb-2 group-hover:scale-110 transition-transform">181</span>
              <span className="text-xl font-semibold text-white">{t('womens_helpline')}</span>
            </div>
          </a>
          <a href="tel:112" className="group block">
            <div className="bg-destructive border border-destructive hover:-translate-y-1 transition-all duration-300 rounded-xl p-8 text-center">
              <span className="block text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform">112</span>
              <span className="text-xl font-semibold text-white">{t('emergency_services')}</span>
            </div>
          </a>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Select>
            <SelectTrigger className="bg-card border-border text-foreground">
              <SelectValue placeholder={t('all_cities')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all_cities')}</SelectItem>
              <SelectItem value="delhi">Delhi</SelectItem>
              <SelectItem value="mumbai">Mumbai</SelectItem>
              <SelectItem value="bangalore">Bangalore</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="bg-card border-border text-foreground">
              <SelectValue placeholder={t('all_types')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all_types')}</SelectItem>
              <SelectItem value="legal">{t('legal')}</SelectItem>
              <SelectItem value="shelter">{t('shelter')}</SelectItem>
              <SelectItem value="counseling">{t('counseling')}</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-white">
            {t('stealth_tips')}
          </Button>
        </div>

        {/* NGO Grid - Matches image_63f6a2.png */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ngos.map((ngo, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 hover:border-destructive/50 transition-all hover:shadow-lg flex flex-col h-full">
              <h4 className="text-xl font-bold text-white mb-4">{ngo.name}</h4>
              <div className="space-y-2 text-sm text-muted-foreground mb-6 flex-grow">
                <p><strong className="text-foreground">City:</strong> {ngo.city}</p>
                <p><strong className="text-foreground">Type:</strong> {ngo.type}</p>
                <p><strong className="text-foreground">Phone:</strong> <span className="text-accent">{ngo.phone}</span></p>
                <p><strong className="text-foreground">Hours:</strong> {ngo.hours}</p>
                <p><strong className="text-foreground">Services:</strong> {ngo.service}</p>
              </div>
              <Button className="w-full bg-destructive hover:bg-destructive/90 text-white" onClick={() => window.location.href = `tel:${ngo.phone}`}>
                {t('call_now') || "Call Now"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NGOSection;