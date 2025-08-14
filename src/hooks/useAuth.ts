import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface AuthUser extends User {
  user_metadata?: {
    role?: 'admin' | 'consultant';
    name?: string;
  };
}

interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'consultant';
  name: string;
  is_active: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user?.email) {
        // Buscar perfil do usuário na tabela users
        await loadUserProfile(user.email);
      }
      
      setLoading(false);
    };

    getUser();

    // Escutar mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
          role: 'admin',
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
    
    // Verificar no perfil do banco
    return userProfile?.role === 'admin' && userProfile?.is_active;
  };

  const isConsultant = () => {
    return userProfile?.role === 'consultant' && userProfile?.is_active;
  };

  const getUserRole = (): 'admin' | 'consultant' | null => {
    if (isAdmin()) return 'admin';
    if (isConsultant()) return 'consultant';
    return null;
  };

  const getUserName = (): string => {
    return userProfile?.name || user?.email || 'Usuário';
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
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
