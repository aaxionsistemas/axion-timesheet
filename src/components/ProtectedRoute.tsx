"use client";
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireConsultant?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  requireConsultant = false 
}: ProtectedRouteProps) {
  const { user, loading, isAdmin, isConsultant } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (!loading && user) {
      // Verificar permissões específicas
      if (requireAdmin && !isAdmin()) {
        console.log('Acesso negado - usuário não é admin:', user.email);
        router.push('/dashboard');
        return;
      }

      if (requireConsultant && !isConsultant()) {
        router.push('/dashboard');
        return;
      }
    }
  }, [user, loading, isAdmin, isConsultant, requireAdmin, requireConsultant, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirecionando para login
  }

  if (requireAdmin && !isAdmin()) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="bg-[#18181b] border border-red-500/30 max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="mx-auto mb-4 text-red-400" size={48} />
            <h2 className="text-xl font-bold text-red-400 mb-2">Acesso Negado</h2>
            <p className="text-foreground/70 mb-4">
              Você precisa ter permissões de administrador para acessar esta página.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Voltar ao Dashboard
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requireConsultant && !isConsultant()) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="bg-[#18181b] border border-yellow-500/30 max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="mx-auto mb-4 text-yellow-400" size={48} />
            <h2 className="text-xl font-bold text-yellow-400 mb-2">Acesso Restrito</h2>
            <p className="text-foreground/70 mb-4">
              Esta funcionalidade é específica para consultores.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Voltar ao Dashboard
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
