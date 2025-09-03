import { useState } from 'react';
import { X, Gem } from 'lucide-react';
import { COIN_PACKAGES } from '../config/payments';
import { formatCurrency, calculateDiscount } from '../utils/paymentHelpers';
import { usePayment } from '../hooks/usePayment';

export function CoinPurchaseModal({ isOpen, onClose, onPurchaseSuccess }) {
  const { processPayment, isProcessing } = usePayment({
    onSuccess: (result) => {
      onClose();
    },
    onError: (error) => {
      console.error('Coin purchase failed:', error);
    }
  });

  if (!isOpen) return null;

  const packages = [
    { key: 'small', pack: COIN_PACKAGES.small, popular: false },
    { key: 'medium', pack: COIN_PACKAGES.medium, popular: true },
    { key: 'large', pack: COIN_PACKAGES.large, popular: false }
  ];

  const handlePackageSelect = async (packageKey) => {
    const pack = COIN_PACKAGES[packageKey];
    if (pack) {
      await processPayment('coins', packageKey);
      onPurchaseSuccess?.(packageKey, pack.coins);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 w-full max-w-2xl rounded-3xl shadow-2xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full">
                <Gem className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Buy Coins</h2>
                <p className="opacity-70">Purchase coins for voice calls</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="btn btn-ghost btn-circle"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {packages.map(({ key, pack, popular }) => (
              <div
                key={key}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg ${
                  popular
                    ? 'border-primary bg-primary/5 scale-105'
                    : 'border-base-300 bg-base-200 hover:border-primary/50'
                }`}
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium bg-primary text-white">
                    BEST VALUE
                  </div>
                )}
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Gem className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">{pack.coins} Coins</h4>
                  <div className="mb-4">
                    <span className="text-2xl font-bold">
                      {formatCurrency(pack.price)}
                    </span>
                    <div className="text-sm opacity-70">
                      <span className="line-through">{formatCurrency(pack.originalPrice)}</span>
                      <span className="ml-1 text-primary font-medium">
                        {calculateDiscount(pack.originalPrice, pack.price)}% off
                      </span>
                    </div>
                  </div>
                  <button 
                    className={`btn w-full ${popular ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handlePackageSelect(key)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Buy Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-sm opacity-70 border-t border-base-300 pt-4">
            <p>Secure payments powered by Razorpay</p>
          </div>
        </div>
      </div>
    </div>
  );
}