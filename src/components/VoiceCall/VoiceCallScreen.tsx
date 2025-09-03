import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, Settings, Users } from "lucide-react";

interface VoiceCallScreenProps {
  onStartCall: () => void;
  onSettings: () => void;
}

export const VoiceCallScreen = ({ onStartCall, onSettings }: VoiceCallScreenProps) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <Card className="p-6 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Phone className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{t('voiceCall.title')}</h2>
            <p className="text-muted-foreground">{t('voiceCall.description')}</p>
          </div>

          <Button onClick={onStartCall} className="w-full h-14 text-lg">
            <Phone className="w-6 h-6 mr-2" />
            {t('voiceCall.startCall')}
          </Button>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            {t('voiceCall.activeUsers')}
          </h3>
          <div className="flex justify-between text-sm">
            <span>{t('voiceCall.onlineNow')}</span>
            <span className="font-medium text-primary">245 users</span>
          </div>
        </Card>

        <Card className="p-4">
          <Button onClick={onSettings} variant="outline" className="w-full justify-start">
            <Settings className="w-5 h-5 mr-2" />
            {t('voiceCall.settings')}
          </Button>
        </Card>
      </div>
    </div>
  );
};