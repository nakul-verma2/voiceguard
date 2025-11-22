import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sendChatMessage } from '@/lib/apiService';

const Chatbot = () => {
  const { t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  // Load initial greeting
  useEffect(() => {
    setMessages([{ text: t('chatbot_greeting'), isBot: true }]);
  }, [t]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue;
    const newMessages = [...messages, { text: userMessage, isBot: false }];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const botResponse = await sendChatMessage(userMessage);

      setMessages((prev) => [
        ...prev,
        { text: botResponse, isBot: true },
      ]);
    } catch (error) {
      console.error('Chatbot Error:', error);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, I couldn't connect to the safety AI. Please try again.", isBot: true },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] max-w-[90vw] h-[450px] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in">

          {/* Header */}
          <div className="bg-accent p-4 flex justify-between items-center">
            <h3 className="font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              {t('chatbot_title')}
            </h3>
            <Button 
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 bg-background/50">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      msg.isBot
                        ? 'bg-secondary text-secondary-foreground rounded-tl-none'
                        : 'bg-accent text-accent-foreground rounded-tr-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="p-4 rounded-lg bg-secondary text-secondary-foreground rounded-tl-none flex items-center space-x-1 h-10">
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"></div>
                  </div>
                </div>
              )}

              <div ref={scrollEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t border-border bg-card flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chatbot_placeholder')}
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              size="icon"
              onClick={handleSend}
              className="bg-accent hover:bg-accent/90"
              disabled={isTyping || !inputValue.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full shadow-glow transition-transform duration-300 ${
          isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100'
        }`}
        size="icon"
      >
        <MessageCircle className="w-7 h-7" />
      </Button>

      {/* Close Overlay Button */}
      {isOpen && (
        <Button
          onClick={() => setIsOpen(false)}
          className="h-14 w-14 rounded-full shadow-lg absolute bottom-0 right-0 bg-destructive hover:bg-destructive/90"
          size="icon"
        >
          <X className="w-7 h-7" />
        </Button>
      )}
    </div>
  );
};

export default Chatbot;
