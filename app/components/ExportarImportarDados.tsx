
'use client';

import { useState, useCallback } from 'react';
import { AlertCircle, CheckCircle, Info, HelpCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/Button';

// Este componente foi significativamente simplificado.
// A funcionalidade de exportação/importação de dados foi removida
// pois a sincronização de dados agora é gerenciada pelo Supabase.

export const ExportarImportarDados = () => {
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<'success' | 'error' | 'info'>('info');
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');

  const showStatusMessage = useCallback((msg: string, type: 'success' | 'error' | 'info', currentStatus: 'idle' | 'loading') => {
    setMensagem(msg);
    setTipoMensagem(type);
    setStatus(currentStatus);
    setTimeout(() => {
      if (currentStatus !== 'loading') {
         setStatus('idle');
         setMensagem('');
         setTipoMensagem('info');
      }
    }, 7000);
  }, []);

  // Placeholder para futuras funcionalidades ou informações
  const handlePlaceholderAction = () => {
    showStatusMessage('Esta funcionalidade está sendo repensada para integração com Supabase.', 'info', 'idle');
  };

  const isLoading = status === 'loading';

  return (
    <>
      <div className="w-full max-w-lg mx-auto bg-card text-card-foreground rounded-lg shadow-md p-6 border">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Sincronização de Dados</h2>
            <Link href="/perfil/ajuda" className="text-primary hover:underline flex items-center" title="Ajuda">
              <HelpCircle size={16} />
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            Seus dados são sincronizados automaticamente com o Supabase.
          </p>
        </div>

        {mensagem && (
          <div className={`mb-4 flex items-start gap-3 p-3 rounded-md text-sm border ${
            tipoMensagem === 'success' ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300' :
            tipoMensagem === 'error' ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300' :
            'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300'
          }`}>
            {tipoMensagem === 'success' ? <CheckCircle className="flex-shrink-0 mt-0.5" size={18} /> :
             tipoMensagem === 'error' ? <AlertCircle className="flex-shrink-0 mt-0.5" size={18} /> :
             <Info className="flex-shrink-0 mt-0.5" size={18} />}
            <span className="flex-grow">{mensagem}</span>
            {isLoading && <Loader2 className="animate-spin ml-2 flex-shrink-0" size={18} />}
          </div>
        )}

        <div className="space-y-6">
          <div className="text-center p-4 border rounded-md">
            <Info size={24} className="mx-auto mb-2 text-blue-500" />
            <p className="text-sm text-muted-foreground">
              A sincronização de dados entre seus dispositivos é automática e segura através do Supabase.
              Não há necessidade de exportar ou importar dados manualmente.
            </p>
            {/* <Button onClick={handlePlaceholderAction} disabled={isLoading} variant="outline" className="mt-4">
              Verificar Status da Sincronização (Em breve)
            </Button> */}
          </div>
        </div>
      </div>
    </>
  );
};

