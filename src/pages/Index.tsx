import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { SplashScreen } from "@/components/Onboarding/SplashScreen";
import { AuthScreen } from "@/components/Auth/AuthScreen";
import { useAuth } from "@/hooks/useAuth";
import { OnboardingScreen } from "@/components/Onboarding/OnboardingScreen";
import { ProfileScreen } from "@/components/Profile/ProfileScreen";
import HomeScreen from "@/components/Home/HomeScreen";
import { LanguageSelector } from "@/components/ui/language-selector";
import { VideoCallScreen } from "@/components/VideoChat/VideoCallScreen";
import { PostCallProfileScreen } from "@/components/VideoChat/PostCallProfileScreen";
import { MatchScreen } from "@/components/Match/MatchScreen";
import { ChatListScreen, ChatPreview } from "@/components/Chat/ChatListScreen";
import { ChatDetailScreen, ChatData, Message } from "@/components/Chat/ChatDetailScreen";
import { PremiumModal } from "@/components/Premium/PremiumModal";
import { CoinPurchaseModal } from "@/components/Coins/CoinPurchaseModal";
import { VoiceCallScreen } from "@/components/VoiceCall/VoiceCallScreen";
import { VoiceCallActiveScreen } from "@/components/VoiceCall/VoiceCallActiveScreen";
import { BottomNav } from "@/components/Layout/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { useCoinBalance } from "@/hooks/useCoinBalance";

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
  const { i18n } = useTranslation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [appState, setAppState] = useState<"splash" | "onboarding" | "main" | "auth" | "language">("splash");
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentScreen, setCurrentScreen] = useState<"home" | "call" | "voice-call" | "post-call" | "premium">("home");
  const [activeTab, setActiveTab] = useState("home");
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [hasUnlimitedCalls, setHasUnlimitedCalls] = useState(false);
  const [coinBalance, setCoinBalance] = useState(100);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  const { balance: coinBalanceFromHook, loading: coinLoading } = useCoinBalance();
  const effectiveCoinBalance = !coinLoading ? coinBalanceFromHook : coinBalance;
  const { toast } = useToast();

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
    
    // Listen for voice navigation event
    const handleVoiceNavigation = () => {
      setActiveTab("voice");
    };
    
    window.addEventListener('navigate-to-voice', handleVoiceNavigation);
    
    return () => {
      window.removeEventListener('navigate-to-voice', handleVoiceNavigation);
    };
  }, [i18n]);

  // Show loading during auth check
  if (authLoading) {
    return <SplashScreen onComplete={() => {}} />;
  }

  // Show language selector first
  if (!localStorage.getItem('preferred-language') && appState === "splash") {
    return (
      <LanguageSelector 
        onLanguageSelect={(lang) => {
          localStorage.setItem('preferred-language', lang);
        }}
        onContinue={() => setAppState("auth")}
      />
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated && appState !== "splash" && appState !== "auth") {
    return <AuthScreen onSuccess={() => setAppState("main")} />;
  }

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
    setCoinBalance(prev => prev + coins);
    toast({
      title: "Coins Added Successfully! 💰",
      description: `${coins} coins have been credited to your account.`,
    });
  };

  const handlePremiumSubscribe = (plan: string) => {
    setIsPremium(true);
    setShowPremiumModal(false);
    toast({
      title: "Premium Activated! 👑",
      description: "Payment successful! You now have access to all premium features.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Conditional rendering based on app state */}
      {appState === "splash" && (
        <SplashScreen onComplete={() => setAppState(isAuthenticated ? "main" : "auth")} />
      )}

      {appState === "auth" && (
        <AuthScreen onSuccess={() => setAppState("onboarding")} />
      )}

      {appState === "onboarding" && (
        <OnboardingScreen 
          onComplete={(profile) => {
            setUserProfile(profile);
            setAppState("main");
          }} 
        />
      )}

      {appState === "main" && (
        <>
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

          {currentScreen === "voice-call" && (
            <VoiceCallScreen
              onStartCall={() => setCurrentScreen("voice-call-active")}
              isPremium={isPremium}
              hasUnlimitedCalls={hasUnlimitedCalls}
              coinBalance={effectiveCoinBalance}
              matchPreference={userProfile?.matchPreference || "anyone"}
              onChangePreference={(pref) => {
                if (userProfile) {
                  setUserProfile({...userProfile, matchPreference: pref});
                }
              }}
              onRequestUpgrade={handleUpgradePremium}
              onBack={() => setCurrentScreen("home")}
              onBuyCoins={handleBuyCoins}
              onSpendCoins={handleSpendCoins}
            />
          )}

          {currentScreen === "premium" && (
            <div>Premium Screen</div>
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

          {/* Bottom Navigation */}
          <BottomNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            coinBalance={effectiveCoinBalance}
            isPremium={isPremium}
          />
        </>
      )}
    </div>
  );
};

export default Index;