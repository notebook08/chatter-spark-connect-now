import { useState, useEffect } from "react";
import HomeScreen from "../frontend/src/components/HomeScreen";
import { CoinPurchaseModal } from "../frontend/src/components/CoinPurchaseModal";
import { PremiumModal } from "../frontend/src/components/PremiumModal";
import { useCoinBalance } from "../frontend/src/hooks/useCoinBalance";
import toast from "react-hot-toast";

interface UserProfile {
  username: string;
  photos: string[];
  bio: string;
  interests: string[];
  matchPreference: "anyone" | "men" | "women";
  gender: "male" | "female" | "other";
  isPremium?: boolean;
}

const Index = () => {
  const [appState, setAppState] = useState("main");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentScreen, setCurrentScreen] = useState("home");
  const [activeTab, setActiveTab] = useState("home");
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [hasUnlimitedCalls, setHasUnlimitedCalls] = useState(false);
  const [coinBalance, setCoinBalance] = useState(100);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  const { balance: coinBalanceFromHook, loading: coinLoading, addCoins } = useCoinBalance();
  const effectiveCoinBalance = !coinLoading ? coinBalanceFromHook : coinBalance;

  const handleStartVoiceCall = () => {
    if (userProfile) {
      setCurrentScreen("voice-call");
    }
  };

  const handleBuyCoins = () => {
    setShowCoinModal(true);
  };

  const handleUpgradePremium = () => {
    setShowPremiumModal(true);
  };

  const handleSpendCoins = (amount: number) => {
    setCoinBalance(prev => Math.max(0, prev - amount));
    toast({
      title: "Coins spent",
      description: `${amount} coins used for voice call.`,
    });
  };

  const handleCoinPurchaseSuccess = (pack: string, coins: number) => {
    addCoins(coins);
    toast({
      title: "Coins Added Successfully! 💰",
      description: `${coins} coins have been credited to your account.`,
    });
  };

  const handlePremiumSubscribe = (plan: string) => {
    setIsPremium(true);
    setShowPremiumModal(false);
    toast({
      title: "Premium Activated!",
      description: "Payment successful! You now have access to all premium features.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main App Content */}
      {currentScreen === "home" && (
        <HomeScreen 
          onStartMatch={() => setCurrentScreen("call")}
          onStartVoiceCall={handleStartVoiceCall}
          onOpenProfile={() => setCurrentScreen("profile")}
          coinBalance={effectiveCoinBalance}
          isPremium={isPremium}
          hasUnlimitedCalls={hasUnlimitedCalls}
          onBuyCoins={handleBuyCoins}
          onUpgradePremium={handleUpgradePremium}
        />
      )}

      {/* Modals */}
      {showCoinModal && (
        <CoinPurchaseModal
          isOpen={showCoinModal}
          onClose={() => setShowCoinModal(false)}
          onPurchaseSuccess={handleCoinPurchaseSuccess}
        />
      )}

      {showPremiumModal && (
        <PremiumModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          onSubscribe={handlePremiumSubscribe}
        />
      )}
    </div>
  );
};

export default Index;