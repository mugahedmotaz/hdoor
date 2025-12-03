import { useState, useEffect } from 'react';
import { dataClient } from '@/lib/dataClient';

interface User {
 id: string;
 email: string;
 role?: string;
}

export function useAuth() {
 const [user, setUser] = useState<User | null>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  const checkAuth = async () => {
   try {
    const { data } = await dataClient.getSession();
    setUser(data.session?.user || null);
   } catch (error) {
    setUser(null);
   } finally {
    setLoading(false);
   }
  };

  checkAuth();
 }, []);

 return { user, loading };
}
