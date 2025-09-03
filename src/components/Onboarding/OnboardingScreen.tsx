import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface OnboardingScreenProps {
  onComplete: (profile: any) => void;
}

export const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    interests: [],
    gender: "",
    matchPreference: "",
  });

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete(profile);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t('onboarding.welcome')}</h2>
            <p className="text-muted-foreground mb-6">{t('onboarding.welcomeText')}</p>
          </div>
        );
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">{t('onboarding.profile')}</h2>
            <p className="text-muted-foreground mb-6">{t('onboarding.profileText')}</p>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">{t('onboarding.preferences')}</h2>
            <p className="text-muted-foreground mb-6">{t('onboarding.preferencesText')}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        {renderStep()}
        
        <div className="flex justify-between mt-8">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              {t('common.back')}
            </Button>
          )}
          <Button onClick={handleNext} className="ml-auto">
            {step < 2 ? t('common.next') : t('common.complete')}
          </Button>
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};