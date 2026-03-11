import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, BookOpen, Skull } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      setLocation("/characters");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={`${import.meta.env.BASE_URL}images/noir-office-bg.png`} 
          alt="Dark detective office" 
          className="w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 container max-w-4xl mx-auto px-6 text-center"
      >
        <ShieldAlert className="w-24 h-24 mx-auto text-primary mb-8 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
        
        <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 tracking-tight">
          A VERDADE É <span className="text-primary">INACESSÍVEL</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground font-sans max-w-2xl mx-auto mb-10 leading-relaxed italic">
          "O que você não sabe não pode te machucar. Mas o que você não sabe pode te matar. Junte-se à Ordo Realitas e proteja a membrana."
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
          <div className="glass-panel p-6 rounded-sm text-left border-t-2 border-t-primary">
            <BookOpen className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-display text-xl text-foreground mb-2 tracking-wider">Arquivos Confidenciais</h3>
            <p className="text-muted-foreground text-sm font-sans">Gerencie os dossiês de seus agentes. Atributos, perícias, sanidade. Tudo documentado.</p>
          </div>
          <div className="glass-panel p-6 rounded-sm text-left border-t-2 border-t-primary">
            <Skull className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-display text-xl text-foreground mb-2 tracking-wider">Combate ao Oculto</h3>
            <p className="text-muted-foreground text-sm font-sans">Prepare-se para o pior. Mesas virtuais interativas em desenvolvimento para a equipe.</p>
          </div>
        </div>

        <Button 
          size="lg" 
          onClick={() => setLocation("/login")}
          className="text-lg px-12 py-6 animate-pulse hover:animate-none hover:scale-105 transition-transform"
        >
          Acessar Terminal da Ordem
        </Button>
      </motion.div>
    </div>
  );
}
