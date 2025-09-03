import { useState, useEffect } from 'react';

export const useCoinBalance = () => {
  const [balance, setBalance] = useState(100); // Default starting balance
  const [loading, setLoading] = useState(false);

  // Load balance from localStorage on mount
  useEffect(() => {
    const savedBalance = localStorage.getItem('coin-balance');
    if (savedBalance) {
      setBalance(parseInt(savedBalance, 10));
    }
  }, []);

  // Save balance to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('coin-balance', balance.toString());
  }, [balance]);

  const addCoins = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const spendCoins = (amount: number): boolean => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      return true;
    }
    return false;
  };

  const hasEnoughCoins = (amount: number): boolean => {
    return balance >= amount;
  };

  return {
    balance,
    loading,
    addCoins,
    spendCoins,
    hasEnoughCoins
  };
};