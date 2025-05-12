'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';

interface ClientDataLoaderProps<T> {
  query: () => Promise<T>;
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode;
}

export function ClientDataLoader<T>({ query, children }: ClientDataLoaderProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await query();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar dados'));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [query]);

  return <>{children(data, loading, error)}</>;
}
