import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, Video, MessageCircle, Users, Crown, Coins } from "lucide-react";

interface HomeScreenProps {
  onStartVoiceCall: () => void;
  onStartVideoCall: () => void;
  onOpenChat: () => void;
  onViewMatches: () => void;
  onBuyCoins: () => void;
  onUpgradePremium: () => void;
  coinBalance: number;
  isPremium: boolean;
}

const HomeScreen = ({ 
  onStartVoiceCall, 
  onStartVideoCall, 
  onOpenChat, 
  onViewMatches,
  onBuyCoins,
  onUpgradePremium,
  coinBalance,
  isPremium 
}: HomeScreenProps) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{t('home.welcome')}</h1>
              <p className="text-muted-foreground">{t('home.subtitle')}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-primary/10 px-3 py-1 rounded-full">
                <Coins className="w-4 h-4 text-primary mr-1" />
                <span className="text-sm font-medium">{coinBalance}</span>
              </div>
              {isPremium && (
                <Crown className="w-5 h-5 text-yellow-500" />
              )}
            </div>
          </div>
        </Card>

        {/* Main Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <Button 
              onClick={onStartVoiceCall}
              className="w-full h-20 flex flex-col items-center justify-center"
            >
              <Phone className="w-6 h-6 mb-2" />
              <span className="text-sm">{t('home.voiceCall')}</span>
            </Button>
          </Card>

          <Card className="p-4">
            <Button 
              onClick={onStartVideoCall}
              className="w-full h-20 flex flex-col items-center justify-center"
              variant="secondary"
            >
              <Video className="w-6 h-6 mb-2" />
              <span className="text-sm">{t('home.videoCall')}</span>
            </Button>
          </Card>
        </div>

        {/* Secondary Actions */}
        <div className="space-y-3">
          <Button 
            onClick={onOpenChat}
            variant="outline" 
            className="w-full justify-start"
          >
            <MessageCircle className="w-5 h-5 mr-3" />
            {t('home.openChat')}
          </Button>

          <Button 
            onClick={onViewMatches}
            variant="outline" 
            className="w-full justify-start"
          >
            <Users className="w-5 h-5 mr-3" />
            {t('home.viewMatches')}
          </Button>

          <Button 
            onClick={onBuyCoins}
            variant="outline" 
            className="w-full justify-start"
          >
            <Coins className="w-5 h-5 mr-3" />
            {t('home.buyCoins')}
          </Button>

          {!isPremium && (
            <Button 
              onClick={onUpgradePremium}
              className="w-full justify-start bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              <Crown className="w-5 h-5 mr-3" />
              {t('home.upgradePremium')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;