import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RAZORPAY_CONFIG, COIN_PACKAGES, PREMIUM_PLANS } from '@/config/payments';
import { generateOrderId, validatePaymentAmount } from '@/utils/paymentHelpers';

interface PaymentOptions {
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const usePayment = ({ onSuccess, onError }: PaymentOptions = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const processPayment = async (type: 'coins' | 'premium', packageKey: string) => {
    try {
      setIsProcessing(true);

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Get package details
      const packageData = type === 'coins' 
        ? COIN_PACKAGES[packageKey as keyof typeof COIN_PACKAGES]
        : PREMIUM_PLANS[packageKey as keyof typeof PREMIUM_PLANS];

      if (!packageData) {
        throw new Error('Invalid package selected');
      }

      // Validate amount
      if (!validatePaymentAmount(packageData.price)) {
        throw new Error('Invalid payment amount');
      }

      // Generate order ID
      const orderId = generateOrderId();

      // Razorpay options
      const options = {
        key: RAZORPAY_CONFIG.keyId,
        amount: packageData.price * 100, // Convert to paise
        currency: RAZORPAY_CONFIG.currency,
        name: RAZORPAY_CONFIG.company.name,
        description: type === 'coins' 
          ? `${packageData.coins} Coins Package`
          : `Premium ${packageData.duration} Plan`,
        image: RAZORPAY_CONFIG.company.logo,
        order_id: orderId,
        handler: (response: RazorpayResponse) => {
          // Payment successful
          toast({
            title: "Payment Successful! 🎉",
            description: type === 'coins' 
              ? `${packageData.coins} coins added to your account`
              : `Premium ${packageData.duration} plan activated`,
          });
          
          onSuccess?.(response);
        },
        prefill: {
          name: 'User',
          email: 'user@example.com',
        },
        notes: {
          type,
          package: packageKey,
          timestamp: new Date().toISOString()
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast({
              title: "Payment Cancelled",
              description: "Payment was cancelled by user",
              variant: "destructive"
            });
          }
        }
      };

      // Create Razorpay instance and open
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive"
      });
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processPayment,
    isProcessing
  };
};