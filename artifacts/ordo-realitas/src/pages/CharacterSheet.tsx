import { useGetCharacter } from "@workspace/api-client-react";
import { useRoute, useLocation } from "wouter";
import { useState } from "react";
import { useUpdateCharacterMut } from "@/hooks/use-api-mutations";
import CharacterPericiasTab from "@/components/CharacterPericiasTab";
import CharacterHabilidadesTab from "@/components/CharacterHabilidadesTab";
import {
  ArrowLeft, Shield, Skull, BookOpen, Backpack, ScrollText,
  Pencil, Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

type Tab = "pericias" | "habilidades" | "rituais" | "inventario" | "historia";

const ATTR_COLOR: Record<string, string> = {
  FOR: "border-red-700/60 bg-red-900/20 text-red-300",
  AGI: "border-green-700/60 bg-green-900/20 text-green-300",
  INT: "border-blue-700/60 bg-blue-900/20 text-blue-300",
  VIG: "border-amber-700/60 bg-amber-900/20 text-amber-300",
  PRE: "border-purple-700/60 bg-purple-900/20 text-purple-300",
};

function VitalBar({
  label, short, current, max, color, onDec, onInc,
}: {
  label: string; short: string; current: number; max: number;
  color: string; onDec: () => void; onInc: () => void;
}) {
  const pct = Math.max(0, Math.min(100, (current / (max || 1)) * 100));
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-display tracking-widest text-muted-foreground uppercase">{label}</span>
        <span className="font-mono text-xs text-foreground">{current} / {max}</span>
      </div>
      <div className="relative h-2 bg-secondary/40 rounded-sm overflow-hidden border border-border/30">
        <div className={`h-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex gap-1">
        <button
          onClick={onDec}
          className="flex-1 py-0.5 text-xs font-display border border-border/40 rounded-sm hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors"
        >−</button>
        <span className="text-[10px] font-mono text-muted-foreground/60 w-8 text-center leading-5">{short}</span>
        <button
          onClick={onInc}
          className="flex-1 py-0.5 text-xs font-display border border-border/40 rounded-sm hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors"
        >+</button>
      </div>
    </div>
  );
}

function EditCharDialog({
  open, onClose, char, charId,
}: {
  open: boolean;
  onClose: () => void;
  char: { nome: string; historia?: string | null };
  charId: string;
}) {
  const [nome, setNome] = useState(char.nome);
  const [historia, setHistoria] = useState(char.historia ?? "");
  const updateMut = useUpdateCharacterMut(charId);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await updateMut.mutateAsync({ id: charId, data: { nome: nome.trim(), historia: historia.trim() || undefined } });
      toast({ title: "ARQUIVO ATUALIZADO" });
      onClose();
    } catch (e: any) {
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="glass-panel border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display tracking-widest">EDITAR DOSSIÊ</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Nome do Agente</Label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} className="bg-secondary/30 border-border font-mono text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Histórico</Label>
            <Textarea value={historia} onChange={(e) => setHistoria(e.target.value)} rows={4}
              className="bg-secondary/30 border-border font-mono text-sm resize-none" />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} disabled={updateMut.isPending}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!nome.trim() || updateMut.isPending}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function CharacterSheet() {
  const [, params] = useRoute("/characters/:id");
  const id = params?.id || "";
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const { data: char, isLoading, error } = useGetCharacter(id);
  const updateMut = useUpdateCharacterMut(id);
  const { toast } = useToast();

  const [vitals, setVitals] = useState({ pv: 0, pe: 0, san: 0 });
  const [activeTab, setActiveTab] = useState<Tab>("pericias");
  const [editOpen, setEditOpen] = useState(false);

  if (char && vitals.pv === 0 && char.pvAtual !== undefined) {
    setVitals({ pv: char.pvAtual ?? 0, pe: char.peAtual ?? 0, san: char.sanAtual ?? 0 });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground font-display tracking-widest animate-pulse">
        ABRINDO ARQUIVO CONFIDENCIAL...
      </div>
    );
  }
  if (error || !char) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-destructive font-display tracking-widest">
        ARQUIVO CORROMPIDO OU NÃO ENCONTRADO.
      </div>
    );
  }

  const isOwner = char.userId === user?.id;

  const handleVital = (type: "pv" | "pe" | "san", change: number) => {
    const max = type === "pv" ? (char.pvMaximo ?? 1) : type === "pe" ? (char.peMaximo ?? 1) : (char.sanMaximo ?? 1);
    const newVal = Math.max(0, Math.min(max, vitals[type] + change));
    setVitals((p) => ({ ...p, [type]: newVal }));
    updateMut.mutate({
      id,
      data: { [type === "pv" ? "pvAtual" : type === "pe" ? "peAtual" : "sanAtual"]: newVal },
    });
  };

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "pericias", label: "Perícias", icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: "habilidades", label: "Habilidades", icon: <Zap className="w-3.5 h-3.5" /> },
    { id: "rituais", label: "Rituais", icon: <ScrollText className="w-3.5 h-3.5" /> },
    { id: "inventario", label: "Inventário", icon: <Backpack className="w-3.5 h-3.5" /> },
    { id: "historia", label: "Histórico", icon: <Skull className="w-3.5 h-3.5" /> },
  ];

  const atributos = {
    forca: char.forca ?? 1,
    agilidade: char.agilidade ?? 1,
    intelecto: char.intelecto ?? 1,
    vigor: char.vigor ?? 1,
    presenca: char.presenca ?? 1,
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-6xl">
      <button
        onClick={() => setLocation("/characters")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-5 font-display text-sm tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" />
        DOSSIÊS
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-6 pb-5 border-b border-border/40">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="text-2xl sm:text-3xl font-display tracking-widest text-foreground truncate uppercase">
              {char.nome}
            </h1>
            {isOwner && (
              <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
                onClick={() => setEditOpen(true)}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className="text-[10px] font-display tracking-widest border-primary/50 text-primary">
              NEX {char.nex}%
            </Badge>
            {char.classe?.nome && (
              <Badge variant="outline" className="text-[10px] font-display tracking-widest border-border/60 text-muted-foreground">
                {char.classe.nome}
              </Badge>
            )}
            {char.origem?.nome && (
              <Badge variant="outline" className="text-[10px] font-display tracking-widest border-border/50 text-muted-foreground">
                {char.origem.nome}
              </Badge>
            )}
            {char.patente && (
              <Badge variant="outline" className="text-[10px] font-display tracking-widest border-border/50 text-muted-foreground uppercase">
                {char.patente}
              </Badge>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] font-display tracking-widest text-muted-foreground/60">ID DO ARQUIVO</div>
          <div className="font-mono text-sm text-muted-foreground">{char.id.split("-")[0].toUpperCase()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[256px_1fr] gap-6">
        <aside className="space-y-4">
          <div className="border border-border/50 rounded-sm bg-card/30 p-5">
            <div className="w-16 h-16 rounded-sm bg-secondary/40 border border-border/40 flex items-center justify-center text-3xl font-display font-bold text-muted-foreground mb-3 mx-auto">
              {char.nome.charAt(0).toUpperCase()}
            </div>
            <p className="text-center font-display text-xs tracking-widest text-muted-foreground uppercase">
              {char.classe?.nome || "Sem Classe"} · {char.origem?.nome || "Sem Origem"}
            </p>
          </div>

          <div className="border border-border/50 rounded-sm bg-card/30 p-4 space-y-3">
            <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Atributos</p>
            <div className="grid grid-cols-5 gap-1.5">
              {(["FOR", "AGI", "INT", "VIG", "PRE"] as const).map((attr) => {
                const val = attr === "FOR" ? atributos.forca
                  : attr === "AGI" ? atributos.agilidade
                  : attr === "INT" ? atributos.intelecto
                  : attr === "VIG" ? atributos.vigor
                  : atributos.presenca;
                return (
                  <div key={attr} className={`flex flex-col items-center py-2 rounded-sm border ${ATTR_COLOR[attr]}`}>
                    <span className="text-lg font-display font-bold">{val}</span>
                    <span className="text-[9px] font-mono opacity-70">{attr}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border border-border/50 rounded-sm bg-card/30 p-4 space-y-3">
            <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Pontos Vitais</p>
            <VitalBar
              label="Vida" short="PV" current={vitals.pv} max={char.pvMaximo ?? 10}
              color="bg-red-600" onDec={() => handleVital("pv", -1)} onInc={() => handleVital("pv", 1)}
            />
            <VitalBar
              label="Esforço" short="PE" current={vitals.pe} max={char.peMaximo ?? 4}
              color="bg-blue-600" onDec={() => handleVital("pe", -1)} onInc={() => handleVital("pe", 1)}
            />
            <VitalBar
              label="Sanidade" short="SAN" current={vitals.san} max={char.sanMaximo ?? 12}
              color="bg-purple-600" onDec={() => handleVital("san", -1)} onInc={() => handleVital("san", 1)}
            />
          </div>

          <div className="border border-border/50 rounded-sm bg-card/30 p-4">
            <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-3">Combate</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-[10px] font-display tracking-widest text-muted-foreground">DEFESA</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">{char.defesa ?? 10}</span>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground/50 mt-1">= 10 + AGI ({atributos.agilidade})</div>
          </div>
        </aside>

        <main className="space-y-4">
          <div className="flex gap-0.5 border-b border-border/40">
            {TABS.map((tab) => (
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

          {activeTab === "pericias" && (
            <CharacterPericiasTab
              charId={char.id}
              charNome={char.nome}
              pericias={(char.pericias as string[]) ?? []}
              atributos={atributos}
            />
          )}

          {activeTab === "habilidades" && (
            <CharacterHabilidadesTab charId={char.id} isOwner={isOwner} />
          )}

          {activeTab === "rituais" && (
            <div className="border border-border/40 border-dashed rounded-sm p-10 text-center space-y-2">
              <ScrollText className="w-10 h-10 text-muted-foreground/30 mx-auto" />
              <p className="font-mono text-sm text-muted-foreground">Catálogo de Rituais (em desenvolvimento)</p>
            </div>
          )}

          {activeTab === "inventario" && (
            <div className="border border-border/40 border-dashed rounded-sm p-10 text-center space-y-2">
              <Backpack className="w-10 h-10 text-muted-foreground/30 mx-auto" />
              <p className="font-mono text-sm text-muted-foreground">Módulo de Inventário (em desenvolvimento)</p>
            </div>
          )}

          {activeTab === "historia" && (
            <div className="border border-border/50 rounded-sm bg-card/30 p-6">
              <p className="font-sans text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {char.historia || "Nenhum histórico registrado para este agente. O passado permanece um mistério."}
              </p>
            </div>
          )}
        </main>
      </div>

      {isOwner && (
        <EditCharDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          char={char}
          charId={char.id}
        />
      )}
    </div>
  );
}
