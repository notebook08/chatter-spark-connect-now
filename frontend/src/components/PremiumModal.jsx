import { X, Crown, Check, Zap } from 'lucide-react';
import { PREMIUM_PLANS } from '../config/payments';
import { formatCurrency, calculateDiscount } from '../utils/paymentHelpers';
import { usePayment } from '../hooks/usePayment';

export function PremiumModal({ isOpen, onClose, onSubscribe }) {
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

  const handlePlanSelect = async (planKey) => {
    await processPayment('premium', planKey);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 w-full max-w-4xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-full">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Upgrade to Premium</h2>
                <p className="opacity-70">Unlock unlimited features and enhanced experience</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="btn btn-ghost btn-circle"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Features Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Premium Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span className="text-sm opacity-70">{feature}</span>
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
                    ? 'border-primary bg-primary/5 scale-105'
                    : 'border-base-300 bg-base-200 hover:border-primary/50'
                }`}
              >
                {badge && (
                  <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium ${
                    popular 
                      ? 'bg-primary text-white' 
                      : 'bg-accent text-white'
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
                    <div className="text-sm opacity-70">
                      <span className="line-through">{formatCurrency(plan.originalPrice)}</span>
                      <span className="ml-1 text-primary font-medium">
                        {calculateDiscount(plan.originalPrice, plan.price)}% off
                      </span>
                    </div>
                  </div>
                  <button 
                    className={`btn w-full ${popular ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handlePlanSelect(key)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Select'}
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