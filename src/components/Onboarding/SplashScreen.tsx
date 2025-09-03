import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">💕</div>
          <h1 className="text-4xl font-bold text-white mb-2">{t('app.name', 'Dating App')}</h1>
          <p className="text-xl text-white/80">{t('app.subtitle', 'Voice Connections')}</p>
        </div>
        <div className="animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );
};