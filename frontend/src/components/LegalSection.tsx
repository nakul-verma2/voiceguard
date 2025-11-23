import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText, Copy, Shield, Gavel, Scale } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LegalSection = () => {
  const { t } = useApp();
  const { toast } = useToast();
  
  // 1. Expanded Form State for a better draft
  const [formData, setFormData] = useState({ 
    name: '', 
    address: '',
    phone: '',
    stationName: '',
    accusedName: '',
    date: '', 
    place: '',
    desc: '' 
  });
  const [generatedDraft, setGeneratedDraft] = useState('');

  // 2. Improved FIR Generation Logic
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const currentDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const draft = `Date: ${currentDate}

To,
The Station House Officer (SHO),
${formData.stationName || '[Police Station Name]'},
[City/District Name]

Subject: Complaint regarding domestic violence/harassment against ${formData.accusedName || '[Accused Name]'}

Respected Sir/Madam,

I, ${formData.name || '[Your Name]'}, currently residing at ${formData.address || '[Your Address]'}, wish to lodge a formal complaint regarding an incident of harassment/domestic violence.

Details of the incident are as follows:
- Date of Incident: ${formData.date || '[Date]'}
- Place of Incident: ${formData.place || '[Location]'}
- Name(s) of Accused: ${formData.accusedName || '[Name]'}

Description of the Incident:
${formData.desc || '[Please describe exactly what happened here...]'}

I request you to kindly register my complaint (FIR) under the relevant sections of the law (such as Section 498A IPC / DV Act) and take necessary legal action against the accused named above. I also request you to ensure my safety and protection from further harm.

Detailed particulars of the accused:
Name: ${formData.accusedName}
Address: [Accused Address if known]

Thanking you,

Yours faithfully,

${formData.name}
Phone: ${formData.phone || '[Your Phone Number]'}
Address: ${formData.address}`;

    setGeneratedDraft(draft);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDraft);
    toast({ title: "Copied!", description: "Draft copied to clipboard." });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-12 md:py-20 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('legal_title')}</h2>
          <p className="text-muted-foreground text-sm md:text-base">{t('legal_intro')}</p>
          <div className="w-16 h-1 bg-destructive mx-auto mt-4 rounded-full"></div>
        </div>

        <Tabs defaultValue="fir" className="max-w-5xl mx-auto">
          {/* Mobile: Vertical Stack / Desktop: Horizontal Row */}
          <TabsList className="flex flex-col h-auto w-full md:flex-row md:flex-wrap md:justify-center bg-transparent gap-2 md:gap-4 mb-8">
            {['fir', 'dv', 'ipc', 'protection'].map((val) => (
              <TabsTrigger
                key={val}
                value={val}
                className="w-full md:w-auto px-6 py-3 md:py-2 rounded-md text-muted-foreground data-[state=active]:bg-destructive data-[state=active]:text-white transition-colors border border-transparent hover:border-destructive/50"
              >
                {val === 'fir' && t('fir_tab')}
                {val === 'dv' && t('dv_act_tab')}
                {val === 'ipc' && t('ipc_tab')}
                {val === 'protection' && t('protection_tab')}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Police Complaint (FIR) */}
          <TabsContent value="fir">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                  <FileText className="text-destructive shrink-0" />
                  {t('fir_tab')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-muted-foreground text-sm md:text-base">{t('fir_desc')}</p>
                <div className="bg-muted/30 p-4 md:p-6 rounded-lg border border-border">
                  
                  <form onSubmit={handleGenerate} className="space-y-4">
                    
                    {/* Personal Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('name_label')}</Label>
                        <Input 
                          id="name" 
                          placeholder="Your full name"
                          className="bg-background/50 border-input focus:border-destructive w-full"
                          onChange={e => handleInputChange('name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          placeholder="To contact you"
                          className="bg-background/50 border-input focus:border-destructive w-full"
                          onChange={e => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                       <Label htmlFor="address">Your Address</Label>
                       <Input 
                          id="address" 
                          placeholder="Your current residence address"
                          className="bg-background/50 border-input focus:border-destructive w-full"
                          onChange={e => handleInputChange('address', e.target.value)}
                        />
                    </div>

                    {/* Incident Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="station">Police Station Name</Label>
                        <Input 
                          id="station" 
                          placeholder="e.g. Cyber Cell, New Delhi"
                          className="bg-background/50 border-input focus:border-destructive w-full"
                          onChange={e => handleInputChange('stationName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accused">Accused Name</Label>
                        <Input 
                          id="accused" 
                          placeholder="Person you are complaining against"
                          className="bg-background/50 border-input focus:border-destructive w-full"
                          onChange={e => handleInputChange('accusedName', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">{t('date_label')}</Label>
                        <Input 
                          id="date" 
                          type="date" 
                          className="bg-background/50 border-input focus:border-destructive w-full"
                          onChange={e => handleInputChange('date', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="place">Place of Incident</Label>
                        <Input 
                          id="place" 
                          placeholder="Where did it happen?"
                          className="bg-background/50 border-input focus:border-destructive w-full"
                          onChange={e => handleInputChange('place', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="desc">{t('desc_label')}</Label>
                      <Textarea 
                        id="desc" 
                        rows={4} 
                        placeholder="Describe the incident in detail..."
                        className="bg-background/50 border-input focus:border-destructive w-full"
                        onChange={e => handleInputChange('desc', e.target.value)}
                      />
                    </div>

                    <Button type="submit" className="w-full md:w-auto bg-destructive hover:bg-destructive/90 text-white">
                      {t('generate_complaint')}
                    </Button>
                  </form>
                  
                  {generatedDraft && (
                    <div className="mt-6 relative bg-black/40 p-4 rounded border border-border">
                      <div className="absolute top-2 right-2">
                         <Button 
                          size="sm" 
                          variant="secondary" 
                          onClick={copyToClipboard}
                        >
                          <Copy className="w-4 h-4 md:mr-2"/> <span className="hidden md:inline">{t('copy_text')}</span>
                        </Button>
                      </div>
                      <pre className="whitespace-pre-wrap text-xs md:text-sm font-mono text-foreground/90 overflow-x-auto pt-8 md:pt-0">
                        {generatedDraft}
                      </pre>
                    </div>
                  )}
                </div>
                <div className="mt-6 p-4 border border-yellow-500/50 bg-yellow-500/10 rounded-lg text-yellow-200/90 text-xs md:text-sm">
                  <strong>{t('legal_disclaimer')}</strong> {t('disclaimer_text')}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DV Act 2005 */}
          <TabsContent value="dv">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                  <Shield className="text-destructive shrink-0" />
                  {t('dv_act_title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 text-base md:text-lg">{t('dv_act_desc')}</p>
                <ul className="space-y-3 text-foreground/90 text-sm md:text-base">
                  {[1, 2, 3, 4].map((n) => (
                    <li key={n} className="flex items-start gap-3">
                      <span className="text-destructive font-bold text-xl leading-none mt-1">•</span>
                      <span>{t(`dv_act_point${n}`)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 498A IPC */}
          <TabsContent value="ipc">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                  <Gavel className="text-destructive shrink-0" />
                  {t('ipc_title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-muted-foreground text-base md:text-lg">
                  <p>{t('ipc_desc')}</p>
                  <p>Police can register FIR and arrest without a warrant.</p>
                  <p>Bail is not a right, only granted by court's discretion.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Protection Orders */}
          <TabsContent value="protection">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                  <Scale className="text-destructive shrink-0" />
                  {t('protection_title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-muted-foreground text-base md:text-lg">
                  <p>{t('protection_desc')}</p>
                  <p>Abuser can be legally ordered not to enter the victim's residence, workplace, or places she frequently visits.</p>
                  <p>Abuser may be barred from calling, messaging, stalking, or approaching the victim.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default LegalSection;