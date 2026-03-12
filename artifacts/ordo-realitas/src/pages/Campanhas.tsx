import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  useListCampanhas,
  useCreateCampanha,
  useEntrarCampanha,
  type Campanha,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Plus, LogIn, Users, Crown, Calendar,
  Loader2, Swords, ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

function memberName(m: { firstName?: string | null; lastName?: string | null; email: string }) {
  if (m.firstName || m.lastName) return [m.firstName, m.lastName].filter(Boolean).join(" ");
  return m.email;
}

function CampaignCard({ campanha }: { campanha: Campanha }) {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const mestre = campanha.membros.find(m => m.papel === "mestre");
  const isMyMestr = mestre?.userId === user?.id;
  const jogadores = campanha.membros.filter(m => m.papel !== "mestre");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative border border-border/60 bg-card/50 rounded-sm cursor-pointer hover:border-primary/50 hover:bg-card/80 transition-all duration-200"
      onClick={() => setLocation(`/campanhas/${campanha.id}`)}
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-primary/0 group-hover:bg-primary/60 rounded-l-sm transition-all" />
      <div className="p-5 pl-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display text-lg tracking-widest text-foreground truncate">
                {campanha.nome}
              </h3>
              {isMyMestr && (
                <Crown className="w-4 h-4 text-yellow-400 shrink-0" />
              )}
            </div>
            {campanha.descricao && (
              <p className="text-sm text-muted-foreground line-clamp-2 font-sans">{campanha.descricao}</p>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {mestre && (
            <span className="flex items-center gap-1.5">
              <Crown className="w-3 h-3 text-yellow-500" />
              <span className="font-mono">{memberName(mestre)}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Users className="w-3 h-3" />
            <span className="font-mono">{campanha.membros.length} membro{campanha.membros.length !== 1 ? "s" : ""}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            <span className="font-mono">
              {new Date(campanha.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          </span>
          {campanha.codigoConvite && (
            <Badge variant="outline" className="text-[10px] font-mono tracking-widest border-border/60 text-muted-foreground">
              {campanha.codigoConvite}
            </Badge>
          )}
        </div>

        {jogadores.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {jogadores.map(j => (
              <span key={j.id} className="text-[10px] font-mono bg-secondary/30 border border-border/40 rounded-sm px-1.5 py-0.5 text-muted-foreground">
                {memberName(j)}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function CreateDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const createMut = useCreateCampanha();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleCreate = async () => {
    if (!nome.trim()) return;
    try {
      const camp = await createMut.mutateAsync({ nome: nome.trim(), descricao: descricao.trim() || undefined });
      toast({ title: "OPERAÇÃO CRIADA", description: `"${camp.nome}" foi registrada nos arquivos.` });
      onClose();
      setNome(""); setDescricao("");
      setLocation(`/campanhas/${camp.id}`);
    } catch (e: any) {
      toast({ title: "FALHA", description: e.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="glass-panel border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display tracking-widest">NOVA OPERAÇÃO</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Nome da operação *</Label>
            <Input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Operação Névoa Negra"
              className="bg-secondary/30 border-border font-mono text-sm" onKeyDown={e => e.key === "Enter" && handleCreate()} />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Briefing (opcional)</Label>
            <Textarea value={descricao} onChange={e => setDescricao(e.target.value)}
              placeholder="Descreva a missão, o cenário ou contexto..." rows={3}
              className="bg-secondary/30 border-border font-mono text-sm resize-none" />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} disabled={createMut.isPending}>Cancelar</Button>
          <Button onClick={handleCreate} disabled={!nome.trim() || createMut.isPending}>
            {createMut.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Criar Operação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function JoinDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [codigo, setCodigo] = useState("");
  const entrarMut = useEntrarCampanha();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleJoin = async () => {
    if (!codigo.trim()) return;
    try {
      const camp = await entrarMut.mutateAsync(codigo.trim());
      toast({ title: "ACESSO CONCEDIDO", description: `Você ingressou em "${camp.nome}".` });
      onClose(); setCodigo("");
      setLocation(`/campanhas/${camp.id}`);
    } catch (e: any) {
      toast({ title: "ACESSO NEGADO", description: e.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="glass-panel border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display tracking-widest">INGRESSAR EM OPERAÇÃO</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground font-sans">
            Insira o código de acesso fornecido pelo mestre da operação.
          </p>
          <div className="space-y-1">
            <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Código de acesso</Label>
            <Input value={codigo} onChange={e => setCodigo(e.target.value.toUpperCase())}
              placeholder="EX: A3B7K2" maxLength={12}
              className="bg-secondary/30 border-border font-mono text-lg tracking-widest text-center"
              onKeyDown={e => e.key === "Enter" && handleJoin()} />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} disabled={entrarMut.isPending}>Cancelar</Button>
          <Button onClick={handleJoin} disabled={!codigo.trim() || entrarMut.isPending}>
            {entrarMut.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogIn className="w-4 h-4 mr-2" />}
            Ingressar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Campanhas() {
  const { user } = useAuth();
  const { data: campanhas, isLoading } = useListCampanhas();
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  const mestreDe = campanhas?.filter(c => c.membros.some(m => m.userId === user?.id && m.papel === "mestre")) ?? [];
  const jogadorEm = campanhas?.filter(c => c.membros.some(m => m.userId === user?.id && m.papel !== "mestre")) ?? [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-border/50 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-display text-foreground tracking-widest mb-1">OPERAÇÕES</h1>
          <p className="text-muted-foreground font-sans text-sm">Campanhas ativas vinculadas ao agente {user?.firstName || user?.email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setJoinOpen(true)} className="border-border/60 font-display tracking-wide text-xs">
            <LogIn className="w-4 h-4 mr-2" />
            Ingressar
          </Button>
          <Button onClick={() => setCreateOpen(true)} className="shadow-[0_0_15px_rgba(220,38,38,0.3)] font-display tracking-wide text-xs">
            <Plus className="w-4 h-4 mr-2" />
            Nova Operação
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground font-display tracking-widest animate-pulse">
          ACESSANDO ARQUIVOS DE OPERAÇÕES...
        </div>
      ) : !campanhas?.length ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center">
            <Swords className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <div>
            <p className="font-display tracking-widest text-muted-foreground text-lg mb-1">SEM OPERAÇÕES ATIVAS</p>
            <p className="text-sm text-muted-foreground/60 font-sans">Crie uma nova operação ou ingresse em uma existente com um código de acesso.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {mestreDe.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-4 h-4 text-yellow-500" />
                <h2 className="text-[11px] font-display uppercase tracking-widest text-yellow-500/80">Sob seu comando</h2>
              </div>
              <AnimatePresence>
                <div className="space-y-3">
                  {mestreDe.map(c => <CampaignCard key={c.id} campanha={c} />)}
                </div>
              </AnimatePresence>
            </section>
          )}

          {jogadorEm.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-[11px] font-display uppercase tracking-widest text-muted-foreground">Como jogador</h2>
              </div>
              <AnimatePresence>
                <div className="space-y-3">
                  {jogadorEm.map(c => <CampaignCard key={c.id} campanha={c} />)}
                </div>
              </AnimatePresence>
            </section>
          )}
        </div>
      )}

      <CreateDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <JoinDialog open={joinOpen} onClose={() => setJoinOpen(false)} />
    </div>
  );
}
