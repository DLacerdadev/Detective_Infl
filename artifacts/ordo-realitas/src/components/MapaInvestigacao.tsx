import {
  useUpdatePista,
  type EmCenaState,
  type EmCenaPista,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search, FileText, MapPin, UserCircle, Box,
  Eye, EyeOff, Compass,
} from "lucide-react";

const TIPO_ICON: Record<string, React.ReactNode> = {
  pista: <Search className="w-4 h-4" />,
  anotacao: <FileText className="w-4 h-4" />,
  local: <MapPin className="w-4 h-4" />,
  pessoa: <UserCircle className="w-4 h-4" />,
  objeto: <Box className="w-4 h-4" />,
};

const TIPO_COLORS: Record<string, string> = {
  pista: "border-blue-700/40 bg-blue-900/20 text-blue-300",
  anotacao: "border-amber-700/40 bg-amber-900/20 text-amber-300",
  local: "border-green-700/40 bg-green-900/20 text-green-300",
  pessoa: "border-purple-700/40 bg-purple-900/20 text-purple-300",
  objeto: "border-stone-600/40 bg-stone-900/20 text-stone-300",
};

const TIPO_ICON_COLORS: Record<string, string> = {
  pista: "text-blue-400",
  anotacao: "text-amber-400",
  local: "text-green-400",
  pessoa: "text-purple-400",
  objeto: "text-stone-400",
};

const TIPO_LABELS: Record<string, string> = {
  pista: "PISTA",
  anotacao: "ANOTAÇÃO",
  local: "LOCAL",
  pessoa: "PESSOA",
  objeto: "OBJETO",
};

interface Props {
  emCena: EmCenaState;
  campanhaId: string;
  amMestre: boolean;
}

function PistaCard({ pista, amMestre, campanhaId }: { pista: EmCenaPista; amMestre: boolean; campanhaId: string }) {
  const { toast } = useToast();
  const updateMut = useUpdatePista(campanhaId);

  const handleToggle = async () => {
    try {
      await updateMut.mutateAsync({
        pistaId: pista.id,
        data: { visivel: !pista.visivel },
      });
    } catch (e: any) {
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  };

  const isHidden = !pista.visivel;
  const colorCls = TIPO_COLORS[pista.tipo] ?? TIPO_COLORS.pista;
  const iconColorCls = TIPO_ICON_COLORS[pista.tipo] ?? TIPO_ICON_COLORS.pista;

  return (
    <div
      className={`border rounded-sm p-4 transition-all ${colorCls} ${
        isHidden ? "opacity-50 border-dashed" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${iconColorCls}`}>
          {TIPO_ICON[pista.tipo] ?? TIPO_ICON.pista}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-mono text-sm font-medium text-foreground">{pista.titulo}</h4>
            <Badge variant="outline" className={`text-[8px] py-0 ${colorCls}`}>
              {TIPO_LABELS[pista.tipo] ?? pista.tipo.toUpperCase()}
            </Badge>
            {isHidden && amMestre && (
              <Badge variant="outline" className="text-[8px] py-0 border-amber-700/40 text-amber-400">
                OCULTA
              </Badge>
            )}
          </div>
          {pista.descricao && (
            <p className="text-xs font-mono text-muted-foreground mt-1.5 whitespace-pre-wrap">{pista.descricao}</p>
          )}
        </div>
        {amMestre && (
          <Button
            size="sm"
            variant="ghost"
            className="shrink-0 h-7 text-xs font-display tracking-widest gap-1"
            onClick={handleToggle}
          >
            {isHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {isHidden ? "REVELAR" : "OCULTAR"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function MapaInvestigacao({ emCena, campanhaId, amMestre }: Props) {
  const visiblePistas = amMestre ? emCena.pistas : emCena.pistas.filter((p) => p.visivel);

  if (visiblePistas.length === 0) {
    return (
      <div className="border border-border/40 border-dashed rounded-sm p-10 text-center space-y-3">
        <Compass className="w-12 h-12 text-muted-foreground/20 mx-auto" />
        <div className="space-y-1">
          <p className="font-display text-sm tracking-widest text-muted-foreground/40">NENHUMA PISTA ENCONTRADA</p>
          <p className="font-mono text-xs text-muted-foreground/25">
            {amMestre
              ? "Crie pistas no Escudo do Mestre e revele-as aos jogadores."
              : "As investigações ainda não revelaram evidências..."}
          </p>
        </div>
      </div>
    );
  }

  const grouped: Record<string, EmCenaPista[]> = {};
  for (const p of visiblePistas) {
    if (!grouped[p.tipo]) grouped[p.tipo] = [];
    grouped[p.tipo].push(p);
  }

  const typeOrder = ["pista", "local", "pessoa", "objeto", "anotacao"];
  const sortedTypes = typeOrder.filter((t) => grouped[t]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Compass className="w-4 h-4 text-primary" />
        <h3 className="font-display text-sm tracking-widest text-muted-foreground uppercase">
          Mapa de Investigação
        </h3>
        <span className="text-xs font-mono text-muted-foreground/50 ml-auto">
          {visiblePistas.filter((p) => p.visivel).length} revelada(s)
          {amMestre && ` / ${visiblePistas.length} total`}
        </span>
      </div>

      {sortedTypes.map((tipo) => (
        <div key={tipo} className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={TIPO_ICON_COLORS[tipo]}>{TIPO_ICON[tipo]}</span>
            <span className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">
              {TIPO_LABELS[tipo]} ({grouped[tipo].length})
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {grouped[tipo].map((p) => (
              <PistaCard key={p.id} pista={p} amMestre={amMestre} campanhaId={campanhaId} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
