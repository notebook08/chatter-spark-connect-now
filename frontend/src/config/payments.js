// Razorpay Configuration
export const RAZORPAY_CONFIG = {
  keyId: 'rzp_live_4Ud6wv8v2YJvbw',
  keySecret: 'yaVy8W6K83XK9IXPWGJYo88D',
  currency: 'INR'
};

// Coin Packages
export const COIN_PACKAGES = {
  small: {
    coins: 50,
    price: 99,
    originalPrice: 149,
    name: 'Starter Pack',
    description: '50 coins for voice calls'
  },
  medium: {
    coins: 150,
    price: 249,
    originalPrice: 399,
    name: 'Popular Pack',
    description: '150 coins + 20% bonus'
  },
  large: {
    coins: 350,
    price: 499,
    originalPrice: 799,
    name: 'Value Pack',
    description: '350 coins + 40% bonus'
  }
};

// Premium Plans
export const PREMIUM_PLANS = {
  day: {
    duration: '1 Day',
    price: 49,
    originalPrice: 99,
    features: ['Unlimited calls', 'No ads', 'Priority matching']
  },
  week: {
    duration: '1 Week',
    price: 199,
    originalPrice: 349,
    features: ['Unlimited calls', 'No ads', 'Priority matching', 'Gender preference']
  },
  month: {
    duration: '1 Month',
    price: 599,
    originalPrice: 999,
    features: ['Unlimited calls', 'No ads', 'Priority matching', 'Gender preference', 'Premium support']
  },
  lifetime: {
    duration: 'Lifetime',
    price: 1999,
    originalPrice: 4999,
    features: ['All premium features', 'Lifetime access', 'VIP support']
  }
};