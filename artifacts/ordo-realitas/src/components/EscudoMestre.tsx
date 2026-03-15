import { useState, useCallback, useEffect, useRef } from "react";
import {
  useUpdateEmCena,
  useAddCombatente,
  useUpdateCombatente,
  useDeleteCombatente,
  useAddPista,
  useUpdatePista,
  useDeletePista,
  useUpdateIniciativa,
  type EmCenaState,
  type EmCenaCombatente,
  type EmCenaPista,
  type CampanhaPersonagemEntry,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Swords, Search, StickyNote, Image, Plus, Trash2, Eye, EyeOff,
  Minus, ChevronUp, ChevronDown, SkipForward, Shield, Skull,
  MapPin, UserCircle, Box, FileText, Loader2,
} from "lucide-react";

const PISTA_TIPOS: { value: EmCenaPista["tipo"]; label: string }[] = [
  { value: "pista", label: "Pista" },
  { value: "anotacao", label: "Anotação" },
  { value: "local", label: "Local" },
  { value: "pessoa", label: "Pessoa" },
  { value: "objeto", label: "Objeto" },
];

const TIPO_ICON: Record<string, React.ReactNode> = {
  pista: <Search className="w-3 h-3" />,
  anotacao: <FileText className="w-3 h-3" />,
  local: <MapPin className="w-3 h-3" />,
  pessoa: <UserCircle className="w-3 h-3" />,
  objeto: <Box className="w-3 h-3" />,
};

interface Props {
  emCena: EmCenaState;
  campanhaId: string;
  personagens: CampanhaPersonagemEntry[];
}

type EscudoSubTab = "combatentes" | "pistas";

