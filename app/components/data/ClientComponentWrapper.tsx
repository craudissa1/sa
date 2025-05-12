'use client';

import React from 'react';

// Componente de wrapper para garantir que o código
// que acessa o supabaseClient só execute no lado do cliente
export function ClientComponentWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return <>{children}</>;
} 