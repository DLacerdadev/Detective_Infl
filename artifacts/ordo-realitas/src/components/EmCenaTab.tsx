import { useState } from "react";
import {
  useGetEmCena,
  useListCampanhaPersonagens,
  type EmCenaState,
  type CampanhaPersonagemEntry,
} from "@workspace/api-client-react";
import { useAuth } from "@/hooks/useAuth";
import { Map, User, ShieldAlert, Search, Loader2 } from "lucide-react";
import CenaMapaView from "./CenaMapaView";
import PersonagemEmCena from "./PersonagemEmCena";
import EscudoMestre from "./EscudoMestre";
import MapaInvestigacao from "./MapaInvestigacao";

type SubTab = "cena" | "personagem" | "escudo" | "investigacao";

const SUB_TABS_ALL: { id: SubTab; label: string; icon: React.ReactNode; mestreOnly?: boolean }[] = [
  { id: "cena", label: "Cena", icon: <Map className="w-3.5 h-3.5" /> },
  { id: "personagem", label: "Personagem", icon: <User className="w-3.5 h-3.5" /> },
  { id: "escudo", label: "Escudo do Mestre", icon: <ShieldAlert className="w-3.5 h-3.5" />, mestreOnly: true },
  { id: "investigacao", label: "Investigação", icon: <Search className="w-3.5 h-3.5" /> },
];

export default function EmCenaTab({ campanhaId, amMestre }: { campanhaId: string; amMestre: boolean }) {
  const [subTab, setSubTab] = useState<SubTab>("cena");
  const { user } = useAuth();
  const { data: emCena, isLoading: loadingCena } = useGetEmCena(campanhaId);
  const { data: personagens = [] } = useListCampanhaPersonagens(campanhaId);

  const visibleTabs = SUB_TABS_ALL.filter((t) => !t.mestreOnly || amMestre);

  const effectiveSubTab = subTab === "escudo" && !amMestre ? "cena" : subTab;

  if (loadingCena) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-muted-foreground font-display tracking-widest animate-pulse gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        CARREGANDO CENA...
      </div>
    );
  }

  const state: EmCenaState = emCena ?? {
    id: "",
    campanhaId,
    ativa: false,
    imagemCena: null,
    notasMestre: null,
    pistas: [],
    combatentes: [],
    tokens: [],
    ordemIniciativa: [],
    turnoAtual: 0,
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-0.5 border-b border-border/30">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 font-display text-[10px] tracking-widest uppercase transition-all border-b-2 -mb-px ${
              effectiveSubTab === tab.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {effectiveSubTab === "cena" && (
        <CenaMapaView emCena={state} campanhaId={campanhaId} amMestre={amMestre} personagens={personagens} />
      )}

      {effectiveSubTab === "personagem" && (
        <PersonagemEmCena campanhaId={campanhaId} amMestre={amMestre} personagens={personagens} userId={user?.id ?? ""} />
      )}

      {effectiveSubTab === "escudo" && amMestre && (
        <EscudoMestre emCena={state} campanhaId={campanhaId} personagens={personagens} />
      )}

      {effectiveSubTab === "investigacao" && (
        <MapaInvestigacao emCena={state} campanhaId={campanhaId} amMestre={amMestre} />
      )}
    </div>
  );
}
