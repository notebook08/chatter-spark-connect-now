import { useState } from 'react';
import { Video, Phone, Settings, Coins, Crown } from 'lucide-react';
import { formatCurrency } from '../utils/paymentHelpers';

const HomeScreen = ({ 
  onStartMatch, 
  onStartVoiceCall, 
  onOpenProfile, 
  coinBalance, 
  isPremium, 
  hasUnlimitedCalls,
  onBuyCoins,
  onUpgradePremium 
}) => {
  const [matchPreference, setMatchPreference] = useState("anyone");

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Streamify
          </h1>
          <p className="opacity-70">Connect with language partners worldwide</p>
        </div>

        {/* Status Card */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img src="https://avatar.iran.liara.run/public/1.png" alt="Profile" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Welcome back!</h3>
                  <p className="text-sm opacity-70">Ready to practice?</p>
                </div>
              </div>
              <button 
                onClick={onOpenProfile}
                className="btn btn-ghost btn-circle"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Balance Display */}
            <div className="flex items-center justify-between p-3 bg-base-300 rounded-lg">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" />
                <span className="font-medium">{coinBalance} Coins</span>
              </div>
              {isPremium ? (
                <div className="flex items-center gap-2 text-primary">
                  <Crown className="w-4 h-4" />
                  <span className="text-sm font-medium">Premium</span>
                </div>
              ) : (
                <button 
                  onClick={onUpgradePremium}
                  className="btn btn-primary btn-xs"
                >
                  Upgrade
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Match Preference */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-6">
            <h3 className="font-semibold mb-3">Match Preference</h3>
            <div className="flex gap-2">
              {['anyone', 'men', 'women'].map((pref) => (
                <button
                  key={pref}
                  onClick={() => setMatchPreference(pref)}
                  className={`btn btn-sm flex-1 ${
                    matchPreference === pref ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  {pref.charAt(0).toUpperCase() + pref.slice(1)}
                </button>
              ))}
            </div>
            {!isPremium && matchPreference !== 'anyone' && (
              <div className="mt-3 p-3 bg-warning/10 rounded-lg">
                <p className="text-sm text-warning">
                  Gender preference requires Premium subscription
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button 
            onClick={onStartMatch}
            className="btn btn-primary w-full h-16 text-lg"
          >
            <Video className="w-6 h-6 mr-2" />
            Start Video Call
          </button>

          <button 
            onClick={onStartVoiceCall}
            className="btn btn-secondary w-full h-16 text-lg"
          >
            <Phone className="w-6 h-6 mr-2" />
            Start Voice Call
            {!isPremium && (
              <span className="ml-2 text-xs opacity-70">(10 coins/min)</span>
            )}
          </button>
        </div>

        {/* Buy Coins Button */}
        {!isPremium && coinBalance < 50 && (
          <div className="card bg-warning/10 border border-warning/20">
            <div className="card-body p-4 text-center">
              <p className="text-sm mb-3">Low on coins? Top up now!</p>
              <button 
                onClick={onBuyCoins}
                className="btn btn-warning btn-sm"
              >
                <Coins className="w-4 h-4 mr-2" />
                Buy Coins
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;