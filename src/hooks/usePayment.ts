import { useState } from 'react';
import toast from 'react-hot-toast';
import { RAZORPAY_CONFIG } from '../config/payments';
import { loadRazorpayScript, generateOrderId } from '../utils/paymentHelpers';

interface UsePaymentProps {
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
}

export const usePayment = ({ onSuccess, onError }: UsePaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processPayment = async (type: 'coins' | 'premium', planKey: string) => {
    setIsProcessing(true);
    
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Get plan details
      let amount: number, description: string;
      if (type === 'coins') {
        const { COIN_PACKAGES } = await import('../config/payments');
        const pack = COIN_PACKAGES[planKey as keyof typeof COIN_PACKAGES];
        amount = pack.price * 100; // Convert to paise
        description = `${pack.coins} Coins - ${pack.name}`;
      } else if (type === 'premium') {
        const { PREMIUM_PLANS } = await import('../config/payments');
        const plan = PREMIUM_PLANS[planKey as keyof typeof PREMIUM_PLANS];
        amount = plan.price * 100; // Convert to paise
        description = `Premium ${plan.duration}`;
      } else {
        throw new Error('Invalid payment type');
      }

      const orderId = generateOrderId();

      const options = {
        key: RAZORPAY_CONFIG.keyId,
        amount: amount,
        currency: RAZORPAY_CONFIG.currency,
        name: 'Streamify',
        description: description,
        order_id: orderId,
        handler: function (response: any) {
          toast.success('Payment successful! 🎉');
          onSuccess?.(response);
        },
        prefill: {
          name: 'User',
          email: 'user@example.com',
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return { processPayment, isProcessing };
};