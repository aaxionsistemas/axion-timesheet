"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      window.location.href = "/dashboard";
    }
    setLoading(false);
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

  return (
    <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-card border border-border mx-auto mt-24">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold axion-gradient bg-clip-text text-transparent">Axion Timesheet</h1>
        <p className="text-muted-foreground mt-2">Acesse sua conta</p>
      </div>
      {showReset ? (
        <form className="space-y-6" onSubmit={handleReset}>
          <div className="space-y-2">
            <Label htmlFor="resetEmail">E-mail</Label>
            <Input type="email" id="resetEmail" name="resetEmail" placeholder="Digite seu e-mail" required value={resetEmail} onChange={e => setResetEmail(e.target.value)} />
          </div>
          {resetMsg && <div className="text-sm text-center text-muted-foreground">{resetMsg}</div>}
          <Button type="submit" className="w-full bg-axion-gradient text-white font-semibold text-lg shadow-lg transition-all hover:scale-105">Enviar link de redefinição</Button>
          <Button type="button" variant="outline" className="w-full" onClick={() => setShowReset(false)}>Voltar ao login</Button>
        </form>
      ) : (
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input type="email" id="email" name="email" placeholder="Digite seu e-mail" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input type="password" id="password" name="password" placeholder="Digite sua senha" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <Button type="submit" className="w-full bg-axion-gradient text-white font-semibold text-lg shadow-lg transition-all hover:scale-105" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
          <Button type="button" variant="link" className="w-full text-xs mt-2" onClick={() => setShowReset(true)}>
            Esqueci minha senha
          </Button>
        </form>
      )}
    </div>
  );
} 