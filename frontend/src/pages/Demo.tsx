import { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, UserPlus, Upload, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Demo = () => {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const handleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? 'Recording Stopped' : 'Recording Started',
      description: isRecording ? 'Audio recording has been stopped' : 'Background audio monitoring active',
    });
  };

  const handleEmergency = () => {
    toast({
      title: 'Emergency SOS Activated',
      description: 'Notifying trusted contacts and emergency services',
      variant: 'destructive',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Live Protection Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Real-time monitoring and safety management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Voice Recorder */}
            <Card className="border-border hover:border-accent transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Voice Recorder
                </CardTitle>
                <CardDescription>
                  Background audio monitoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleRecording}
                  className={`w-full ${isRecording ? 'bg-destructive hover:bg-destructive/90' : ''}`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      Start Recording
                    </>
                  )}
                </Button>
                {isRecording && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                    Recording in progress...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trusted Contacts */}
            <Card className="border-border hover:border-accent transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Trusted Contacts
                </CardTitle>
                <CardDescription>
                  Emergency contact management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
              </CardContent>
            </Card>

            {/* Evidence Locker */}
            <Card className="border-border hover:border-accent transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Evidence Locker
                </CardTitle>
                <CardDescription>
                  Secure evidence storage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Evidence
                </Button>
              </CardContent>
            </Card>

            {/* Emergency SOS */}
            <Card className="border-border hover:border-accent transition-all md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Emergency SOS
                </CardTitle>
                <CardDescription>
                  Immediate help activation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleEmergency}
                  variant="destructive"
                  className="w-full shadow-glow"
                  size="lg"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Activate Emergency SOS
                </Button>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  This will notify your trusted contacts and local emergency services
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Demo;