function CombatentesPanel({ emCena, campanhaId }: { emCena: EmCenaState; campanhaId: string }) {
  const { toast } = useToast();
  const addMut = useAddCombatente(campanhaId);
  const updateMut = useUpdateCombatente(campanhaId);
  const deleteMut = useDeleteCombatente(campanhaId);
  const iniciativaMut = useUpdateIniciativa(campanhaId);

  const [nome, setNome] = useState("");
  const [pvMax, setPvMax] = useState("10");
  const [defesa, setDefesa] = useState("10");
  const [ataque, setAtaque] = useState("");
  const [visivel, setVisivel] = useState(true);

  const handleAdd = async () => {
    if (!nome.trim()) return;
    try {
      await addMut.mutateAsync({
        nome: nome.trim(),
        tipo: "monstro",
        pvMaximo: parseInt(pvMax) || 10,
        pvAtual: parseInt(pvMax) || 10,
        defesa: parseInt(defesa) || 10,
        ataque: ataque.trim() || null,
        visivelParaJogadores: visivel,
      });
      setNome("");
      setPvMax("10");
      setDefesa("10");
      setAtaque("");
    } catch (e: any) {
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  };

  const handleDamage = async (c: EmCenaCombatente, amount: number) => {
    const newPv = Math.max(0, Math.min(c.pvMaximo, c.pvAtual + amount));
    try {
      await updateMut.mutateAsync({ combatenteId: c.id, data: { pvAtual: newPv } });
    } catch (e: any) {
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  };

  const handleToggleVisibility = async (c: EmCenaCombatente) => {
    try {
      await updateMut.mutateAsync({
        combatenteId: c.id,
        data: { visivelParaJogadores: !c.visivelParaJogadores },
      });
    } catch (e: any) {
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await deleteMut.mutateAsync(id);
    } catch (e: any) {
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  };

  const handleNextTurn = async () => {
    try {
      await iniciativaMut.mutateAsync({
        turnoAtual: emCena.turnoAtual + 1,
      });
    } catch (e: any) {
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  };

  const handleMoveOrder = async (combId: string, direction: "up" | "down") => {
    const order = [...emCena.ordemIniciativa];
    const idx = order.indexOf(combId);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= order.length) return;
    [order[idx], order[swapIdx]] = [order[swapIdx], order[idx]];
    try {
      await iniciativaMut.mutateAsync({ ordemIniciativa: order });
    } catch (e: any) {
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  };

  const sortedCombatentes = [...emCena.combatentes].sort((a, b) => {
    const idxA = emCena.ordemIniciativa.indexOf(a.id);
    const idxB = emCena.ordemIniciativa.indexOf(b.id);
    if (idxA >= 0 && idxB >= 0) return idxA - idxB;
    if (idxA >= 0) return -1;
    if (idxB >= 0) return 1;
    return 0;
  });

  const currentTurnId = emCena.ordemIniciativa[emCena.turnoAtual % Math.max(1, emCena.ordemIniciativa.length)];

  return (
    <div className="space-y-5">
      <div className="border border-border/40 rounded-sm bg-secondary/10 p-4 space-y-3">
        <h4 className="font-display text-[10px] tracking-widest text-muted-foreground uppercase flex items-center gap-1.5">
          <Plus className="w-3 h-3" /> ADICIONAR COMBATENTE
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="bg-secondary/30 border-border font-mono text-sm col-span-2"
          />
          <Input
            placeholder="PV Máx"
            type="number"
            value={pvMax}
            onChange={(e) => setPvMax(e.target.value)}
            className="bg-secondary/30 border-border font-mono text-sm"
          />
          <Input
            placeholder="Defesa"
            type="number"
            value={defesa}
            onChange={(e) => setDefesa(e.target.value)}
            className="bg-secondary/30 border-border font-mono text-sm"
          />
          <Input
            placeholder="Ataque (ex: 2d6+3)"
            value={ataque}
            onChange={(e) => setAtaque(e.target.value)}
            className="bg-secondary/30 border-border font-mono text-sm col-span-2"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setVisivel(!visivel)}
            className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            {visivel ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {visivel ? "Visível para jogadores" : "Oculto dos jogadores"}
          </button>
          <Button size="sm" onClick={handleAdd} disabled={!nome.trim() || addMut.isPending} className="font-display tracking-widest text-xs">
            {addMut.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
            ADICIONAR
          </Button>
        </div>
      </div>

      {emCena.ordemIniciativa.length > 0 && (
        <div className="flex items-center justify-between border border-border/40 rounded-sm bg-card/30 px-4 py-2">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-primary" />
            <span className="font-display text-xs tracking-widest text-muted-foreground">TURNO</span>
            <span className="font-mono text-lg font-bold text-foreground tabular-nums">{emCena.turnoAtual + 1}</span>
          </div>
          <Button size="sm" variant="outline" onClick={handleNextTurn} className="font-display tracking-widest text-xs gap-1">
            <SkipForward className="w-3 h-3" />
            PRÓXIMO
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {sortedCombatentes.length === 0 ? (
          <p className="text-sm font-mono text-muted-foreground/50 text-center py-6">Nenhum combatente adicionado.</p>
        ) : (
          sortedCombatentes.map((c) => {
            const isCurrentTurn = c.id === currentTurnId;
            const pvPct = c.pvMaximo > 0 ? (c.pvAtual / c.pvMaximo) * 100 : 0;

            return (
              <div
                key={c.id}
                className={`border rounded-sm p-3 space-y-2 transition-all ${
                  isCurrentTurn
                    ? "border-primary/60 bg-primary/5 ring-1 ring-primary/20"
                    : "border-border/40 bg-card/20"
                } ${c.pvAtual <= 0 ? "opacity-50" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skull className="w-3.5 h-3.5 text-red-400" />
                    <span className="font-mono text-sm font-medium text-foreground">{c.nome}</span>
                    {!c.visivelParaJogadores && (
                      <Badge variant="outline" className="text-[8px] border-amber-700/40 text-amber-400 py-0">
                        OCULTO
                      </Badge>
                    )}
                    {isCurrentTurn && (
                      <Badge className="text-[8px] bg-primary/20 text-primary border border-primary/40 py-0">
                        VEZ
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => handleMoveOrder(c.id, "up")} title="Subir na iniciativa">
                      <ChevronUp className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => handleMoveOrder(c.id, "down")} title="Descer na iniciativa">
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-5 w-5 text-muted-foreground hover:text-foreground" onClick={() => handleToggleVisibility(c)}>
                      {c.visivelParaJogadores ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </Button>
                    <Button size="icon" variant="ghost" className="h-5 w-5 text-destructive/60 hover:text-destructive" onClick={() => handleRemove(c.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDamage(c, -5)}>
                      <span className="text-[10px] font-mono text-red-400">-5</span>
                    </Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDamage(c, -1)}>
                      <Minus className="w-3 h-3 text-red-400" />
                    </Button>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-0.5">
                      <span>PV</span>
                      <span>{c.pvAtual}/{c.pvMaximo}</span>
                    </div>
                    <div className="h-2 bg-secondary/30 rounded-full border border-border/30 overflow-hidden">
                      <div
                        className={`h-full transition-all ${pvPct > 50 ? "bg-green-600" : pvPct > 25 ? "bg-amber-600" : "bg-red-600"}`}
                        style={{ width: `${Math.max(0, Math.min(100, pvPct))}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDamage(c, 1)}>
                      <Plus className="w-3 h-3 text-green-400" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDamage(c, 5)}>
                      <span className="text-[10px] font-mono text-green-400">+5</span>
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3 text-[10px] font-mono text-muted-foreground">
                  {c.defesa != null && (
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" /> DEF {c.defesa}
                    </span>
                  )}
                  {c.ataque && (
                    <span className="flex items-center gap-1">
                      <Swords className="w-3 h-3" /> {c.ataque}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function PistasPanel({ emCena, campanhaId }: { emCena: EmCenaState; campanhaId: string }) {
  const { toast } = useToast();
  const addMut = useAddPista(campanhaId);
  const updateMut = useUpdatePista(campanhaId);
  const deleteMut = useDeletePista(campanhaId);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState<EmCenaPista["tipo"]>("pista");

  const handleAdd = async () => {
    if (!titulo.trim()) return;
    try {
      await addMut.mutateAsync({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        tipo,
        visivel: false,
      });
      setTitulo("");
      setDescricao("");
      setTipo("pista");
    } catch (e: any) {
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  };

  const handleToggleReveal = async (pista: EmCenaPista) => {
    try {
      await updateMut.mutateAsync({
        pistaId: pista.id,
        data: { visivel: !pista.visivel },
      });
    } catch (e: any) {
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await deleteMut.mutateAsync(id);
    } catch (e: any) {
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-5">
      <div className="border border-border/40 rounded-sm bg-secondary/10 p-4 space-y-3">
        <h4 className="font-display text-[10px] tracking-widest text-muted-foreground uppercase flex items-center gap-1.5">
          <Plus className="w-3 h-3" /> NOVA PISTA
        </h4>
        <Input
          placeholder="Título da pista"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="bg-secondary/30 border-border font-mono text-sm"
        />
        <textarea
          placeholder="Descrição (opcional)"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full bg-secondary/30 border border-border rounded-sm px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 resize-none h-20 focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {PISTA_TIPOS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTipo(t.value)}
                className={`text-[9px] font-display tracking-widest px-2 py-1 rounded-sm border transition-colors flex items-center gap-1 ${
                  tipo === t.value
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {TIPO_ICON[t.value]}
                {t.label.toUpperCase()}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={handleAdd} disabled={!titulo.trim() || addMut.isPending} className="font-display tracking-widest text-xs">
            {addMut.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
            CRIAR
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {emCena.pistas.length === 0 ? (
          <p className="text-sm font-mono text-muted-foreground/50 text-center py-6">Nenhuma pista criada.</p>
        ) : (
          emCena.pistas.map((p) => (
            <div
              key={p.id}
              className={`border rounded-sm p-3 transition-all ${
                p.visivel
                  ? "border-green-700/40 bg-green-900/10"
                  : "border-border/40 bg-card/20 opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {TIPO_ICON[p.tipo]}
                    <span className="font-mono text-sm text-foreground">{p.titulo}</span>
                    <Badge variant="outline" className={`text-[8px] py-0 ${
                      p.visivel
                        ? "border-green-700/40 text-green-400"
                        : "border-amber-700/40 text-amber-400"
                    }`}>
                      {p.visivel ? "REVELADA" : "OCULTA"}
                    </Badge>
                  </div>
                  {p.descricao && (
                    <p className="text-xs font-mono text-muted-foreground mt-1 line-clamp-2">{p.descricao}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs font-display tracking-widest gap-1"
                    onClick={() => handleToggleReveal(p)}
                  >
                    {p.visivel ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {p.visivel ? "OCULTAR" : "REVELAR"}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive/60 hover:text-destructive" onClick={() => handleRemove(p.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function EscudoMestre({ emCena, campanhaId, personagens }: Props) {
  const [escudoTab, setEscudoTab] = useState<EscudoSubTab>("combatentes");
  const { toast } = useToast();
  const updateEmCenaMut = useUpdateEmCena(campanhaId);

  const [notasLocal, setNotasLocal] = useState(emCena.notasMestre ?? "");
  const [imagemUrl, setImagemUrl] = useState(emCena.imagemCena ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notasEditingRef = useRef(false);

  useEffect(() => {
    if (!notasEditingRef.current) {
      setNotasLocal(emCena.notasMestre ?? "");
    }
    setImagemUrl(emCena.imagemCena ?? "");
  }, [emCena.notasMestre, emCena.imagemCena]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleNotasChange = useCallback(
    (val: string) => {
      setNotasLocal(val);
      notasEditingRef.current = true;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateEmCenaMut.mutate({ notasMestre: val });
        notasEditingRef.current = false;
      }, 1500);
    },
    [updateEmCenaMut],
  );

  const handleImagemSave = useCallback(async () => {
    try {
      await updateEmCenaMut.mutateAsync({ imagemCena: imagemUrl.trim() || null });
      toast({ title: "Imagem da cena atualizada" });
    } catch (e: any) {
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  }, [imagemUrl, updateEmCenaMut, toast]);

  return (
    <div className="space-y-5">
      <div className="border border-red-900/30 rounded-sm bg-gradient-to-br from-[#1a0808]/60 to-[#120505]/60 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-red-400" />
          <h3 className="font-display text-sm tracking-widest text-red-400/80 uppercase">Escudo do Mestre</h3>
          <span className="text-[9px] font-mono text-red-400/40 ml-auto">ÁREA RESTRITA</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <Image className="w-3 h-3" /> Imagem da Cena (URL)
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="https://exemplo.com/mapa.jpg"
                value={imagemUrl}
                onChange={(e) => setImagemUrl(e.target.value)}
                className="bg-secondary/30 border-border font-mono text-sm flex-1"
              />
              <Button size="sm" onClick={handleImagemSave} disabled={updateEmCenaMut.isPending} className="font-display tracking-widest text-xs shrink-0">
                APLICAR
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <StickyNote className="w-3 h-3" /> Notas do Mestre
            </label>
            <textarea
              value={notasLocal}
              onChange={(e) => handleNotasChange(e.target.value)}
              placeholder="Notas privadas da sessão..."
              className="w-full bg-secondary/30 border border-border rounded-sm px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 resize-none h-24 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="flex gap-0.5 border-b border-red-900/30 mb-4">
          <button
            onClick={() => setEscudoTab("combatentes")}
            className={`flex items-center gap-1.5 px-3 py-2 font-display text-[10px] tracking-widest uppercase transition-all border-b-2 -mb-px ${
              escudoTab === "combatentes"
                ? "border-red-500 text-red-300"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Swords className="w-3 h-3" /> Combatentes
          </button>
          <button
            onClick={() => setEscudoTab("pistas")}
            className={`flex items-center gap-1.5 px-3 py-2 font-display text-[10px] tracking-widest uppercase transition-all border-b-2 -mb-px ${
              escudoTab === "pistas"
                ? "border-red-500 text-red-300"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Search className="w-3 h-3" /> Pistas
          </button>
        </div>

        {escudoTab === "combatentes" && <CombatentesPanel emCena={emCena} campanhaId={campanhaId} />}
        {escudoTab === "pistas" && <PistasPanel emCena={emCena} campanhaId={campanhaId} />}
      </div>
    </div>
  );
}
