import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff } from "lucide-react";

type Mode = "login" | "register";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export default function Login() {
  const {
    login, register, loginWithGoogle,
    isAuthenticated, isLoading,
    isLoggingIn, isRegistering, isGoogleLoading,
  } = useAuth();
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/characters");
    }
  }, [isAuthenticated, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.email, form.password, form.firstName, form.lastName);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSuccess = async (response: { credential?: string }) => {
    if (!response.credential) return;
    setError(null);
    try {
      await loginWithGoogle(response.credential);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const isSubmitting = isLoggingIn || isRegistering || isGoogleLoading;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary text-primary-foreground p-3 rounded-sm shadow-lg mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="font-display font-bold text-3xl tracking-widest text-foreground">
            ORDO <span className="text-primary">REALITAS</span>
          </h1>
          <p className="text-muted-foreground font-mono text-xs tracking-widest mt-1 uppercase">
            Acesso Restrito
          </p>
        </div>

        {/* Card */}
        <div className="border border-border/60 bg-card/60 backdrop-blur-sm rounded-sm shadow-2xl p-8">

          {/* Google Sign-In — only shown when client ID is configured */}
          {GOOGLE_CLIENT_ID && (
            <>
              <div className="mb-5">
                <p className="text-xs text-muted-foreground font-display uppercase tracking-widest text-center mb-3">
                  Acesso rápido
                </p>
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError("Falha ao entrar com o Google. Tente novamente.")}
                    text="signin_with"
                    shape="rectangular"
                    theme="filled_black"
                    locale="pt-BR"
                    size="large"
                    width="360"
                  />
                </div>
              </div>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/40"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-card text-muted-foreground font-mono uppercase tracking-widest">
                    ou use email e senha
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Mode Tabs */}
          <div className="flex border border-border/50 rounded-sm mb-5 overflow-hidden">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(null); }}
              className={`flex-1 py-2.5 text-sm font-display uppercase tracking-widest transition-colors ${
                mode === "login"
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setError(null); }}
              className={`flex-1 py-2.5 text-sm font-display uppercase tracking-widest transition-colors ${
                mode === "register"
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="font-display text-xs uppercase tracking-widest text-muted-foreground">
                    Nome
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="João"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="bg-background/50 border-border/50 font-mono text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="font-display text-xs uppercase tracking-widest text-muted-foreground">
                    Sobrenome
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Silva"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="bg-background/50 border-border/50 font-mono text-sm"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-display text-xs uppercase tracking-widest text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="agente@email.com"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-background/50 border-border/50 font-mono text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="font-display text-xs uppercase tracking-widest text-muted-foreground">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="bg-background/50 border-border/50 font-mono text-sm pr-10"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {mode === "register" && (
                <p className="text-xs text-muted-foreground font-mono">Mínimo de 6 caracteres</p>
              )}
            </div>

            {error && (
              <div className="border border-destructive/50 bg-destructive/10 text-destructive text-sm font-mono px-3 py-2 rounded-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 font-display uppercase tracking-widest text-sm"
            >
              {isSubmitting
                ? (mode === "login" ? "Verificando..." : "Criando conta...")
                : (mode === "login" ? "Acessar a Ordem" : "Criar Conta")}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground font-mono mt-6">
          "O que você não sabe pode te matar."
        </p>
      </div>
    </div>
  );
}
