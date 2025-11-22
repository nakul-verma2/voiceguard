import { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
// 🌟 FIX: Re-adding the missing Card components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, UserPlus, Upload, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  startMonitoring, 
  stopMonitoring, 
  activateSOS, 
  uploadEvidence 
} from '@/lib/apiService'; // Ensure this is imported

const Demo = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 🌟 NEW: Loading state
  const { toast } = useToast();

  const handleRecording = async () => { // 🌟 Updated to async
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isRecording) {
        // --- STOP MONITORING API CALL ---
        await stopMonitoring(); 
        toast({
          title: 'Recording Stopped',
          description: 'Audio monitoring has been safely shut down.',
        });
      } else {
        // --- START MONITORING API CALL ---
        await startMonitoring();
        toast({
          title: 'Recording Started',
          description: 'Background audio monitoring is now active.',
        });
      }
      setIsRecording(!isRecording);
    } catch (error) {
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

  const handleEmergency = async () => { // 🌟 Updated to async
    if (isLoading) return;

    setIsLoading(true);
    try {
      // --- SOS API CALL ---
      await activateSOS(); 
      toast({
        title: 'Emergency SOS Activated',
        description: 'Notifying trusted contacts and emergency services.',
        variant: 'destructive',
      });
    } catch (error) {
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
  
  // 🌟 NEW: Function to handle file input change
  const handleUploadChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    try {
      const result = await uploadEvidence(files);
      toast({
        title: 'Upload Successful',
        description: `Successfully uploaded ${result.successful_files.length} file(s) to the Evidence Locker.`,
      });
    } catch (error) {
      console.error('Upload Error:', error);
      toast({
        title: 'Upload Failed',
        description: `Error uploading evidence: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      // Reset the file input field
      event.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* ... headings ... */}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Voice Recorder */}
            <Card className="border-border hover:border-accent transition-all">
              {/* ... CardHeader ... */}
              <CardContent className="space-y-4">
                <Button
                  onClick={handleRecording}
                  className={`w-full ${isRecording ? 'bg-destructive hover:bg-destructive/90' : ''}`}
                  disabled={isLoading} // 🌟 Disabled while loading
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
                {/* ... recording status indicator ... */}
              </CardContent>
            </Card>

            {/* Trusted Contacts - Will require a modal/sidebar component for input/update */}
            <Card className="border-border hover:border-accent transition-all">
              {/* ... CardHeader ... */}
              <CardContent>
                {/* 🌟 Placeholder for setting contacts. Should eventually open a form. */}
                <Button variant="outline" className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
              </CardContent>
            </Card>

            {/* Evidence Locker - Changed to use a hidden file input */}
            <Card className="border-border hover:border-accent transition-all">
              {/* ... CardHeader ... */}
              <CardContent>
                {/* 🌟 NEW: Hidden file input linked to the button */}
                <input
                  id="evidence-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleUploadChange}
                  disabled={isLoading} // 🌟 Disabled while loading
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
              {/* ... CardHeader ... */}
              <CardContent>
                <Button
                  onClick={handleEmergency}
                  variant="destructive"
                  className="w-full shadow-glow"
                  size="lg"
                  disabled={isLoading} // 🌟 Disabled while loading
                >
                  <Phone className="mr-2 h-5 w-5" />
                  {isLoading ? 'Sending SOS...' : 'Activate Emergency SOS'}
                </Button>
                {/* ... text ... */}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Demo;