import { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, UserPlus, Upload, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from "@clerk/clerk-react"; // 👈 Import Clerk hook
import { 
  startMonitoring, 
  stopMonitoring, 
  activateSOS, 
  uploadEvidence,
  addTrustedContact 
} from '@/lib/apiService';

const Demo = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contactNumber, setContactNumber] = useState('');
  const { toast } = useToast();
  const { user } = useUser(); // 👈 Get current user details

  // --- Recording Handler ---
  const handleRecording = async () => {
    if (isLoading || !user) return; // 👈 Check for user

    setIsLoading(true);
    try {
      if (isRecording) {
        await stopMonitoring(); 
        toast({
          title: 'Recording Stopped',
          description: 'Audio monitoring has been safely shut down.',
        });
      } else {
        await startMonitoring(user.id); // 👈 Pass user.id
        toast({
          title: 'Recording Started',
          description: 'Background audio monitoring is now active.',
        });
      }
      setIsRecording(!isRecording);
    } catch (error: any) {
      console.error('Monitoring Error:', error);
      toast({
        title: 'Action Failed',
        description: `Could not complete monitoring action: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Emergency Handler ---
  const handleEmergency = async () => {
    if (isLoading || !user) return;

    setIsLoading(true);
    try {
      await activateSOS(user.id);  // 👈 Pass user.id
      toast({
        title: 'Emergency SOS Activated',
        description: 'Notifying trusted contacts and emergency services.',
        variant: 'destructive',
      });
    } catch (error: any) {
      console.error('SOS Error:', error);
      toast({
        title: 'SOS Failed',
        description: `Could not activate SOS: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // --- File Upload Handler ---
  const handleUploadChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !user) return;

    setIsLoading(true);
    try {
      // 👈 Pass user.id to upload function
      const result = await uploadEvidence(user.id, files); 
      toast({
        title: 'Upload Successful',
        description: `Successfully uploaded ${result.successful_files.length} file(s) to the Evidence Locker.`,
      });
    } catch (error: any) {
      console.error('Upload Error:', error);
      toast({
        title: 'Upload Failed',
        description: `Error uploading evidence: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };

  // --- Add Contact Handler ---
  const handleAddContact = async () => {
    if (!contactNumber.trim()) {
      toast({
        title: "Input Error",
        description: "Please enter a valid phone number.",
        variant: "destructive"
      });
      return;
    }
    if (!user) return;

    setIsLoading(true); 

    try {
      // 👈 Pass user.id
      await addTrustedContact(user.id, contactNumber);

      toast({
        title: "Contact Added",
        description: `${contactNumber} has been added to your trusted circle.`,
      });
      setContactNumber(''); 
    } catch (error: any) {
        console.error("Add Contact Error:", error);
        toast({
            title: "Error",
            description: "Failed to save contact. Please try again.",
            variant: "destructive"
        });
    } finally {
        setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Voice Recorder */}
            <Card className="border-border hover:border-accent transition-all">
              <CardHeader>
                <CardTitle>Audio Monitor</CardTitle>
                <CardDescription>Record background audio securely.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleRecording}
                  className={`w-full ${isRecording ? 'bg-destructive hover:bg-destructive/90' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : isRecording ? (
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
              </CardContent>
            </Card>

            {/* Trusted Contacts */}
            <Card className="border-border hover:border-accent transition-all">
              <CardHeader>
                <CardTitle>Trusted Contacts</CardTitle>
                <CardDescription>Add numbers for emergency alerts.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input 
                    type="tel" 
                    placeholder="+1 (555) 000-0000" 
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    onClick={handleAddContact}
                    disabled={isLoading}
                    variant="secondary"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Alerts will be sent via SMS & WhatsApp.
                </p>
              </CardContent>
            </Card>

            {/* Evidence Locker */}
            <Card className="border-border hover:border-accent transition-all">
              <CardHeader>
                <CardTitle>Evidence Locker</CardTitle>
                <CardDescription>Securely store photos or documents.</CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  id="evidence-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleUploadChange}
                  disabled={isLoading}
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => document.getElementById('evidence-upload')?.click()}
                  disabled={isLoading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {isLoading ? 'Uploading...' : 'Upload Evidence'}
                </Button>
              </CardContent>
            </Card>

            {/* Emergency SOS */}
            <Card className="border-border hover:border-accent transition-all md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-destructive">Emergency Zone</CardTitle>
                <CardDescription>Immediate action required.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleEmergency}
                  variant="destructive"
                  className="w-full shadow-glow h-16 text-lg"
                  disabled={isLoading}
                >
                  <Phone className="mr-2 h-6 w-6" />
                  {isLoading ? 'Sending SOS...' : 'ACTIVATE EMERGENCY SOS'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Demo;