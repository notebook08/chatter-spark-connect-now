import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AuthScreenProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export const AuthScreen = ({ onLogin, onSignUp }: AuthScreenProps) => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = () => {
    if (isLogin) {
      onLogin();
    } else {
      onSignUp();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">💕</div>
          <h1 className="text-2xl font-bold">{isLogin ? t('auth.login') : t('auth.signup')}</h1>
          <p className="text-muted-foreground mt-2">
            {isLogin ? t('auth.loginSubtitle') : t('auth.signupSubtitle')}
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={handleSubmit} className="w-full">
            {isLogin ? t('auth.login') : t('auth.signup')}
          </Button>
          
          <div className="text-center">
            <Button 
              variant="link" 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
            >
              {isLogin ? t('auth.needAccount') : t('auth.haveAccount')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};