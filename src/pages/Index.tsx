import { useState } from "react";
import HomeScreen from "../frontend/src/components/HomeScreen";
import { CoinPurchaseModal } from "../components/Coins/CoinPurchaseModal";
import { PremiumModal } from "../components/Premium/PremiumModal";
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
  const [currentScreen, setCurrentScreen] = useState("home");
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [hasUnlimitedCalls, setHasUnlimitedCalls] = useState(false);
  const [coinBalance, setCoinBalance] = useState(100);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleStartVoiceCall = () => {
    setCurrentScreen("voice-call");
  };

  const handleBuyCoins = () => {
    setShowCoinModal(true);
  };

  const handleUpgradePremium = () => {
    setShowPremiumModal(true);
  };

  const handleCoinPurchaseSuccess = (pack: string, coins: number) => {
    setCoinBalance(prev => prev + coins);
    toast.success(`${coins} coins added successfully! 💰`);
  };

  const handlePremiumSubscribe = (plan: string) => {
    setIsPremium(true);
    setShowPremiumModal(false);
    toast.success("Premium activated! Payment successful! 🎉");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main App Content */}
      {currentScreen === "home" && (
        <HomeScreen 
          onStartMatch={() => setCurrentScreen("call")}
          onStartVoiceCall={handleStartVoiceCall}
          onOpenProfile={() => setCurrentScreen("profile")}
          coinBalance={coinBalance}
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