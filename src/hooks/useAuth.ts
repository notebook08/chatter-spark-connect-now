import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const checkAuth = async () => {
      try {
        // For demo purposes, we'll simulate a logged-in user
        const mockUser = {
          id: '1',
          username: 'demo_user',
          email: 'demo@example.com'
        };
        setUser(mockUser);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const isAuthenticated = !!user;

  return {
    user,
    isAuthenticated,
    loading
  };
};