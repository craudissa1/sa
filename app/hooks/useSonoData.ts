'use client';

import { useEffect } from 'react';
import { useSonoStore } from '../stores/sonoStore';
import { useAuthStore } from '../stores/authStore';

export function useSonoData() {
  const { user } = useAuthStore();
  const { fetchSonoData } = useSonoStore();

  useEffect(() => {
    if (user) {
      fetchSonoData(user.id);
    }
  }, [user, fetchSonoData]);

  return null;
}
