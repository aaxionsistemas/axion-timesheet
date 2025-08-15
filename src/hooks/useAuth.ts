import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface AuthUser extends User {
  user_metadata: {
    role?: 'admin' | 'consultant';
    name?: string;
  } & Record<string, unknown>;
}

interface UserProfile {
  id: string;
  email: string;
  role: 'view' | 'consultant' | 'admin' | 'master_admin';
  name: string;
  is_active: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado e sessão válida
    const getUser = async () => {
      try {
        // Verificar sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        const { data: { user } } = await supabase.auth.getUser();
        
        // Se não há sessão válida ou usuário, limpar estado
        if (!session || !user) {
          setUser(null);
          setUserProfile(null);
          setLoading(false);
          return;
        }
        
        setUser(user);
        
        if (user?.email) {
          // Buscar perfil do usuário na tabela users
          await loadUserProfile(user.email);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    };

    getUser();

    // Escutar mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        const authUser = session?.user ?? null;
        setUser(authUser);
        
        if (authUser?.email) {
          await loadUserProfile(authUser.email);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (email: string) => {
    try {
      // Primeiro, verificar se é o admin master
      if (email === 'joao.nunes@axionsistemas.com') {
        setUserProfile({
          id: 'master-admin',
          email: email,
          role: 'master_admin',
          name: 'João Nunes (Admin Master)',
          is_active: true
        });
        return;
      }

      // Buscar na tabela users
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        return;
      }

      if (data) {
        setUserProfile({
          id: data.id,
          email: data.email,
          role: data.role,
          name: data.name,
          is_active: data.is_active
        });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const isAdmin = () => {
    // Admin master sempre tem acesso
    if (user?.email === 'joao.nunes@axionsistemas.com') {
      return true;
    }
    
    // Verificar no perfil do banco (admin ou master_admin)
    return (userProfile?.role === 'admin' || userProfile?.role === 'master_admin') && userProfile?.is_active;
  };

  const isConsultant = () => {
    return userProfile?.role === 'consultant' && userProfile?.is_active;
  };

  const getUserRole = (): 'view' | 'consultant' | 'admin' | 'master_admin' | null => {
    if (userProfile?.role) return userProfile.role;
    if (isAdmin()) return 'admin';
    if (isConsultant()) return 'consultant';
    return null;
  };

  const getUserName = (): string => {
    return userProfile?.name || user?.email || 'Usuário';
  };

  const signOut = async () => {
    try {
      // Limpar o estado imediatamente
      setUserProfile(null);
      setUser(null);
      
      // Fazer logout no Supabase com escopo global
      await supabase.auth.signOut({ scope: 'global' });
      
      // Limpar qualquer cache local
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      // Forçar reload completo da página para limpar qualquer estado
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      
      // Mesmo com erro, limpar tudo e redirecionar
      setUserProfile(null);
      setUser(null);
      
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      }
    }
  };

  return {
    user,
    userProfile,
    loading,
    isAdmin,
    isConsultant,
    getUserRole,
    getUserName,
    signOut,
  };
}
