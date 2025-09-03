import { useState } from 'react';
import toast from 'react-hot-toast';
import { RAZORPAY_CONFIG } from '../config/payments';
import { loadRazorpayScript, generateOrderId } from '../utils/paymentHelpers';

export const usePayment = ({ onSuccess, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processPayment = async (type, planKey) => {
    setIsProcessing(true);
    
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Get plan details
      let amount, description;
      if (type === 'coins') {
        const { COIN_PACKAGES } = await import('../config/payments');
        const pack = COIN_PACKAGES[planKey];
        amount = pack.price * 100; // Convert to paise
        description = `${pack.coins} Coins - ${pack.name}`;
      } else if (type === 'premium') {
        const { PREMIUM_PLANS } = await import('../config/payments');
        const plan = PREMIUM_PLANS[planKey];
        amount = plan.price * 100; // Convert to paise
        description = `Premium ${plan.duration}`;
      }

      const orderId = generateOrderId();

      const options = {
        key: RAZORPAY_CONFIG.keyId,
        amount: amount,
        currency: RAZORPAY_CONFIG.currency,
        name: 'Streamify',
        description: description,
        order_id: orderId,
        handler: function (response) {
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

      const razorpay = new window.Razorpay(options);
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