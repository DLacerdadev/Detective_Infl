import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  useGetCampanha,
  useDeleteCampanha,
  useTransferirMestre,
  useRemoverMembro,
  useUpdateCampanha,
  type CampanhaMembro,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Crown, Users, Copy, ArrowLeft, Trash2,
  LogOut, UserCheck, Loader2, Pencil, Swords, Check, Dice5, Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RolagensTab from "@/components/RolagensTab";
import PersonagensTab from "@/components/PersonagensTab";

function memberName(m: { firstName?: string | null; lastName?: string | null; email: string }) {
  if (m.firstName || m.lastName) return [m.firstName, m.lastName].filter(Boolean).join(" ");
  return m.email;
}

function MemberRow({
  membro,
  isMestre,
  isMe,
  canManage,
  campanhaId,
}: {
  membro: CampanhaMembro;
  isMestre: boolean;
  isMe: boolean;
  canManage: boolean;
  campanhaId: string;
}) {
  const transferMut = useTransferirMestre(campanhaId);
  const removeMut = useRemoverMembro(campanhaId);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleTransfer = async () => {
    if (!confirm(`Transferir cargo de Mestre para ${memberName(membro)}? Você se tornará Jogador.`)) return;
    try {
      await transferMut.mutateAsync(membro.userId);
      toast({ title: "MESTRE TRANSFERIDO", description: `${memberName(membro)} agora comanda esta operação.` });
    } catch (e: any) {
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  };

  const handleRemove = async () => {
    const msg = isMe ? "Sair desta operação?" : `Remover ${memberName(membro)} da operação?`;
    if (!confirm(msg)) return;
    try {
      await removeMut.mutateAsync(membro.userId);
      if (isMe) setLocation("/campanhas");
      else toast({ title: "MEMBRO REMOVIDO", description: `${memberName(membro)} foi removido.` });
    } catch (e: any) {
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  };

  const isPending = transferMut.isPending || removeMut.isPending;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/30 last:border-0">
      <div className={`w-8 h-8 rounded-sm flex items-center justify-center text-xs font-display font-bold shrink-0 ${isMestre ? "bg-yellow-900/40 text-yellow-300 border border-yellow-700/50" : "bg-secondary/40 text-muted-foreground border border-border/40"}`}>
        {isMestre ? <Crown className="w-4 h-4" /> : memberName(membro).charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-foreground truncate">{memberName(membro)}</span>
          {isMe && <span className="text-[10px] font-display tracking-widest text-primary/70 uppercase">(você)</span>}
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">{membro.email}</span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Badge variant="outline" className={`text-[10px] font-display tracking-widest ${isMestre ? "border-yellow-700/60 text-yellow-400" : "border-border/50 text-muted-foreground"}`}>
          {isMestre ? "MESTRE" : "JOGADOR"}
        </Badge>

        {canManage && !isMestre && !isMe && (
          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-yellow-400" title="Transferir mestre" onClick={handleTransfer} disabled={isPending}>
            {transferMut.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserCheck className="w-3 h-3" />}
          </Button>
        )}

        {(canManage && !isMestre) || isMe ? (
          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" title={isMe ? "Sair" : "Remover"} onClick={handleRemove} disabled={isPending}>
            {removeMut.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : (isMe ? <LogOut className="w-3 h-3" /> : <Trash2 className="w-3 h-3" />)}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function EditDialog({
  open, onClose, campanhaId, nome, descricao,
}: {
  open: boolean; onClose: () => void; campanhaId: string; nome: string; descricao?: string | null;
}) {
  const [editNome, setEditNome] = useState(nome);
  const [editDesc, setEditDesc] = useState(descricao ?? "");
  const updateMut = useUpdateCampanha(campanhaId);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await updateMut.mutateAsync({ nome: editNome.trim(), descricao: editDesc.trim() || undefined });
      toast({ title: "OPERAÇÃO ATUALIZADA" });
      onClose();
    } catch (e: any) {
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="glass-panel border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display tracking-widest">EDITAR OPERAÇÃO</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Nome</Label>
            <Input value={editNome} onChange={e => setEditNome(e.target.value)}
              className="bg-secondary/30 border-border font-mono text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Briefing</Label>
            <Textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={3}
              className="bg-secondary/30 border-border font-mono text-sm resize-none" />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} disabled={updateMut.isPending}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!editNome.trim() || updateMut.isPending}>
            {updateMut.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type Tab = "membros" | "rolagens" | "agentes";

export default function CampanhaDetail() {
  const [, params] = useRoute("/campanhas/:id");
  const id = params?.id ?? "";
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { data: campanha, isLoading } = useGetCampanha(id);
  const deleteMut = useDeleteCampanha();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("rolagens");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground font-display tracking-widest animate-pulse">
        CARREGANDO OPERAÇÃO...
      </div>
    );
  }

  if (!campanha) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-destructive font-display tracking-widest">
        OPERAÇÃO NÃO ENCONTRADA
      </div>
    );
  }

  const myMembro = campanha.membros.find(m => m.userId === user?.id);
  const amMestre = myMembro?.papel === "mestre";
  const mestre = campanha.membros.find(m => m.papel === "mestre");
  const jogadores = campanha.membros.filter(m => m.papel !== "mestre");

  const handleCopyCode = () => {
    if (!campanha.codigoConvite) return;
    navigator.clipboard.writeText(campanha.codigoConvite);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm("Excluir esta operação permanentemente? Todos os dados serão perdidos.")) return;
    try {
      await deleteMut.mutateAsync(campanha.id);
      toast({ title: "OPERAÇÃO ENCERRADA", description: `"${campanha.nome}" foi removida dos registros.` });
      setLocation("/campanhas");
    } catch (e: any) {
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  };

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "rolagens", label: "Rolagens", icon: <Dice5 className="w-3.5 h-3.5" /> },
    { id: "agentes", label: "Agentes", icon: <Shield className="w-3.5 h-3.5" /> },
    { id: "membros", label: "Membros", icon: <Users className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
      <button
        onClick={() => setLocation("/campanhas")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 font-display text-sm tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" />
        OPERAÇÕES
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-border/50">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <Swords className="w-5 h-5 text-primary shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-display text-foreground tracking-widest truncate">{campanha.nome}</h1>
            {amMestre && (
              <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0" onClick={() => setEditOpen(true)}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
          {campanha.descricao && (
            <p className="text-muted-foreground font-sans text-sm ml-8">{campanha.descricao}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 border border-border/40 rounded-sm px-3 py-1.5 bg-secondary/20">
            <code className="font-mono text-sm tracking-[0.3em] text-foreground">
              {campanha.codigoConvite ?? "------"}
            </code>
            <Button size="icon" variant="ghost" className="h-5 w-5 text-muted-foreground hover:text-foreground" onClick={handleCopyCode}>
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>

          {amMestre && (
            <Button variant="outline" size="sm" onClick={handleDelete} disabled={deleteMut.isPending}
              className="border-destructive/40 text-destructive hover:bg-destructive/10 font-display tracking-wide text-xs">
              {deleteMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1.5" />}
              Encerrar
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-0.5 mb-6 border-b border-border/40">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 font-display text-xs tracking-widest uppercase transition-all border-b-2 -mb-px ${activeTab === tab.id
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "rolagens" && (
        <RolagensTab campanhaId={campanha.id} amMestre={amMestre} />
      )}

      {activeTab === "agentes" && (
        <PersonagensTab campanhaId={campanha.id} amMestre={amMestre} />
      )}

      {activeTab === "membros" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-display text-sm tracking-widest text-muted-foreground uppercase">
                Membros ({campanha.membros.length})
              </h2>
            </div>

            <div className="border border-border/50 rounded-sm bg-card/30 divide-y-0 px-4">
              {mestre && (
                <MemberRow
                  membro={mestre}
                  isMestre={true}
                  isMe={mestre.userId === user?.id}
                  canManage={amMestre}
                  campanhaId={campanha.id}
                />
              )}
              {jogadores.map(j => (
                <MemberRow
                  key={j.id}
                  membro={j}
                  isMestre={false}
                  isMe={j.userId === user?.id}
                  canManage={amMestre}
                  campanhaId={campanha.id}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-border/50 rounded-sm bg-card/30 p-4 space-y-2">
              <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-2">Informações</p>
              <div className="space-y-1.5 text-xs font-mono text-muted-foreground">
                <div className="flex justify-between">
                  <span>Criado em</span>
                  <span>{new Date(campanha.createdAt).toLocaleDateString("pt-BR")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mestre</span>
                  <span className="text-yellow-400">{mestre ? memberName(mestre) : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Jogadores</span>
                  <span>{jogadores.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Seu papel</span>
                  <span className={amMestre ? "text-yellow-400" : "text-foreground"}>
                    {amMestre ? "Mestre" : "Jogador"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {amMestre && (
        <EditDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          campanhaId={campanha.id}
          nome={campanha.nome}
          descricao={campanha.descricao}
        />
      )}
    </div>
  );
}
