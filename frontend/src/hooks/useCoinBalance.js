import { useState, useEffect } from 'react';

export const useCoinBalance = () => {
  const [balance, setBalance] = useState(100); // Default starting balance
  const [loading, setLoading] = useState(false);

  // Load balance from localStorage on mount
  useEffect(() => {
    const savedBalance = localStorage.getItem('coinBalance');
    if (savedBalance) {
      setBalance(parseInt(savedBalance, 10));
    }
  }, []);

  // Save balance to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('coinBalance', balance.toString());
  }, [balance]);

  const addCoins = (amount) => {
    setBalance(prev => prev + amount);
  };

  const spendCoins = (amount) => {
    setBalance(prev => Math.max(0, prev - amount));
  };

  return {
    balance,
    loading,
    addCoins,
    spendCoins
  };
};