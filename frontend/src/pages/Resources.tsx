import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Shield, Heart, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Resources = () => {
  const helplines = [
    {
      name: "Women's Helpline",
      number: "1091",
      description: "24/7 support for women in distress",
      icon: Phone,
    },
    {
      name: "National Commission for Women",
      number: "7827-170-170",
      description: "Legal support and complaint registration",
      icon: Shield,
    },
    {
      name: "Emergency Services",
      number: "112",
      description: "Police, ambulance, and fire services",
      icon: AlertCircle,
    },
    {
      name: "Childline",
      number: "1098",
      description: "24-hour emergency service for children",
      icon: Heart,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Help & Support Resources</h1>
            <p className="text-muted-foreground text-lg">
              Immediate assistance is available 24/7
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {helplines.map((helpline, index) => (
              <Card key={index} className="border-border hover:border-accent transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <helpline.icon className="w-5 h-5 text-accent" />
                    {helpline.name}
                  </CardTitle>
                  <CardDescription>{helpline.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full shadow-glow"
                    onClick={() => window.location.href = `tel:${helpline.number}`}
                  >
                    Call {helpline.number}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-border bg-destructive/10">
            <CardHeader>
              <CardTitle className="text-destructive">Safety Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="flex items-start gap-2">
                <span className="text-destructive mt-1">•</span>
                Use incognito/private browsing mode when accessing support resources
              </p>
              <p className="flex items-start gap-2">
                <span className="text-destructive mt-1">•</span>
                Clear browser history and call logs regularly
              </p>
              <p className="flex items-start gap-2">
                <span className="text-destructive mt-1">•</span>
                Create code words with trusted friends and family
              </p>
              <p className="flex items-start gap-2">
                <span className="text-destructive mt-1">•</span>
                Keep important documents in a safe, accessible location
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Resources;
