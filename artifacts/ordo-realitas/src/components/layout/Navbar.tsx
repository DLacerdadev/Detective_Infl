import { Link } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, FileText } from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-8 justify-between">
        <Link href={isAuthenticated ? "/characters" : "/"} className="flex items-center space-x-2 group">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-sm shadow-sm group-hover:scale-110 transition-transform">
            <Shield className="h-5 w-5" />
          </div>
          <span className="font-display font-bold text-xl tracking-widest text-foreground group-hover:text-primary transition-colors">
            ORDO <span className="text-primary">REALITAS</span>
          </span>
        </Link>

        {isAuthenticated && (
          <nav className="flex items-center space-x-4">
            <Link href="/characters" className="text-sm font-display uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Arquivos
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin" className="text-sm font-display uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                Administração
              </Link>
            )}
            
            <div className="h-6 w-px bg-border mx-2 hidden sm:block"></div>
            
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-display tracking-wider text-foreground leading-none">{user?.username || "Agente"}</span>
                <span className="text-xs text-primary font-display uppercase tracking-widest">{user?.role === 'admin' ? 'Veríssimo' : 'Operador'}</span>
              </div>
              <Button variant="outline" size="icon" onClick={logout} title="Desconectar" className="border-border/50 hover:bg-destructive/20 hover:text-destructive hover:border-destructive/50 transition-colors">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
