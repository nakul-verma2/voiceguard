import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const ContentWarningModal = () => {
  const [open, setOpen] = useState(false);
  const { t } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const acknowledged = localStorage.getItem('voiceguard-warning-acknowledged');
    if (!acknowledged) {
      setOpen(true);
    }
  }, []);

  const handleProceed = () => {
    localStorage.setItem('voiceguard-warning-acknowledged', 'true');
    setOpen(false);
  };

  const handleResourcesOnly = () => {
    localStorage.setItem('voiceguard-warning-acknowledged', 'true');
    setOpen(false);
    navigate('/resources');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-destructive/10 p-3 rounded-full">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <DialogTitle className="text-center">{t('warning_title')}</DialogTitle>
          <DialogDescription className="text-center space-y-3">
            <p>{t('warning_text')}</p>
            <p className="font-bold text-destructive">{t('warning_emergency')}</p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleResourcesOnly} className="w-full sm:w-auto">
            {t('resources_only')}
          </Button>
          <Button onClick={handleProceed} className="w-full sm:w-auto">
            {t('proceed')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentWarningModal;
