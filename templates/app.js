// VoiceGuard Application JavaScript
class VoiceGuardApp {
    constructor() {
        this.currentMode = localStorage.getItem('voiceguard-mode') || 'impact';
        this.currentLang = localStorage.getItem('voiceguard-lang') || 'en';
        
        this.initializeApp();
        this.setupEventListeners();
        this.setupAccessibility();
        this.populateNGODirectory();
        
        // Show content warning on first visit
        if (!localStorage.getItem('voiceguard-warning-acknowledged')) {
            this.showContentWarning();
        }
    }

    // Internationalization object with multiple languages
    i18n = {
        en: {
            warning_title: "Content Warning",
            warning_text: "This website contains content related to domestic violence and abuse. The content may be disturbing and triggering for some users.",
            warning_emergency: "If you are in immediate danger, call emergency services: 112",
            resources_only: "View Resources Only",
            proceed: "Proceed",
            hero_title: "Hear the Silence. Break the Cycle.",
            hero_subtitle: "AI-powered detection system that identifies domestic violence through voice patterns and connects victims to immediate help.",
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
            fir_title: "File an FIR (First Information Report)",
            name_label: "Your Name",
            date_label: "Date of Incident",
            description_label: "Brief Description",
            generate_complaint: "Generate Complaint Draft",
            complaint_draft: "Complaint Draft",
            copy_text: "Copy Text",
            legal_disclaimer: "Disclaimer:",
            disclaimer_text: "This is not legal advice. Please consult with a qualified lawyer or NGO for personalized legal guidance.",
            dv_act_title: "Domestic Violence Act, 2005",
            dv_act_desc: "The Protection of Women from Domestic Violence Act, 2005 provides civil remedies for domestic violence survivors.",
            dv_act_point1: "Protection orders to prevent further violence",
            dv_act_point2: "Residence orders for shared household rights",
            dv_act_point3: "Monetary relief for maintenance and compensation",
            dv_act_point4: "Custody orders for children",
            ipc_title: "Section 498A IPC",
            ipc_desc: "Cruelty by husband or relatives of husband - imprisonment up to 3 years and fine.",
            protection_title: "Protection Orders",
            protection_desc: "Court orders that legally require the abuser to stop the abusive behavior.",
            ngos_title: "Help & Support Directory",
            womens_helpline: "Women's Helpline",
            emergency_services: "Emergency Services",
            all_cities: "All Cities",
            all_types: "All Services",
            legal: "Legal Aid",
            shelter: "Shelter",
            counseling: "Counseling",
            stealth_tips: "Stealth Safety Tips",
            stealth_section_title: "Stealth & Safety Features",
            stealth_features_title: "Privacy Protection",
            feature1: "Background detection (Android compatibility)",
            feature2: "Codeword activation system",
            feature3: "Disguised app (e.g., Weather)",
            feature4: "Quick exit with history clearing",
            feature5: "End-to-end data encryption",
            accessibility_title: "Accessibility & Language Support",
            accessibility_controls_title: "Accessibility Options",
            reduced_motion: "Reduce Motion",
            high_contrast: "High Contrast",
            font_size: "Font Size",
            language_support_title: "Language Support",
            language_desc: "VoiceGuard supports multiple Indian languages and dialects:",
            roadmap_title: "Development Roadmap",
            roadmap1: "On-device ML Models",
            roadmap2: "Regional Dialect Support",
            roadmap3: "NGO API Integration",
            roadmap4: "Security Audits",
            roadmap5: "iOS/Android Apps",
            ethics_title: "Ethics & Responsibility",
            ethics_desc: "We acknowledge the critical importance of accuracy in domestic violence detection systems.",
            ethics1: "Continuous testing for false positives/negatives",
            ethics2: "Informed consent and user agency",
            ethics3: "Data minimization and privacy-first design",
            ethics4: "Regular red-team security testing",
            footer_resources: "Resources",
            footer_terms: "Terms",
            footer_privacy: "Privacy",
            footer_contact: "Contact",
            footer_github: "GitHub",
            footer_disclaimer: "Demo only. Do not rely on this site in emergencies.",
            stealth_title: "Stealth Safety Tips",
            stealth_tip1: "Use incognito/private browsing mode",
            stealth_tip2: "Clear browser history and call logs regularly",
            stealth_tip3: "Use public computers when possible",
            stealth_tip4: "Create code words with trusted friends",
            chatbot_title: "Asha",
            chatbot_greeting: "Hello! I'm Asha, your support assistant. How can I help you today?",
            chatbot_placeholder: "Type a message..."
        },
        hi: {
            warning_title: "सामग्री चेतावनी",
            warning_text: "इस वेबसाइट में घरेलू हिंसा और दुर्व्यवहार से संबंधित सामग्री है। यह सामग्री कुछ उपयोगकर्ताओं के लिए परेशान करने वाली और उत्तेजक हो सकती है।",
            warning_emergency: "यदि आप तत्काल खतरे में हैं, तो आपातकालीन सेवाओं को कॉल करें: 112",
            resources_only: "केवल संसाधन देखें",
            proceed: "आगे बढ़ें",
            hero_title: "मौन को सुनें। चक्र को तोड़ें।",
            hero_subtitle: "एआई-संचालित पहचान प्रणाली जो आवाज के पैटर्न के माध्यम से घरेलू हिंसा की पहचान करती है और पीड़ितों को तत्काल मदद से जोड़ती है।",
            get_help: "अभी मदद पाएं",
            stats_title: "छिपा हुआ संकट",
            stat1: "% भारतीय महिलाओं को घरेलू हिंसा का सामना करना पड़ता है",
            stat2: "% मामले दर्ज नहीं होते",
            stat3: "महिलाएं प्रतिदिन घरेलू हिंसा के कारण मारी जाती हैं",
            how_title: "वॉयसगार्ड कैसे काम करता है",
            step1_title: "ऑडियो कैप्चर",
            step1_desc: "गोपनीयता-प्रथम एन्क्रिप्शन के साथ वास्तविक समय में पृष्ठभूमि ऑडियो की निगरानी",
            step2_title: "एआई पहचान",
            step2_desc: "उन्नत एमएल मॉडल संकट के पैटर्न, धमकियों और हिंसा के संकेतकों का पता लगाते हैं",
            step3_title: "स्मार्ट प्रतिक्रिया",
            step3_desc: "खतरे के स्तर और उपयोगकर्ता की सुरक्षा के आधार पर प्रासंगिक वृद्धि",
            step4_title: "तत्काल मदद",
            step4_desc: "स्थानीय अधिकारियों, गैर-सरकारी संगठनों और सहायता नेटवर्क से तुरंत जुड़ें",
            legal_title: "कानूनी मार्गदर्शन (भारत)",
            fir_tab: "पुलिस शिकायत (FIR)",
            dv_act_tab: "डीवी अधिनियम 2005",
            ipc_tab: "498A आईपीसी",
            protection_tab: "सुरक्षा आदेश",
            fir_title: "एफआईआर (प्रथम सूचना रिपोर्ट) दर्ज करें",
            name_label: "आपका नाम",
            date_label: "घटना की तारीख",
            description_label: "संक्षिप्त विवरण",
            generate_complaint: "शिकायत का मसौदा तैयार करें",
            complaint_draft: "शिकायत का मसौदा",
            copy_text: "टेक्स्ट कॉपी करें",
            legal_disclaimer: "अस्वीकरण:",
            disclaimer_text: "यह कानूनी सलाह नहीं है। व्यक्तिगत कानूनी मार्गदर्शन के लिए कृपया एक योग्य वकील या गैर-सरकारी संगठन से परामर्श करें।",
            dv_act_title: "घरेलू हिंसा अधिनियम, 2005",
            dv_act_desc: "घरेलू हिंसा से महिलाओं का संरक्षण अधिनियम, 2005 घरेलू हिंसा से बचे लोगों के लिए नागरिक उपचार प्रदान करता है।",
            dv_act_point1: "आगे की हिंसा को रोकने के लिए सुरक्षा आदेश",
            dv_act_point2: "साझा घर के अधिकारों के लिए निवास आदेश",
            dv_act_point3: "रखरखाव और मुआवजे के लिए मौद्रिक राहत",
            dv_act_point4: "बच्चों के लिए हिरासत आदेश",
            ipc_title: "धारा 498A आईपीसी",
            ipc_desc: "पति या पति के रिश्तेदारों द्वारा क्रूरता - 3 साल तक की कैद और जुर्माना।",
            protection_title: "सुरक्षा आदेश",
            protection_desc: "अदालती आदेश जो दुर्व्यवहार करने वाले को कानूनी रूप से अपमानजनक व्यवहार को रोकने के लिए आवश्यक करते हैं।",
            ngos_title: "सहायता और समर्थन निर्देशिका",
            womens_helpline: "महिला हेल्पलाइन",
            emergency_services: "आपातकालीन सेवाएं",
            all_cities: "सभी शहर",
            all_types: "सभी सेवाएं",
            legal: "कानूनी सहायता",
            shelter: "आश्रय",
            counseling: "परामर्श",
            stealth_tips: "स्टील्थ सुरक्षा युक्तियाँ",
            stealth_section_title: "स्टील्थ और सुरक्षा सुविधाएँ",
            stealth_features_title: "गोपनीयता संरक्षण",
            feature1: "पृष्ठभूमि पहचान (एंड्रॉइड संगतता)",
            feature2: "कोडवर्ड सक्रियण प्रणाली",
            feature3: "प्रच्छन्न ऐप (जैसे, मौसम)",
            feature4: "इतिहास साफ़ करने के साथ त्वरित निकास",
            feature5: "एंड-टू-एंड डेटा एन्क्रिप्शन",
            accessibility_title: "सरल उपयोग और भाषा समर्थन",
            accessibility_controls_title: "सरल उपयोग के विकल्प",
            reduced_motion: "गति कम करें",
            high_contrast: "उच्च कंट्रास्ट",
            font_size: "फ़ॉन्ट आकार",
            language_support_title: "भाषा समर्थन",
            language_desc: "वॉयसगार्ड कई भारतीय भाषाओं और बोलियों का समर्थन करता है:",
            roadmap_title: "विकास रोडमैप",
            roadmap1: "ऑन-डिवाइस एमएल मॉडल",
            roadmap2: "क्षेत्रीय बोली समर्थन",
            roadmap3: "एनजीओ एपीआई एकीकरण",
            roadmap4: "सुरक्षा ऑडिट",
            roadmap5: "आईओएस/एंड्रॉइड ऐप्स",
            ethics_title: "नैतिकता और जिम्मेदारी",
            ethics_desc: "हम घरेलू हिंसा पहचान प्रणालियों में सटीकता के महत्वपूर्ण महत्व को स्वीकार करते हैं।",
            ethics1: "गलत सकारात्मक/नकारात्मक के लिए निरंतर परीक्षण",
            ethics2: "सूचित सहमति और उपयोगकर्ता एजेंसी",
            ethics3: "डेटा न्यूनीकरण और गोपनीयता-प्रथम डिजाइन",
            ethics4: "नियमित रेड-टीम सुरक्षा परीक्षण",
            footer_resources: "संसाधन",
            footer_terms: "शर्तें",
            footer_privacy: "गोपनीयता",
            footer_contact: "संपर्क",
            footer_github: "गिटहब",
            footer_disclaimer: "केवल डेमो। आपात स्थिति में इस साइट पर भरोसा न करें।",
            stealth_title: "स्टील्थ सुरक्षा युक्तियाँ",
            stealth_tip1: "गुप्त/निजी ब्राउज़िंग मोड का उपयोग करें",
            stealth_tip2: "नियमित रूप से ब्राउज़र इतिहास और कॉल लॉग साफ़ करें",
            stealth_tip3: "जब संभव हो सार्वजनिक कंप्यूटर का उपयोग करें",
            stealth_tip4: "विश्वसनीय दोस्तों के साथ कोड वर्ड बनाएं",
            chatbot_title: "आशा",
            chatbot_greeting: "नमस्ते! मैं आशा हूँ, आपकी सहायक। मैं आज आपकी कैसे मदद कर सकती हूँ?",
            chatbot_placeholder: "संदेश लिखें..."
        },
        bn: { // Bengali
            warning_title: "বিষয়বস্তু সতর্কতা",
            warning_text: "এই ওয়েবসাইটে গার্হস্থ্য সহিংসতা এবং নির্যাতন সম্পর্কিত বিষয়বস্তু রয়েছে। এই বিষয়বস্তু কিছু ব্যবহারকারীর জন্য বিরক্তিকর এবং উদ্বেগজনক হতে পারে।",
            warning_emergency: "আপনি যদি অবিলম্বে বিপদে পড়েন, তাহলে জরুরি পরিষেবাগুলিতে কল করুন: 112",
            resources_only: "শুধুমাত্র সম্পদ দেখুন",
            proceed: "এগিয়ে যান",
            hero_title: "নীরবতা শুনুন। চক্রটি ভাঙুন।",
            hero_subtitle: "এআই-চালিত সনাক্তকরণ ব্যবস্থা যা ভয়েস প্যাটার্নের মাধ্যমে গার্হস্থ্য সহিংসতা সনাক্ত করে এবং ক্ষতিগ্রস্তদের অবিলম্বে সাহায্যের সাথে সংযুক্ত করে।",
            get_help: "এখনই সাহায্য পান",
            stats_title: "লুকানো সংকট",
            stat1: "ভারতে % মহিলারা গার্হস্থ্য সহিংসতার শিকার হন",
            stat2: "% ক্ষেত্রে রিপোর্ট করা হয় না",
            stat3: "মহিলা গার্হস্থ্য সহিংসতার কারণে প্রতিদিন নিহত হন",
            how_title: "ভয়েসগার্ড কীভাবে কাজ করে",
            step1_title: "অডিও ক্যাপচার",
            step1_desc: "গোপনীয়তা-প্রথম এনক্রিপশন সহ রিয়েল-টাইম ব্যাকগ্রাউন্ড অডিও পর্যবেক্ষণ",
            step2_title: "এআই সনাক্তকরণ",
            step2_desc: "উন্নত এমএল মডেলগুলি দুর্দশার ধরণ, হুমকি এবং সহিংসতার সূচক সনাক্ত করে",
            step3_title: "স্মার্ট প্রতিক্রিয়া",
            step3_desc: "হুমকির স্তর এবং ব্যবহারকারীর নিরাপত্তার উপর ভিত্তি করে প্রাসঙ্গিক বৃদ্ধি",
            step4_title: "অবিলম্বে সাহায্য",
            step4_desc: "স্থানীয় কর্তৃপক্ষ, এনজিও এবং সহায়তা নেটওয়ার্কের সাথে অবিলম্বে সংযোগ করুন",
            legal_title: "আইনি নির্দেশিকা (ভারত)",
            fir_tab: "পুলিশ অভিযোগ (এফআইআর)",
            dv_act_tab: "ডিভি আইন 2005",
            ipc_tab: "498A আইপিসি",
            protection_tab: "সুরক্ষা আদেশ",
            fir_title: "একটি এফআইআর (প্রথম তথ্য প্রতিবেদন) ফাইল করুন",
            name_label: "আপনার নাম",
            date_label: "ঘটনার তারিখ",
            description_label: "সংক্ষিপ্ত বিবরণ",
            generate_complaint: "অভিযোগের খসড়া তৈরি করুন",
            complaint_draft: "অভিযোগের খসড়া",
            copy_text: "পাঠ্য অনুলিপি করুন",
            legal_disclaimer: "দাবিত্যাগ:",
            disclaimer_text: "এটি আইনি পরামর্শ নয়। ব্যক্তিগতকৃত আইনি নির্দেশনার জন্য অনুগ্রহ করে একজন যোগ্য আইনজীবী বা এনজিওর সাথে পরামর্শ করুন।",
            ngos_title: "সহায়তা এবং সমর্থন ডিরেক্টরি",
            womens_helpline: "মহিলাদের হেল্পলাইন",
            emergency_services: "জরুরী সেবা",
            all_cities: "সব শহর",
            all_types: "সমস্ত পরিষেবা",
            legal: "আইনি সহায়তা",
            shelter: "আশ্রয়",
            counseling: "কাউন্সেলিং",
            stealth_tips: "স্টিলথ সুরক্ষা টিপস",
            stealth_section_title: "স্টিলথ এবং সুরক্ষা বৈশিষ্ট্য",
            stealth_features_title: "গোপনীয়তা সুরক্ষা",
            feature1: "পটভূমি সনাক্তকরণ (অ্যান্ড্রয়েড সামঞ্জস্য)",
            feature2: "কোডওয়ার্ড অ্যাক্টিভেশন সিস্টেম",
            feature3: "ছদ্মবেশী অ্যাপ (যেমন, আবহাওয়া)",
            feature4: "ইতিহাস পরিষ্কারের সাথে দ্রুত প্রস্থান",
            feature5: "এন্ড-টু-এন্ড ডেটা এনক্রিপশন",
            accessibility_title: "অ্যাক্সেসিবিলিটি এবং ভাষা সমর্থন",
            accessibility_controls_title: "অ্যাক্সেসিবিলিটি বিকল্প",
            reduced_motion: "গতি কমান",
            high_contrast: "উচ্চ বৈসাদৃশ্য",
            font_size: "হরফের আকার",
            language_support_title: "ভাষা সমর্থন",
            language_desc: "ভয়েসগার্ড একাধিক ভারতীয় ভাষা এবং উপভাষা সমর্থন করে:",
            roadmap_title: "উন্নয়ন রোডম্যাপ",
            roadmap1: "অন-ডিভাইস এমএল মডেল",
            roadmap2: "আঞ্চলিক উপভাষা সমর্থন",
            roadmap3: "এনজিও এপিআই ইন্টিগ্রেশন",
            roadmap4: "নিরাপত্তা অডিট",
            roadmap5: "আইওএস/অ্যান্ড্রয়েড অ্যাপস",
            ethics_title: "নীতিশাস্ত্র এবং দায়িত্ব",
            ethics_desc: "আমরা গার্হস্থ্য সহিংসতা সনাক্তকরণ ব্যবস্থায় নির্ভুলতার গুরুত্বপূর্ণ গুরুত্ব স্বীকার করি।",
            ethics1: "মিথ্যা ইতিবাচক/নেতিবাচকদের জন্য ক্রমাগত পরীক্ষা",
            ethics2: "অবহিত সম্মতি এবং ব্যবহারকারী সংস্থা",
            ethics3: "ডেটা মিনিমাইজেশন এবং গোপনীয়তা-প্রথম নকশা",
            ethics4: "নিয়মিত রেড-টিম নিরাপত্তা পরীক্ষা",
            footer_resources: "সম্পদ",
            footer_terms: "শর্তাবলী",
            footer_privacy: "গোপনীয়তা",
            footer_contact: "যোগাযোগ",
            footer_github: "গিটহাব",
            footer_disclaimer: "শুধুমাত্র ডেমো। জরুরী পরিস্থিতিতে এই সাইটের উপর নির্ভর করবেন না।",
            stealth_title: "স্টিলথ সুরক্ষা টিপস",
            stealth_tip1: "ছদ্মবেশী/ব্যক্তিগত ব্রাউজিং মোড ব্যবহার করুন",
            stealth_tip2: "নিয়মিতভাবে ব্রাউজারের ইতিহাস এবং কল লগ সাফ করুন",
            stealth_tip3: "যখন সম্ভব পাবলিক কম্পিউটার ব্যবহার করুন",
            stealth_tip4: "বিশ্বস্ত বন্ধুদের সাথে কোড শব্দ তৈরি করুন",
            chatbot_title: "আশা",
            chatbot_greeting: "নমস্কার! আমি আশা, আপনার সহায়ক। আমি আজ আপনাকে কিভাবে সাহায্য করতে পারি?",
            chatbot_placeholder: "বার্তা টাইপ করুন..."
        },
        ta: { // Tamil
            warning_title: "உள்ளடக்க எச்சரிக்கை",
            warning_text: "இந்த இணையதளத்தில் குடும்ப வன்முறை மற்றும் துஷ்பிரயோகம் தொடர்பான உள்ளடக்கம் உள்ளது. இந்த உள்ளடக்கம் சில பயனர்களுக்கு தொந்தரவாகவும் தூண்டுதலாகவும் இருக்கலாம்.",
            warning_emergency: "நீங்கள் உடனடி ஆபத்தில் இருந்தால், அவசர சேவைகளை அழைக்கவும்: 112",
            resources_only: "வளங்களை மட்டும் காண்க",
            proceed: "தொடரவும்",
            hero_title: "மௌனத்தைக் கேளுங்கள். சுழற்சியை உடைக்கவும்.",
            hero_subtitle: "குரல் வடிவங்கள் மூலம் குடும்ப வன்முறையை அடையாளம் கண்டு, பாதிக்கப்பட்டவர்களை உடனடி உதவியுடன் இணைக்கும் AI-இயங்கும் கண்டறிதல் அமைப்பு.",
            get_help: "இப்போது உதவி பெறுங்கள்",
            stats_title: "மறைக்கப்பட்ட நெருக்கடி",
            stat1: "இந்தியாவில் % பெண்கள் குடும்ப வன்முறையை எதிர்கொள்கின்றனர்",
            stat2: "% வழக்குகள் புகாரளிக்கப்படவில்லை",
            stat3: "பெண்கள் குடும்ப வன்முறையால் தினமும் கொல்லப்படுகிறார்கள்",
            how_title: "வாய்ஸ்கார்ட் எப்படி வேலை செய்கிறது",
            step1_title: "ஆடியோ பிடிப்பு",
            step1_desc: "தனியுரிமை-முதல் குறியாக்கத்துடன் நிகழ்நேர பின்னணி ஆடியோ கண்காணிப்பு",
            step2_title: "AI கண்டறிதல்",
            step2_desc: "மேம்பட்ட ML மாதிரிகள் துன்பகரமான வடிவங்கள், அச்சுறுத்தல்கள் மற்றும் வன்முறை குறிகாட்டிகளைக் கண்டறிகின்றன",
            step3_title: "ஸ்மார்ட் பதில்",
            step3_desc: "அச்சுறுத்தல் நிலை மற்றும் பயனர் பாதுகாப்பின் அடிப்படையில் சூழ்நிலை விரிவாக்கம்",
            step4_title: "உடனடி உதவி",
            step4_desc: "உள்ளூர் அதிகாரிகள், தன்னார்வ தொண்டு நிறுவனங்கள் மற்றும் ஆதரவு நெட்வொர்க்குகளுடன் உடனடியாக இணையுங்கள்",
            legal_title: "சட்ட வழிகாட்டுதல் (இந்தியா)",
            fir_tab: "காவல்துறை புகார் (FIR)",
            dv_act_tab: "டிவி சட்டம் 2005",
            ipc_tab: "498A ஐபிசி",
            protection_tab: "பாதுகாப்பு உத்தரவுகள்",
            fir_title: "ஒரு எஃப்ஐஆர் (முதல் தகவல் அறிக்கை) தாக்கல் செய்யவும்",
            name_label: "உங்கள் பெயர்",
            date_label: "சம்பவம் நடந்த தேதி",
            description_label: "சுருக்கமான விளக்கம்",
            generate_complaint: "புகார் வரைவை உருவாக்கவும்",
            complaint_draft: "புகார் வரைவு",
            copy_text: "உரையை நகலெடுக்கவும்",
            legal_disclaimer: "பொறுப்புத் துறப்பு:",
            disclaimer_text: "இது சட்ட ஆலோசனை அல்ல. தனிப்பயனாக்கப்பட்ட சட்ட வழிகாட்டுதலுக்கு தகுதியான வழக்கறிஞர் அல்லது தன்னார்வ தொண்டு நிறுவனத்தை அணுகவும்.",
            ngos_title: "உதவி மற்றும் ஆதரவு அடைவு",
            womens_helpline: "பெண்கள் உதவி எண்",
            emergency_services: "அவசர சேவைகள்",
            all_cities: "அனைத்து நகரங்களும்",
            all_types: "அனைத்து சேவைகளும்",
            legal: "சட்ட உதவி",
            shelter: "தங்குமிடம்",
            counseling: "ஆலோசனை",
            stealth_tips: "திருட்டுத்தனமான பாதுகாப்பு குறிப்புகள்",
            stealth_section_title: "திருட்டுத்தனமான மற்றும் பாதுகாப்பு அம்சங்கள்",
            stealth_features_title: "தனியுரிமை பாதுகாப்பு",
            feature1: "பின்னணி கண்டறிதல் (ஆண்ட்ராய்டு இணக்கத்தன்மை)",
            feature2: "குறியீட்டுச் சொல் செயல்படுத்தும் அமைப்பு",
            feature3: "மாறுவேடமிட்ட பயன்பாடு (எ.கா., வானிலை)",
            feature4: "வரலாற்றை அழித்து விரைவாக வெளியேறுதல்",
            feature5: "முழுமையான தரவு குறியாக்கம்",
            accessibility_title: "அணுகல் மற்றும் மொழி ஆதரவு",
            accessibility_controls_title: "அணுகல் விருப்பங்கள்",
            reduced_motion: "இயக்கத்தைக் குறைக்கவும்",
            high_contrast: "அதிக மாறுபாடு",
            font_size: "எழுத்துரு அளவு",
            language_support_title: "மொழி ஆதரவு",
            language_desc: "வாய்ஸ்கார்ட் பல இந்திய மொழிகள் மற்றும் பேச்சுவழக்குகளை ஆதரிக்கிறது:",
            roadmap_title: "மேம்பாட்டு வரைபடம்",
            roadmap1: "சாதனத்தில் உள்ள ML மாதிரிகள்",
            roadmap2: "பிராந்திய பேச்சுவழக்கு ஆதரவு",
            roadmap3: "தன்னார்வ தொண்டு நிறுவன API ஒருங்கிணைப்பு",
            roadmap4: "பாதுகாப்பு தணிக்கைகள்",
            roadmap5: "iOS/Android பயன்பாடுகள்",
            ethics_title: "நெறிமுறைகள் மற்றும் பொறுப்பு",
            ethics_desc: "குடும்ப வன்முறை கண்டறிதல் அமைப்புகளில் துல்லியத்தின் முக்கியத்துவத்தை நாங்கள் ஒப்புக்கொள்கிறோம்.",
            ethics1: "தவறான நேர்மறை/எதிர்மறைகளுக்கான தொடர்ச்சியான சோதனை",
            ethics2: "தகவலறிந்த ஒப்புதல் மற்றும் பயனர் நிறுவனம்",
            ethics3: "தரவு குறைத்தல் மற்றும் தனியுரிமை-முதல் வடிவமைப்பு",
            ethics4: "வழக்கமான சிவப்பு-குழு பாதுகாப்பு சோதனை",
            footer_resources: "வளங்கள்",
            footer_terms: "விதிமுறைகள்",
            footer_privacy: "தனியுரிமை",
            footer_contact: "தொடர்பு",
            footer_github: "கிட்ஹப்",
            footer_disclaimer: "டெமோ மட்டும். அவசர காலங்களில் இந்த தளத்தை நம்ப வேண்டாம்.",
            stealth_title: "திருட்டுத்தனமான பாதுகாப்பு குறிப்புகள்",
            stealth_tip1: "மறைநிலை/தனிப்பட்ட உலாவல் பயன்முறையைப் பயன்படுத்தவும்",
            stealth_tip2: "உலாவி வரலாறு மற்றும் அழைப்பு பதிவுகளை தவறாமல் அழிக்கவும்",
            stealth_tip3: "முடிந்தவரை பொது கணினிகளைப் பயன்படுத்தவும்",
            stealth_tip4: "நம்பகமான நண்பர்களுடன் குறியீட்டு வார்த்தைகளை உருவாக்கவும்",
            chatbot_title: "ஆஷா",
            chatbot_greeting: "வணக்கம்! நான் ஆஷா, உங்கள் ஆதரவு உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
            chatbot_placeholder: "செய்தியை தட்டச்சு செய்யவும்..."
        },
        te: { // Telugu
            warning_title: "కంటెంట్ హెచ్చరిక",
            warning_text: "ఈ వెబ్‌సైట్‌లో గృహ హింస మరియు దుర్వినియోగానికి సంబంధించిన కంటెంట్ ఉంది. ఈ కంటెంట్ కొంతమంది వినియోగదారులకు కలవరపెట్టే మరియు ప్రేరేపించేదిగా ఉండవచ్చు.",
            warning_emergency: "మీరు తక్షణ ప్రమాదంలో ఉంటే, అత్యవసర సేవలకు కాల్ చేయండి: 112",
            resources_only: "వనరులను మాత్రమే వీక్షించండి",
            proceed: "కొనసాగండి",
            hero_title: "నిశ్శబ్దాన్ని వినండి. చక్రాన్ని విచ్ఛిన్నం చేయండి.",
            hero_subtitle: "వాయిస్ నమూనాల ద్వారా గృహ హింసను గుర్తించే మరియు బాధితులను తక్షణ సహాయంతో కనెక్ట్ చేసే AI-ఆధారిత గుర్తింపు వ్యవస్థ.",
            get_help: "ఇప్పుడే సహాయం పొందండి",
            stats_title: "దాచిన సంక్షోభం",
            stat1: "భారతదేశంలో % మంది మహిళలు గృహ హింసను ఎదుర్కొంటున్నారు",
            stat2: "% కేసులు నివేదించబడలేదు",
            stat3: "మహిళలు గృహ హింస కారణంగా ప్రతిరోజూ చంపబడుతున్నారు",
            how_title: "వాయిస్‌గార్డ్ ఎలా పనిచేస్తుంది",
            step1_title: "ఆడియో క్యాప్చర్",
            step1_desc: "గోప్యత-మొదటి ఎన్‌క్రిప్షన్‌తో నిజ-సమయ నేపథ్య ఆడియో పర్యవేక్షణ",
            step2_title: "AI గుర్తింపు",
            step2_desc: "అధునాతన ML నమూనాలు కష్టాల నమూనాలు, బెదిరింపులు మరియు హింస సూచికలను గుర్తిస్తాయి",
            step3_title: "స్మార్ట్ ప్రతిస్పందన",
            step3_desc: "ప్రమాద స్థాయి మరియు వినియోగదారు భద్రత ఆధారంగా సందర్భోచిత తీవ్రత",
            step4_title: "తక్షణ సహాయం",
            step4_desc: "స్థానిక అధికారులు, NGOలు మరియు మద్దతు నెట్‌వర్క్‌లతో తక్షణమే కనెక్ట్ అవ్వండి",
            legal_title: "చట్టపరమైన మార్గదర్శకత్వం (భారతదేశం)",
            fir_tab: "పోలీసు ఫిర్యాదు (FIR)",
            dv_act_tab: "DV చట్టం 2005",
            ipc_tab: "498A ఐపిసి",
            protection_tab: "రక్షణ ఉత్తర్వులు",
            fir_title: "ఒక FIR (మొదటి సమాచార నివేదిక) దాఖలు చేయండి",
            name_label: "మీ పేరు",
            date_label: "సంఘటన జరిగిన తేదీ",
            description_label: "సంక్షిప్త వివరణ",
            generate_complaint: "ఫిర్యాదు ముసాయిదాను రూపొందించండి",
            complaint_draft: "ఫిర్యాదు ముసాయిదా",
            copy_text: "వచనాన్ని కాపీ చేయండి",
            legal_disclaimer: "నిరాకరణ:",
            disclaimer_text: "ఇది చట్టపరమైన సలహా కాదు. వ్యక్తిగతీకరించిన చట్టపరమైన మార్గదర్శకత్వం కోసం దయచేసి అర్హత కలిగిన న్యాయవాది లేదా NGOని సంప్రదించండి.",
            ngos_title: "సహాయం & మద్దతు డైరెక్టరీ",
            womens_helpline: "మహిళల హెల్ప్‌లైన్",
            emergency_services: "అత్యవసర సేవలు",
            all_cities: "అన్ని నగరాలు",
            all_types: "అన్ని సేవలు",
            legal: "చట్టపరమైన సహాయం",
            shelter: "ఆశ్రయం",
            counseling: "కౌన్సెలింగ్",
            stealth_tips: "స్టీల్త్ భద్రతా చిట్కాలు",
            stealth_section_title: "స్టీల్త్ & భద్రతా లక్షణాలు",
            stealth_features_title: "గోప్యతా రక్షణ",
            feature1: "నేపథ్య గుర్తింపు (ఆండ్రాయిడ్ అనుకూలత)",
            feature2: "కోడ్‌వర్డ్ యాక్టివేషన్ సిస్టమ్",
            feature3: "మారువేషంలో ఉన్న యాప్ (ఉదా., వాతావరణం)",
            feature4: "చరిత్రను క్లియర్ చేయడంతో త్వరిత నిష్క్రమణ",
            feature5: "ఎండ్-టు-ఎండ్ డేటా ఎన్‌క్రిప్షన్",
            accessibility_title: "యాక్సెసిబిలిటీ & భాషా మద్దతు",
            accessibility_controls_title: "యాక్సెసిబిలిటీ ఎంపికలు",
            reduced_motion: "కదలికను తగ్గించండి",
            high_contrast: "అధిక కాంట్రాస్ట్",
            font_size: "ఫాంట్ పరిమాణం",
            language_support_title: "భాషా మద్దతు",
            language_desc: "వాయిస్‌గార్డ్ బహుళ భారతీయ భాషలు మరియు మాండలికాలకు మద్దతు ఇస్తుంది:",
            roadmap_title: "అభివృద్ధి రోడ్‌మ్యాప్",
            roadmap1: "ఆన్-డివైస్ ML నమూనాలు",
            roadmap2: "ప్రాంతీయ మాండలిక మద్దతు",
            roadmap3: "NGO API ఇంటిగ్రేషన్",
            roadmap4: "భద్రతా ఆడిట్‌లు",
            roadmap5: "iOS/Android యాప్‌లు",
            ethics_title: "నైతికత & బాధ్యత",
            ethics_desc: "గృహ హింస గుర్తింపు వ్యవస్థలలో ఖచ్చితత్వం యొక్క కీలక ప్రాముఖ్యతను మేము అంగీకరిస్తున్నాము.",
            ethics1: "తప్పుడు పాజిటివ్‌లు/నెగటివ్‌ల కోసం నిరంతర పరీక్ష",
            ethics2: "సమాచారంతో కూడిన సమ్మతి మరియు వినియోగదారు ఏజెన్సీ",
            ethics3: "డేటా కనిష్టీకరణ మరియు గోప్యత-మొదటి డిజైన్",
            ethics4: "సాధారణ రెడ్-టీమ్ భద్రతా పరీక్ష",
            footer_resources: "వనరులు",
            footer_terms: "నిబంధనలు",
            footer_privacy: "గోప్యత",
            footer_contact: "సంప్రదించండి",
            footer_github: "గిట్‌హబ్",
            footer_disclaimer: "డెమో మాత్రమే. అత్యవసర పరిస్థితుల్లో ఈ సైట్‌పై ఆధారపడవద్దు.",
            stealth_title: "స్టీల్త్ భద్రతా చిట్కాలు",
            stealth_tip1: "అజ్ఞాత/ప్రైవేట్ బ్రౌజింగ్ మోడ్‌ను ఉపయోగించండి",
            stealth_tip2: "బ్రౌజర్ చరిత్ర మరియు కాల్ లాగ్‌లను క్రమం తప్పకుండా క్లియర్ చేయండి",
            stealth_tip3: "వీలైనప్పుడు పబ్లిక్ కంప్యూటర్‌లను ఉపయోగించండి",
            stealth_tip4: "విశ్వసనీయ స్నేహితులతో కోడ్ పదాలను సృష్టించండి",
            chatbot_title: "ఆశా",
            chatbot_greeting: "నమస్కారం! నేను ఆశా, మీ సహాయకారిని. ఈ రోజు నేను మీకు ఎలా సహాయపడగలను?",
            chatbot_placeholder: "సందేశాన్ని టైప్ చేయండి..."
        },
        mr: { // Marathi
            warning_title: "सामग्री चेतावणी",
            warning_text: "या वेबसाइटवर घरगुती हिंसाचार आणि गैरवर्तनाशी संबंधित सामग्री आहे. ही सामग्री काही वापरकर्त्यांसाठी त्रासदायक आणि उत्तेजक असू शकते.",
            warning_emergency: "तुम्ही तात्काळ धोक्यात असाल, तर आपत्कालीन सेवांना कॉल करा: 112",
            resources_only: "केवळ संसाधने पहा",
            proceed: "पुढे जा",
            hero_title: "शांतता ऐका. चक्र तोडा.",
            hero_subtitle: "एआय-चालित ओळख प्रणाली जी आवाजाच्या नमुन्यांद्वारे घरगुती हिंसाचार ओळखते आणि पीडितांना त्वरित मदतीशी जोडते.",
            get_help: "आता मदत मिळवा",
            stats_title: "लपलेले संकट",
            stat1: "भारतातील % महिलांना घरगुती हिंसाचाराचा सामना करावा लागतो",
            stat2: "% प्रकरणे नोंदवली जात नाहीत",
            stat3: "महिला घरगुती हिंसाचारामुळे दररोज मारल्या जातात",
            how_title: "व्हॉइसगार्ड कसे कार्य करते",
            step1_title: "ऑडिओ कॅप्चर",
            step1_desc: "गोपनीयता-प्रथम एनक्रिप्शनसह रिअल-टाइम पार्श्वभूमी ऑडिओ देखरेख",
            step2_title: "एआय ओळख",
            step2_desc: "प्रगत एमएल मॉडेल त्रासाचे नमुने, धमक्या आणि हिंसाचाराचे सूचक ओळखतात",
            step3_title: "स्मार्ट प्रतिसाद",
            step3_desc: "धोक्याची पातळी आणि वापरकर्त्याच्या सुरक्षिततेवर आधारित संदर्भित वाढ",
            step4_title: "त्वरित मदत",
            step4_desc: "स्थानिक अधिकारी, स्वयंसेवी संस्था आणि समर्थन नेटवर्कशी त्वरित कनेक्ट व्हा",
            legal_title: "कायदेशीर मार्गदर्शन (भारत)",
            fir_tab: "पोलीस तक्रार (एफआयआर)",
            dv_act_tab: "डीव्ही कायदा 2005",
            ipc_tab: "498A आयपीसी",
            protection_tab: "संरक्षण आदेश",
            fir_title: "एक एफआयआर (प्रथम माहिती अहवाल) दाखल करा",
            name_label: "तुमचे नाव",
            date_label: "घटनेची तारीख",
            description_label: "संक्षिप्त वर्णन",
            generate_complaint: "तक्रारीचा मसुदा तयार करा",
            complaint_draft: "तक्रारीचा मसुदा",
            copy_text: "मजकूर कॉपी करा",
            legal_disclaimer: "अस्वीकरण:",
            disclaimer_text: "हा कायदेशीर सल्ला नाही. वैयक्तिक कायदेशीर मार्गदर्शनासाठी कृपया पात्र वकील किंवा स्वयंसेवी संस्थेशी संपर्क साधा.",
            ngos_title: "मदत आणि समर्थन निर्देशिका",
            womens_helpline: "महिला हेल्पलाइन",
            emergency_services: "आपत्कालीन सेवा",
            all_cities: "सर्व शहरे",
            all_types: "सर्व सेवा",
            legal: "कायदेशीर मदत",
            shelter: "आश्रय",
            counseling: "समुपदेशन",
            stealth_tips: "स्टेल्थ सुरक्षा टिपा",
            stealth_section_title: "स्टेल्थ आणि सुरक्षा वैशिष्ट्ये",
            stealth_features_title: "गोपनीयता संरक्षण",
            feature1: "पार्श्वभूमी ओळख (Android सुसंगतता)",
            feature2: "कोडवर्ड सक्रियकरण प्रणाली",
            feature3: "वेष बदललेले अॅप (उदा., हवामान)",
            feature4: "इतिहास साफ करून त्वरित बाहेर पडा",
            feature5: "एंड-टू-एंड डेटा एनक्रिप्शन",
            accessibility_title: "प्रवेशयोग्यता आणि भाषा समर्थन",
            accessibility_controls_title: "प्रवेशयोग्यता पर्याय",
            reduced_motion: "गती कमी करा",
            high_contrast: "उच्च कॉन्ट्रास्ट",
            font_size: "फॉन्ट आकार",
            language_support_title: "भाषा समर्थन",
            language_desc: "व्हॉइसगार्ड अनेक भारतीय भाषा आणि बोलींना समर्थन देते:",
            roadmap_title: "विकास रोडमॅप",
            roadmap1: "ऑन-डिव्हाइस एमएल मॉडेल",
            roadmap2: "प्रादेशिक बोली समर्थन",
            roadmap3: "एनजीओ एपीआय एकत्रीकरण",
            roadmap4: "सुरक्षा ऑडिट",
            roadmap5: "आयओएस/Android अॅप्स",
            ethics_title: "नैतिकता आणि जबाबदारी",
            ethics_desc: "आम्ही घरगुती हिंसाचार ओळख प्रणालींमध्ये अचूकतेचे महत्त्वपूर्ण महत्त्व ओळखतो.",
            ethics1: "खोट्या सकारात्मक/नकारात्मकतेसाठी सतत चाचणी",
            ethics2: "माहितीपूर्ण संमती आणि वापरकर्ता एजन्सी",
            ethics3: "डेटा मिनिमायझेशन आणि गोपनीयता-प्रथम डिझाइन",
            ethics4: "नियमित रेड-टीम सुरक्षा चाचणी",
            footer_resources: "संसाधने",
            footer_terms: "अटी",
            footer_privacy: "गोपनीयता",
            footer_contact: "संपर्क",
            footer_github: "गिटहब",
            footer_disclaimer: "केवळ डेमो. आपत्कालीन परिस्थितीत या साइटवर अवलंबून राहू नका.",
            stealth_title: "स्टेल्थ सुरक्षा टिपा",
            stealth_tip1: "गुप्त/खाजगी ब्राउझिंग मोड वापरा",
            stealth_tip2: "ब्राउझर इतिहास आणि कॉल लॉग नियमितपणे साफ करा",
            stealth_tip3: "शक्य असेल तेव्हा सार्वजनिक संगणक वापरा",
            stealth_tip4: "विश्वसनीय मित्रांसह कोड शब्द तयार करा",
            chatbot_title: "आशा",
            chatbot_greeting: "नमस्कार! मी आशा आहे, तुमची सहाय्यक. मी आज तुमची कशी मदत करू शकते?",
            chatbot_placeholder: "संदेश टाइप करा..."
        }
    };

