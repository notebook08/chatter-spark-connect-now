import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Check, Globe } from 'lucide-react';

interface LanguageSelectorProps {
  onLanguageSelect: (language: string) => void;
  onContinue: () => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
];

export function LanguageSelector({ onLanguageSelect, onContinue }: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    onLanguageSelect(languageCode);
    i18n.changeLanguage(languageCode);
    localStorage.setItem('preferred-language', languageCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg glass-panel border-glass shadow-glow">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground font-poppins">Choose Your Language</h1>
            <p className="text-muted-foreground font-poppins">Select your preferred language for the app</p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 group ${
                  selectedLanguage === language.code
                    ? 'bg-gradient-primary text-white border-transparent shadow-warm scale-105'
                    : 'glass-card border-glass hover:border-primary/30 hover:shadow-warm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{language.flag}</span>
                  <span className={`font-medium font-poppins ${
                    selectedLanguage === language.code ? 'text-white' : 'text-foreground'
                  }`}>
                    {language.name}
                  </span>
                </div>
                {selectedLanguage === language.code && (
                  <Check className="w-5 h-5 text-white" />
                )}
              </button>
            ))}
          </div>
          
          <Button 
            onClick={onContinue}
            className="w-full bg-gradient-primary hover:scale-105 transition-all duration-300 font-poppins font-semibold h-12 rounded-xl shadow-warm"
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}