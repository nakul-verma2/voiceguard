import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Mode = 'impact' | 'calm';
type Language = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr';

interface AppContextType {
  mode: Mode;
  toggleMode: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<Mode>(() => {
    return (localStorage.getItem('voiceguard-mode') as Mode) || 'impact';
  });
  
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('voiceguard-lang') as Language) || 'en';
  });
  
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-mode', mode);
    localStorage.setItem('voiceguard-mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('voiceguard-lang', language);
  }, [language]);

  useEffect(() => {
    if (reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, [reducedMotion]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const toggleMode = () => {
    setMode(prev => prev === 'impact' ? 'calm' : 'impact');
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleReducedMotion = () => {
    setReducedMotion(prev => !prev);
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const value: AppContextType = {
    mode,
    toggleMode,
    language,
    setLanguage,
    t,
    reducedMotion,
    toggleReducedMotion,
    highContrast,
    toggleHighContrast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    calm_mode: "Calm",
    impact_mode: "Impact",
    warning_title: "Content Warning",
    warning_text: "This website contains content related to domestic violence and abuse. The content may be disturbing and triggering for some users.",
    warning_emergency: "If you are in immediate danger, call emergency services: 112",
    resources_only: "View Resources Only",
    proceed: "Proceed",
    hero_title: "Hear the Silence. Break the Cycle.",
    hero_subtitle: "AI-powered detection system that identifies domestic violence through voice patterns and connects victims to immediate help.",
    try_demo: "Try Live Demo",
    get_help: "Get Help Now",
    stats_title: "The Hidden Crisis",
    stat1: "% of women in India face domestic violence",
    stat2: "% of cases go unreported",
    stat3: "women killed daily due to domestic violence",
    how_title: "How VoiceGuard Works",
    step1_title: "Audio Capture",
    step1_desc: "Real-time background audio monitoring with privacy-first encryption",
    step2_title: "AI Detection",
    step2_desc: "Advanced ML models detect distress patterns, threats, and violence indicators",
    step3_title: "Smart Response",
    step3_desc: "Contextual escalation based on threat level and user safety",
    step4_title: "Immediate Help",
    step4_desc: "Connect to local authorities, NGOs, and support networks instantly",
    legal_title: "Legal Guidance (India)",
    fir_tab: "Police Complaint (FIR)",
    dv_act_tab: "DV Act 2005",
    ipc_tab: "498A IPC",
    protection_tab: "Protection Orders",
    ngos_title: "Help & Support Directory",
    resources_title: "Resources & Support",
    stealth_title: "Stealth Safety Tips",
    chatbot_title: "Asha - Support Assistant",
    chatbot_greeting: "Hello! I'm Asha, your support assistant. How can I help you today?",
    quick_exit: "Quick Exit",
    emergency_services: "Emergency Services",
    womens_helpline: "Women's Helpline",
  },
  hi: {
    calm_mode: "शांत",
    impact_mode: "प्रभाव",
    warning_title: "सामग्री चेतावनी",
    warning_text: "इस वेबसाइट में घरेलू हिंसा और दुर्व्यवहार से संबंधित सामग्री है। यह सामग्री कुछ उपयोगकर्ताओं के लिए परेशान करने वाली हो सकती है।",
    warning_emergency: "यदि आप तत्काल खतरे में हैं, तो आपातकालीन सेवाओं को कॉल करें: 112",
    resources_only: "केवल संसाधन देखें",
    proceed: "आगे बढ़ें",
    hero_title: "मौन सुनें। चक्र तोड़ें।",
    hero_subtitle: "AI-संचालित पहचान प्रणाली जो आवाज पैटर्न के माध्यम से घरेलू हिंसा की पहचान करती है और पीड़ितों को तत्काल मदद से जोड़ती है।",
    try_demo: "लाइव डेमो आज़माएं",
    get_help: "अभी मदद लें",
    stats_title: "छिपा हुआ संकट",
    quick_exit: "त्वरित बाहर निकलें",
  },
  bn: {
    calm_mode: "শান্ত",
    impact_mode: "প্রভাব",
    warning_title: "বিষয়বস্তু সতর্কতা",
    hero_title: "নীরবতা শুনুন। চক্র ভাঙুন।",
    quick_exit: "দ্রুত প্রস্থান",
  },
  ta: {
    calm_mode: "அமைதி",
    impact_mode: "தாக்கம்",
    warning_title: "உள்ளடக்க எச்சரிக்கை",
    hero_title: "மௌனத்தைக் கேளுங்கள். சுழற்சியை உடைக்கவும்.",
    quick_exit: "விரைவு வெளியேறு",
  },
  te: {
    calm_mode: "ప్రశాంతత",
    impact_mode: "ప్రభావం",
    warning_title: "కంటెంట్ హెచ్చరిక",
    hero_title: "నిశ్శబ్దం వినండి. చక్రాన్ని విచ్ఛిన్నం చేయండి.",
    quick_exit: "త్వరిత నిష్క్రమణ",
  },
  mr: {
    calm_mode: "शांत",
    impact_mode: "प्रभाव",
    warning_title: "सामग्री चेतावणी",
    hero_title: "शांतता ऐका. चक्र तोडा.",
    quick_exit: "द्रुत बाहेर पडणे",
  },
};
