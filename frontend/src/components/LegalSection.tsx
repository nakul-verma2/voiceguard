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
  const [formData, setFormData] = useState({ name: '', date: '', desc: '' });
  const [generatedDraft, setGeneratedDraft] = useState('');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const draft = `To,\nThe Station House Officer,\n[Police Station Name]\n\nSubject: Complaint under Section 498A IPC\n\nI, ${formData.name}, resident of [Address]...\n\nIncident Date: ${formData.date}\nDetails: ${formData.desc}`;
    setGeneratedDraft(draft);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDraft);
    toast({ title: "Copied!", description: "Draft copied to clipboard." });
  };

  return (
    <section className="py-20 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{t('legal_title')}</h2>
          <p className="text-muted-foreground">{t('legal_intro')}</p>
          <div className="w-16 h-1 bg-destructive mx-auto mt-4 rounded-full"></div>
        </div>

        <Tabs defaultValue="fir" className="max-w-5xl mx-auto">
          <TabsList className="flex flex-wrap justify-center bg-transparent gap-4 mb-8">
            {['fir', 'dv', 'ipc', 'protection'].map((val) => (
              <TabsTrigger
                key={val}
                value={val}
                className="px-6 py-2 rounded-md text-muted-foreground data-[state=active]:bg-destructive data-[state=active]:text-white transition-colors border border-transparent hover:border-destructive/50"
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
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <FileText className="text-destructive" />
                  {t('fir_tab')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-muted-foreground">{t('fir_desc')}</p>
                <div className="bg-muted/30 p-6 rounded-lg border border-border">
                  <form onSubmit={handleGenerate} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('name_label')}</Label>
                        <Input 
                          id="name" 
                          className="bg-background/50 border-input focus:border-destructive"
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">{t('date_label')}</Label>
                        <Input 
                          id="date" 
                          type="date" 
                          className="bg-background/50 border-input focus:border-destructive"
                          onChange={e => setFormData({...formData, date: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="desc">{t('desc_label')}</Label>
                      <Textarea 
                        id="desc" 
                        rows={4} 
                        className="bg-background/50 border-input focus:border-destructive"
                        onChange={e => setFormData({...formData, desc: e.target.value})}
                      />
                    </div>
                    <Button type="submit" className="bg-destructive hover:bg-destructive/90 text-white">
                      {t('generate_complaint')}
                    </Button>
                  </form>
                  
                  {generatedDraft && (
                    <div className="mt-6 relative bg-black/40 p-4 rounded border border-border">
                      <pre className="whitespace-pre-wrap text-sm font-mono text-foreground/90">{generatedDraft}</pre>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="absolute top-2 right-2" 
                        onClick={copyToClipboard}
                      >
                        <Copy className="w-4 h-4 mr-2"/> {t('copy_text')}
                      </Button>
                    </div>
                  )}
                </div>
                <div className="mt-6 p-4 border border-yellow-500/50 bg-yellow-500/10 rounded-lg text-yellow-200/90 text-sm">
                  <strong>{t('legal_disclaimer')}</strong> {t('disclaimer_text')}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DV Act 2005 - Matches image_630303.png & image_63f326.png */}
          <TabsContent value="dv">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Shield className="text-destructive" />
                  {t('dv_act_title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 text-lg">{t('dv_act_desc')}</p>
                <ul className="space-y-3 text-foreground/90">
                  {[1, 2, 3, 4].map((n) => (
                    <li key={n} className="flex items-start gap-3">
                      <span className="text-destructive font-bold text-xl leading-none">•</span>
                      <span>{t(`dv_act_point${n}`)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 498A IPC - Matches image_6302e4.png & image_63f609.png */}
          <TabsContent value="ipc">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Gavel className="text-destructive" />
                  {t('ipc_title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-muted-foreground text-lg">
                  <p>{t('ipc_desc')}</p>
                  <p>Police can register FIR and arrest without a warrant.</p>
                  <p>Bail is not a right, only granted by court's discretion.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Protection Orders - Matches image_6302c2.png & image_63f629.png */}
          <TabsContent value="protection">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Scale className="text-destructive" />
                  {t('protection_title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-muted-foreground text-lg">
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