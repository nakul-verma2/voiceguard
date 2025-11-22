import { useState, useRef, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendChatMessage } from "@/lib/apiService";

const Chatbot = () => {
  const { t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { text: string; isBot: boolean }[]
  >([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  // Load greeting
  useEffect(() => {
    setMessages([{ text: t("chatbot_greeting"), isBot: true }]);
  }, [t]);

  // Auto scroll
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue;
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setInputValue("");
    setIsTyping(true);

    try {
      const botResponse = await sendChatMessage(userMessage);

      setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I couldn't connect to the safety AI. Please try again.",
          isBot: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] max-w-[90vw] h-[470px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10">

          {/* Header */}
          <div className="bg-accent p-4 flex justify-between items-center">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              {t("chatbot_title")}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 bg-background/40">
            <div className="space-y-4">

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-xl text-sm leading-relaxed shadow-sm ${
                      msg.isBot
                        ? "bg-secondary text-secondary-foreground rounded-tl-none"
                        : "bg-accent text-accent-foreground rounded-tr-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-secondary-foreground px-4 py-3 rounded-xl rounded-tl-none flex gap-1 shadow-sm">
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={scrollEndRef} />
            </div>
          </ScrollArea>

          {/* Input Row */}
          <div className="p-3 border-t border-border bg-card flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={t("chatbot_placeholder")}
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              size="icon"
              disabled={!inputValue.trim() || isTyping}
              onClick={handleSend}
              className="bg-accent hover:bg-accent/90"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Open Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={`h-14 w-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? "scale-0 opacity-0 rotate-90" : "scale-100 opacity-100"
        }`}
      >
        <MessageCircle className="w-7 h-7" />
      </Button>

      {/* Close Floating Button */}
      {isOpen && (
        <Button
          onClick={() => setIsOpen(false)}
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg absolute bottom-0 right-0 bg-destructive hover:bg-destructive/90"
        >
          <X className="w-7 h-7" />
        </Button>
      )}
    </div>
  );
};

export default Chatbot;