    initializeApp() {
        // Set initial mode
        document.documentElement.setAttribute('data-mode', this.currentMode);
        this.updateModeToggle();
        
        // Set initial language
        this.updateLanguage();
        
        // Initialize counters
        setTimeout(() => {
            this.animateCounters();
        }, 1000);
    }

    setupEventListeners() {
        // Mode Toggle
        document.getElementById('mode-toggle').addEventListener('click', () => {
            this.toggleMode();
        });

        // Language Select Dropdown
        document.getElementById('language-select').addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
        });

        // Language Tags in Accessibility Section
        document.querySelectorAll('.lang-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });

        // Quick Exit buttons
        document.getElementById('header-exit').addEventListener('click', this.quickExit);
        
        // ESC key for quick exit
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.quickExit();
            }
        });

        // Content Warning Modal
        document.getElementById('proceed-btn').addEventListener('click', () => {
            localStorage.setItem('voiceguard-warning-acknowledged', 'true');
            bootstrap.Modal.getInstance(document.getElementById('content-warning-modal')).hide();
        });

        document.getElementById('resources-only').addEventListener('click', () => {
            localStorage.setItem('voiceguard-warning-acknowledged', 'true');
            bootstrap.Modal.getInstance(document.getElementById('content-warning-modal')).hide();
            document.getElementById('ngos').scrollIntoView({ behavior: 'smooth' });
        });

        // Get Help CTA
        document.querySelector('.cta-help').addEventListener('click', () => {
            document.getElementById('ngos').scrollIntoView({ behavior: 'smooth' });
        });

        // Legal Form
        document.getElementById('complaint-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateComplaint();
        });

        document.getElementById('copy-complaint').addEventListener('click', () => {
            this.copyComplaint();
        });

        // NGO Filters
        document.getElementById('city-filter').addEventListener('change', () => {
            this.filterNGOs();
        });

        document.getElementById('type-filter').addEventListener('change', () => {
            this.filterNGOs();
        });

        // Chatbot listeners
        const chatbotIcon = document.getElementById('chatbot-icon');
        const chatbotWindow = document.getElementById('chatbot-window');
        const chatbotClose = document.getElementById('chatbot-close');

        if (chatbotIcon && chatbotWindow && chatbotClose) {
            chatbotIcon.addEventListener('click', () => {
                chatbotWindow.classList.toggle('open');
            });

            chatbotClose.addEventListener('click', () => {
                chatbotWindow.classList.remove('open');
            });
        }
    }

    setupAccessibility() {
        // Reduced Motion
        document.getElementById('reduced-motion').addEventListener('change', (e) => {
            document.body.classList.toggle('reduced-motion', e.target.checked);
        });

        // High Contrast
        document.getElementById('high-contrast').addEventListener('change', (e) => {
            document.body.classList.toggle('high-contrast', e.target.checked);
        });

        // Font Size
        document.getElementById('font-size').addEventListener('input', (e) => {
            document.documentElement.style.fontSize = e.target.value + 'px';
        });

        // Check for prefers-reduced-motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.getElementById('reduced-motion').checked = true;
            document.body.classList.add('reduced-motion');
        }
    }

    showContentWarning() {
        const modal = new bootstrap.Modal(document.getElementById('content-warning-modal'), {
            backdrop: 'static',
            keyboard: false
        });
        modal.show();
    }

    toggleMode() {
        this.currentMode = this.currentMode === 'impact' ? 'calm' : 'impact';
        localStorage.setItem('voiceguard-mode', this.currentMode);
        document.documentElement.setAttribute('data-mode', this.currentMode);
        this.updateModeToggle();
    }

    updateModeToggle() {
        const text = document.getElementById('mode-text');
        text.textContent = this.currentMode === 'impact' ? 'Calm' : 'Impact';
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('voiceguard-lang', lang);
        this.updateLanguage();
    }

    updateLanguage() {
        // Update regular text content
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.i18n[this.currentLang]?.[key] || this.i18n.en[key];
            if (translation) {
                element.textContent = translation;
            }
        });

        // Update placeholder text
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.i18n[this.currentLang]?.[key] || this.i18n.en[key];
            if (translation) {
                element.setAttribute('placeholder', translation);
            }
        });

        // Update language select dropdown to match current language
        document.getElementById('language-select').value = this.currentLang;
    }

    quickExit() {
        // This function redirects the user to a neutral website, replacing the current page in history.
        // It's a safety feature to prevent an abuser from seeing the site in the browser history.
        window.location.replace('https://www.google.com/search?q=weather');
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            let start = null;
            
            const step = (timestamp) => {
                if (!start) start = timestamp;
                const progress = Math.min((timestamp - start) / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(easeOut * target);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            
            window.requestAnimationFrame(step);
        });
    }

    generateComplaint() {
        const name = document.getElementById('complainant-name').value;
        const date = document.getElementById('incident-date').value;
        const description = document.getElementById('incident-desc').value;
        
        const complaintTemplate = `
To,
The Station House Officer,
[Police Station Name]
[District], [State]

Subject: Complaint under Section 498A IPC and Domestic Violence Act, 2005

Respected Sir/Madam,

I, ${name}, resident of [Your Address], hereby lodge a complaint against [Accused Name(s)] for domestic violence and cruelty.

DETAILS OF THE INCIDENT:

Date of Incident: ${date}

Description: ${description}

The above-mentioned acts constitute domestic violence under the Protection of Women from Domestic Violence Act, 2005, and cruelty under Section 498A of the Indian Penal Code.

I request you to register an FIR and take appropriate legal action against the accused.

Yours faithfully,
${name}
Date: ${new Date().toLocaleDateString('en-IN')}

---
DISCLAIMER: This is an auto-generated template. Please consult with a lawyer or legal aid organization before filing. Modify as per your specific circumstances.
        `;
        
        document.getElementById('complaint-text').value = complaintTemplate.trim();
        document.getElementById('generated-complaint').classList.remove('d-none');
    }

    copyComplaint() {
        const textarea = document.getElementById('complaint-text');
        textarea.select();
        textarea.setSelectionRange(0, 99999); // For mobile devices
        
        try {
            document.execCommand('copy');
            const button = document.getElementById('copy-complaint');
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    populateNGODirectory() {
        const mockNGOs = [
            { name: "Women's Rights Initiative", city: "delhi", type: "legal", phone: "+91-11-2345-6789", hours: "24/7 Helpline", services: "Legal Aid, Counseling" },
            { name: "Safe Haven Shelter", city: "mumbai", type: "shelter", phone: "+91-22-9876-5432", hours: "24/7 Emergency", services: "Temporary Shelter, Medical Aid" },
            { name: "Healing Hearts Counseling", city: "bangalore", type: "counseling", phone: "+91-80-1111-2222", hours: "Mon-Fri 9AM-6PM", services: "Psychological Support, Group Therapy" },
            { name: "Legal Aid Society", city: "delhi", type: "legal", phone: "+91-11-3333-4444", hours: "Mon-Sat 10AM-5PM", services: "Free Legal Consultation, Court Representation" },
            { name: "Women's Crisis Center", city: "mumbai", type: "counseling", phone: "+91-22-5555-6666", hours: "24/7 Crisis Line", services: "Crisis Intervention, Safety Planning" },
            { name: "Phoenix Rising Shelter", city: "bangalore", type: "shelter", phone: "+91-80-7777-8888", hours: "24/7 Intake", services: "Long-term Housing, Job Training" }
        ];
        
        this.ngoData = mockNGOs;
        this.renderNGOs(mockNGOs);
    }

    renderNGOs(ngos) {
        const container = document.getElementById('ngo-directory');
        container.innerHTML = '';
        
        if (ngos.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">No organizations match the current filters.</p>';
            return;
        }

        ngos.forEach(ngo => {
            const card = document.createElement('div');
            card.className = 'ngo-card';
            card.innerHTML = `
                <h4>${ngo.name}</h4>
                <p><strong>City:</strong> ${ngo.city.charAt(0).toUpperCase() + ngo.city.slice(1)}</p>
                <p><strong>Type:</strong> ${ngo.type.charAt(0).toUpperCase() + ngo.type.slice(1)}</p>
                <p><strong>Phone:</strong> <a href="tel:${ngo.phone}" class="text-decoration-none">${ngo.phone}</a></p>
                <p><strong>Hours:</strong> ${ngo.hours}</p>
                <p><strong>Services:</strong> ${ngo.services}</p>
                <a href="tel:${ngo.phone}" class="btn btn-sm btn-primary mt-2">Call Now</a>
            `;
            container.appendChild(card);
        });
    }

    filterNGOs() {
        const cityFilter = document.getElementById('city-filter').value;
        const typeFilter = document.getElementById('type-filter').value;
        
        let filteredNGOs = this.ngoData;
        
        if (cityFilter !== 'all') {
            filteredNGOs = filteredNGOs.filter(ngo => ngo.city === cityFilter);
        }
        
        if (typeFilter !== 'all') {
            filteredNGOs = filteredNGOs.filter(ngo => ngo.type === typeFilter);
        }
        
        this.renderNGOs(filteredNGOs);
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const voiceGuard = new VoiceGuardApp();
    // Expose to global scope for any potential inline handlers or debugging
    window.voiceGuard = voiceGuard;
});

// Auto-clear sensitive form data on page unload for added privacy
window.addEventListener('beforeunload', () => {
    const sensitiveFields = document.querySelectorAll('#complainant-name, #incident-date, #incident-desc');
    sensitiveFields.forEach(field => {
        field.value = '';
    });
});
