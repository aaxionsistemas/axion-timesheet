"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (!authLoading && user) {
      const redirectTo = searchParams?.get('redirect') || '/dashboard';
      router.push(redirectTo);
    }
  }, [user, authLoading, router, searchParams]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        console.log('Login successful, redirecting...');
        // Redirecionamento imediato
        const redirectTo = searchParams?.get('redirect') || '/dashboard';
        window.location.href = redirectTo;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro interno. Tente novamente.');
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setResetMsg("");
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: window.location.origin + "/login"
    });
    if (error) {
      setResetMsg("Erro: " + error.message);
    } else {
      setResetMsg("Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.");
    }
  }

  // Mostrar loading se estiver verificando autenticação
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#18181b]">
      {/* Lado esquerdo - Branding com corte diagonal */}
      <div className="hidden lg:flex lg:w-full relative overflow-hidden">
        {/* Background com corte diagonal */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800" 
             style={{
               clipPath: 'polygon(0 0, 58% 0, 38% 100%, 0 100%)'
             }}>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10"
             style={{
               clipPath: 'polygon(0 0, 58% 0, 38% 100%, 0 100%)'
             }}>
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-40 translate-y-40"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
        </div>
        
        {/* Brand Text - Posicionado à esquerda */}
        <div className="relative z-10 flex items-center h-full pl-16 pr-8 w-1/2">
          <div className="max-w-md ml-8">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Bem-vindo ao<br />
              <span className="text-blue-200">Axion Platform!</span>
            </h1>
            
            <p className="text-blue-100 text-xl leading-relaxed">
              Registre suas horas, acompanhe seus projetos e organize suas atividades de forma simples e eficiente.
            </p>
          </div>
        </div>

        {/* Lado direito - Login Form dentro do mesmo container */}
        <div className="relative z-20 flex items-start justify-center pt-16 p-8 w-1/2 ml-auto">
        <div className="w-full max-w-md space-y-8">
          {/* Logo Mobile */}
          <div className="lg:hidden text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-white font-bold text-2xl">Axion</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              {showReset ? "Redefinir Senha" : "Entre na sua conta"}
            </h2>
            <p className="text-gray-400">
              {showReset 
                ? "Digite seu e-mail para receber o link de redefinição" 
                : "Bem-vindo de volta! Entre com suas credenciais"}
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-[#23232b] p-8 rounded-2xl border border-[#2a2a2a] shadow-2xl">
          {showReset ? (
            <form className="space-y-6" onSubmit={handleReset}>
              <div className="space-y-2">
                <Label htmlFor="resetEmail" className="text-white font-medium">
                  E-mail
                </Label>
                <Input 
                  type="email" 
                  id="resetEmail" 
                  name="resetEmail" 
                  placeholder="seu@email.com" 
                  required 
                  value={resetEmail} 
                  onChange={e => setResetEmail(e.target.value)}
                  className="h-12 bg-[#18181b] border-[#333] text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
              </div>
              
              {resetMsg && (
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-blue-400 text-sm text-center">{resetMsg}</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-base rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Enviar Link de Redefinição
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-12 border-[#2a2a2a] text-gray-300 hover:bg-[#23232b] hover:text-white rounded-xl transition-all duration-300"
                onClick={() => setShowReset(false)}
              >
                Voltar ao Login
              </Button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">
                  E-mail
                </Label>
                <Input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="seu@email.com" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="h-12 bg-[#18181b] border-[#333] text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">
                  Senha
                </Label>
                <Input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="h-12 bg-[#18181b] border-[#333] text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
              </div>
              
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-base rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Entrando...
                  </div>
                ) : (
                  "Entrar"
                )}
              </Button>
              
              <div className="text-center">
                <Button 
                  type="button" 
                  variant="link" 
                  className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-300"
                  onClick={() => setShowReset(true)}
                >
                  Esqueci minha senha
                </Button>
              </div>
            </form>
          )}
        </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500">
              © 2024 Axion Sistemas. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginContent />
    </Suspense>
  );
} 