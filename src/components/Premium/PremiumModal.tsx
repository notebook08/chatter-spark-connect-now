import { X, Crown, Check, Zap } from 'lucide-react';
import { PREMIUM_PLANS } from '../../config/payments';
import { formatCurrency, calculateDiscount } from '../../utils/paymentHelpers';
import { usePayment } from '../../hooks/usePayment';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe?: (plan: string) => void;
}

export function PremiumModal({ isOpen, onClose, onSubscribe }: PremiumModalProps) {
  const { processPayment, isProcessing } = usePayment({
    onSuccess: (result) => {
      onSubscribe?.('premium');
      onClose();
    },
    onError: (error) => {
      console.error('Premium subscription failed:', error);
    }
  });

  if (!isOpen) return null;

  const plans = [
    { key: 'day', plan: PREMIUM_PLANS.day, badge: 'Limited Time', popular: false },
    { key: 'week', plan: PREMIUM_PLANS.week, badge: 'Most Popular', popular: true },
    { key: 'month', plan: PREMIUM_PLANS.month, badge: 'Best Value', popular: false },
    { key: 'lifetime', plan: PREMIUM_PLANS.lifetime, badge: 'VIP', popular: false }
  ];

  const features = [
    'Choose gender preference',
    'Unlimited call time',
    'Priority queue access',
    'Ad-free experience',
    'Premium customer support'
  ];

  const handlePlanSelect = async (planKey: string) => {
    await processPayment('premium', planKey);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Upgrade to Premium</h2>
                <p className="text-gray-600 dark:text-gray-400">Unlock unlimited features and enhanced experience</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Features Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              Premium Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {plans.map(({ key, plan, badge, popular }) => (
              <div
                key={key}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg ${
                  popular
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-blue-300'
                }`}
              >
                {badge && (
                  <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium ${
                    popular 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-purple-500 text-white'
                  }`}>
                    {badge}
                  </div>
                )}
                
                <div className="text-center">
                  <h4 className="font-semibold mb-2">{plan.duration}</h4>
                  <div className="mb-4">
                    <span className="text-2xl font-bold">
                      {formatCurrency(plan.price)}
                    </span>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="line-through">{formatCurrency(plan.originalPrice)}</span>
                      <span className="ml-1 text-blue-500 font-medium">
                        {calculateDiscount(plan.originalPrice, plan.price)}% off
                      </span>
                    </div>
                  </div>
                  <button 
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      popular 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => handlePlanSelect(key)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Select'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
            <p>Secure payments powered by Razorpay</p>
          </div>
        </div>
      </div>
    </div>
  );
}