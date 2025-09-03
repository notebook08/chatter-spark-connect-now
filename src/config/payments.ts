// Razorpay Configuration
export const RAZORPAY_CONFIG = {
  keyId: 'rzp_live_4Ud6wv8v2YJvbw',
  keySecret: 'yaVy8W6K83XK9IXPWGJYo88D',
  currency: 'INR',
  company: {
    name: 'Streamify',
    description: 'Voice Chat & Dating App',
    logo: '/favicon.ico'
  }
};

// Coin Packages
export const COIN_PACKAGES = {
  small: {
    coins: 100,
    price: 99, // ₹99
    originalPrice: 149,
    description: 'Perfect for trying out voice calls'
  },
  medium: {
    coins: 300,
    price: 249, // ₹249
    originalPrice: 399,
    description: 'Great value for regular users'
  },
  large: {
    coins: 1000,
    price: 699, // ₹699
    originalPrice: 1199,
    description: 'Best value for power users'
  }
};

// Premium Plans
export const PREMIUM_PLANS = {
  day: {
    duration: '1 Day',
    price: 49, // ₹49
    originalPrice: 99,
    features: ['Unlimited calls', 'No ads', 'Priority matching']
  },
  week: {
    duration: '1 Week',
    price: 199, // ₹199
    originalPrice: 349,
    features: ['Unlimited calls', 'No ads', 'Priority matching', 'Advanced filters']
  },
  month: {
    duration: '1 Month',
    price: 599, // ₹599
    originalPrice: 999,
    features: ['Unlimited calls', 'No ads', 'Priority matching', 'Advanced filters', 'Premium support']
  },
  lifetime: {
    duration: 'Lifetime',
    price: 2999, // ₹2999
    originalPrice: 4999,
    features: ['All premium features', 'Lifetime access', 'VIP support', 'Early access to new features']
  }
};

// Voice call costs
export const VOICE_CALL_COST = {
  perMinute: 2, // 2 coins per minute
  minimumCost: 5 // minimum 5 coins per call
};