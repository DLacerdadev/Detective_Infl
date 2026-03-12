import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  useListCampanhaPersonagens,
  useAdicionarPersonagem,
  useRemoverPersonagemDaCampanha,
  type CampanhaPersonagemEntry,
} from "@workspace/api-client-react";
import { useListCharacters } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  UserPlus, Trash2, Loader2, Users, ShieldCheck, Skull,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function ownerName(entry: CampanhaPersonagemEntry): string {
  return entry.userFirstName ?? entry.userEmail.split("@")[0];
}

function StatBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm border ${color}`}>
      {label} {value}
    </span>
  );
}

function AgentRow({
  entry,
  canRemove,
  campanhaId,
}: {
  entry: CampanhaPersonagemEntry;
  canRemove: boolean;
  campanhaId: string;
}) {
  const removerMut = useRemoverPersonagemDaCampanha(campanhaId);
  const { toast } = useToast();

  const handleRemove = async () => {
    if (!confirm(`Remover ${entry.personagemNome} da operação?`)) return;
    try {
      await removerMut.mutateAsync(entry.personagemId);
      toast({ title: "AGENTE REMOVIDO", description: `${entry.personagemNome} foi retirado da operação.` });
    } catch (e: any) {
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="flex items-start gap-3 py-4 border-b border-border/30 last:border-0">
      <div className="w-10 h-10 rounded-sm bg-secondary/40 border border-border/40 flex items-center justify-center text-sm font-display font-bold text-muted-foreground shrink-0">
        {entry.personagemNome.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-sm text-foreground font-semibold">{entry.personagemNome}</span>
          {entry.classeNome && (
            <Badge variant="outline" className="text-[10px] font-display tracking-widest border-border/50 text-muted-foreground">
              {entry.classeNome}
            </Badge>
          )}
          <Badge variant="outline" className="text-[10px] font-mono border-primary/40 text-primary/80">
            NEX {entry.personagemNex}%
          </Badge>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          <StatBadge label="FOR" value={entry.personagemForca} color="bg-red-900/30 border-red-700/40 text-red-300" />
          <StatBadge label="AGI" value={entry.personagemAgilidade} color="bg-green-900/30 border-green-700/40 text-green-300" />
          <StatBadge label="INT" value={entry.personagemIntelecto} color="bg-blue-900/30 border-blue-700/40 text-blue-300" />
          <StatBadge label="VIG" value={entry.personagemVigor} color="bg-amber-900/30 border-amber-700/40 text-amber-300" />
          <StatBadge label="PRE" value={entry.personagemPresenca} color="bg-purple-900/30 border-purple-700/40 text-purple-300" />
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> DEF {entry.personagemDefesa}
          </span>
          {entry.personagemPvAtual != null && entry.personagemPvMaximo != null && (
            <span className="flex items-center gap-1">
              <Skull className="w-3 h-3 text-red-500/60" /> PV {entry.personagemPvAtual}/{entry.personagemPvMaximo}
            </span>
          )}
          <span className="text-muted-foreground/60">— {ownerName(entry)}</span>
        </div>
      </div>

      {canRemove && (
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
          onClick={handleRemove}
          disabled={removerMut.isPending}
          title="Remover agente"
        >
          {removerMut.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        </Button>
      )}
    </div>
  );
}

function AddAgentDialog({
  open,
  onClose,
  campanhaId,
  existingPersonagemIds,
}: {
  open: boolean;
  onClose: () => void;
  campanhaId: string;
  existingPersonagemIds: Set<string>;
}) {
  const { data: myChars = [] } = useListCharacters();
  const adicionarMut = useAdicionarPersonagem(campanhaId);
  const { toast } = useToast();

  const available = useMemo(
    () => myChars.filter((c) => !existingPersonagemIds.has(c.id)),
    [myChars, existingPersonagemIds],
  );

  const handleAdd = async (personagemId: string, nome: string) => {
    try {
      await adicionarMut.mutateAsync(personagemId);
      toast({ title: "AGENTE ADICIONADO", description: `${nome} entrou para a operação.` });
      onClose();
    } catch (e: any) {
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="glass-panel border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display tracking-widest">DESIGNAR AGENTE</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-2 max-h-80 overflow-y-auto">
          {available.length === 0 ? (
            <p className="text-sm font-mono text-muted-foreground text-center py-4">
              {myChars.length === 0
                ? "Você não tem personagens cadastrados."
                : "Todos os seus personagens já estão nesta operação."}
            </p>
          ) : (
            available.map((c) => (
              <button
                key={c.id}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm border border-border/40 bg-secondary/20 hover:bg-secondary/40 hover:border-border/70 transition-all text-left"
                onClick={() => handleAdd(c.id, c.nome)}
                disabled={adicionarMut.isPending}
              >
                <div className="w-8 h-8 rounded-sm bg-secondary/50 border border-border/50 flex items-center justify-center text-xs font-display font-bold text-muted-foreground shrink-0">
                  {c.nome.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-foreground">{c.nome}</span>
                    {c.classe?.nome && (
                      <span className="text-[10px] font-display text-muted-foreground">{c.classe.nome}</span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">NEX {c.nex}%</span>
                </div>
                <UserPlus className="w-4 h-4 text-primary/60 shrink-0" />
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PersonagensTab({
  campanhaId,
  amMestre,
}: {
  campanhaId: string;
  amMestre: boolean;
}) {
  const { user } = useAuth();
  const { data: entries = [], isLoading } = useListCampanhaPersonagens(campanhaId);
  const [addOpen, setAddOpen] = useState(false);

  const existingPersonagemIds = useMemo(
    () => new Set(entries.map((e) => e.personagemId)),
    [entries],
  );

  const myOwnInCampaign = useMemo(
    () => entries.filter((e) => e.userId === user?.id),
    [entries, user?.id],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground font-display tracking-widest animate-pulse text-xs">
        CARREGANDO AGENTES...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-display text-sm tracking-widest text-muted-foreground uppercase">
              Agentes na Operação ({entries.length})
            </h2>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="font-display tracking-widest text-xs border-primary/40 text-primary hover:bg-primary/10"
            onClick={() => setAddOpen(true)}
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            Designar
          </Button>
        </div>

        <div className="border border-border/50 rounded-sm bg-card/30 px-4">
          {entries.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <Users className="w-8 h-8 text-muted-foreground/30 mx-auto" />
              <p className="text-sm font-mono text-muted-foreground">Nenhum agente designado para esta operação.</p>
              <p className="text-[11px] font-mono text-muted-foreground/60">Use o botão "Designar" para adicionar seus personagens.</p>
            </div>
          ) : (
            entries.map((entry) => {
              const canRemove = amMestre || entry.userId === user?.id;
              return (
                <AgentRow
                  key={entry.id}
                  entry={entry}
                  canRemove={canRemove}
                  campanhaId={campanhaId}
                />
              );
            })
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="border border-border/50 rounded-sm bg-card/30 p-4 space-y-2">
          <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-3">Resumo</p>
          <div className="space-y-1.5 text-xs font-mono text-muted-foreground">
            <div className="flex justify-between">
              <span>Total de agentes</span>
              <span className="text-foreground">{entries.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Seus agentes</span>
              <span className="text-foreground">{myOwnInCampaign.length}</span>
            </div>
            {amMestre && (
              <div className="flex justify-between">
                <span>Jogadores</span>
                <span className="text-foreground">
                  {new Set(entries.map((e) => e.userId)).size}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="border border-border/50 rounded-sm bg-card/30 p-4 space-y-2">
          <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-2">Permissões</p>
          <div className="space-y-1 text-[11px] font-mono text-muted-foreground/70">
            <p>• Qualquer membro pode designar seus próprios agentes</p>
            {amMestre && <p className="text-yellow-400/70">• Mestre pode remover qualquer agente</p>}
            {!amMestre && <p>• Você pode remover apenas seus agentes</p>}
          </div>
        </div>
      </div>

      <AddAgentDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        campanhaId={campanhaId}
        existingPersonagemIds={existingPersonagemIds}
      />
    </div>
  );
}
