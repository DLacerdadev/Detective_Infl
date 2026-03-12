import { useGetCharacter } from "@workspace/api-client-react";
import { useRoute } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skull, Shield, Zap, FileText, Backpack } from "lucide-react";
import { useState } from "react";
import { useUpdateCharacterMut } from "@/hooks/use-api-mutations";
import CharacterPericiasTab from "@/components/CharacterPericiasTab";

export default function CharacterSheet() {
  const [, params] = useRoute("/characters/:id");
  const id = params?.id || "";
  
  const { data: char, isLoading, error } = useGetCharacter(id);
  const updateMut = useUpdateCharacterMut(id);

  // Local state for optimistic updates of vital stats before syncing
  const [vitals, setVitals] = useState({ pv: 0, pe: 0, san: 0 });

  // Sync state when data loads
  if (char && vitals.pv === 0 && char.pvAtual !== undefined) {
    setVitals({ pv: char.pvAtual, pe: char.peAtual || 0, san: char.sanAtual || 0 });
  }

  if (isLoading) return <div className="p-12 text-center font-display text-xl animate-pulse">ABRINDO ARQUIVO CONFIDENCIAL...</div>;
  if (error || !char) return <div className="p-12 text-center text-destructive font-display text-xl">ARQUIVO CORROMPIDO OU NÃO ENCONTRADO.</div>;

  const handleVitalChange = (type: 'pv' | 'pe' | 'san', change: number) => {
    let newVal = vitals[type] + change;
    const max = type === 'pv' ? char.pvMaximo : type === 'pe' ? char.peMaximo : char.sanMaximo;
    if (newVal < 0) newVal = 0;
    if (newVal > (max || 1)) newVal = max || 1;
    
    setVitals(prev => ({ ...prev, [type]: newVal }));
    
    // Auto save
    updateMut.mutate({ 
      id, 
      data: { 
        [type === 'pv' ? 'pvAtual' : type === 'pe' ? 'peAtual' : 'sanAtual']: newVal 
      } 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Dossier styling wrapper */}
      <div className="dossier-paper rounded-sm shadow-2xl relative p-8 md:p-12 min-h-[80vh] overflow-hidden">
        
        {/* Classified stamp */}
        <div className="absolute top-10 right-10 opacity-30 rotate-12 pointer-events-none">
          <img src={`${import.meta.env.BASE_URL}images/blood-stamp.png`} alt="Classified" className="w-48 h-auto" />
        </div>

        <div className="border-b-4 border-double border-gray-900/40 pb-6 mb-8 flex flex-col md:flex-row justify-between items-end gap-4 relative z-10">
          <div>
            <div className="font-display text-xs tracking-[0.3em] text-gray-900/60 mb-2">ORDEM PARANORMAL - ARQUIVO DE AGENTE</div>
            <h1 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter text-gray-900">
              {char.nome}
            </h1>
            <div className="flex gap-2 mt-2">
              <Badge variant="dossier">NEX {char.nex}%</Badge>
              <Badge variant="dossier">{char.classe?.nome || 'Sem Classe'}</Badge>
              <Badge variant="dossier">{char.origem?.nome || 'Sem Origem'}</Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-display text-gray-900/70">ID DO ARQUIVO</div>
            <div className="font-mono text-lg font-bold text-gray-900">{char.id.split('-')[0]}</div>
          </div>
        </div>

        <Tabs defaultValue="principal" className="relative z-10">
          <TabsList className="bg-transparent border-gray-900/30 border-b w-full justify-start rounded-none h-auto p-0 mb-6 flex-wrap">
            <TabsTrigger value="principal" className="data-[state=active]:bg-gray-900/10 data-[state=active]:shadow-none rounded-t-sm rounded-b-none border-t border-l border-r border-transparent data-[state=active]:border-gray-900/30 font-bold text-gray-900">PRINCIPAL</TabsTrigger>
            <TabsTrigger value="pericias" className="data-[state=active]:bg-gray-900/10 data-[state=active]:shadow-none rounded-t-sm rounded-b-none border-t border-l border-r border-transparent data-[state=active]:border-gray-900/30 font-bold text-gray-900">PERÍCIAS</TabsTrigger>
            <TabsTrigger value="inventario" className="data-[state=active]:bg-gray-900/10 data-[state=active]:shadow-none rounded-t-sm rounded-b-none border-t border-l border-r border-transparent data-[state=active]:border-gray-900/30 font-bold text-gray-900">INVENTÁRIO</TabsTrigger>
            <TabsTrigger value="rituais" className="data-[state=active]:bg-gray-900/10 data-[state=active]:shadow-none rounded-t-sm rounded-b-none border-t border-l border-r border-transparent data-[state=active]:border-gray-900/30 font-bold text-gray-900">RITUAIS</TabsTrigger>
            <TabsTrigger value="historia" className="data-[state=active]:bg-gray-900/10 data-[state=active]:shadow-none rounded-t-sm rounded-b-none border-t border-l border-r border-transparent data-[state=active]:border-gray-900/30 font-bold text-gray-900">HISTÓRICO</TabsTrigger>
          </TabsList>

          <TabsContent value="principal" className="space-y-8">
            
            {/* Vitals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'PONTOS DE VIDA', short: 'PV', current: vitals.pv, max: char.pvMaximo, color: 'bg-red-600', text: 'text-red-900', type: 'pv' },
                { label: 'PONTOS DE ESFORÇO', short: 'PE', current: vitals.pe, max: char.peMaximo, color: 'bg-blue-600', text: 'text-blue-900', type: 'pe' },
                { label: 'SANIDADE', short: 'SAN', current: vitals.san, max: char.sanMaximo, color: 'bg-yellow-600', text: 'text-yellow-900', type: 'san' },
              ].map((vital) => (
                <div key={vital.short} className="border-2 border-gray-900/20 p-4 rounded-sm bg-white/30 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-display font-bold tracking-widest text-sm text-gray-900">{vital.label}</span>
                    <span className={`font-display font-bold text-xl ${vital.text}`}>{vital.current} / {vital.max}</span>
                  </div>
                  <Progress value={((vital.current || 0)/(vital.max || 1))*100} indicatorColor={vital.color} className="h-3 bg-gray-900/10 border-none shadow-inner" />
                  <div className="flex justify-between mt-3">
                    <button onClick={() => handleVitalChange(vital.type as any, -1)} className="px-3 py-1 border border-gray-900/30 rounded-sm hover:bg-gray-900/10 font-display text-gray-900">-</button>
                    <button onClick={() => handleVitalChange(vital.type as any, 1)} className="px-3 py-1 border border-gray-900/30 rounded-sm hover:bg-gray-900/10 font-display text-gray-900">+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Attributes */}
            <div>
              <h3 className="font-display text-xl border-b-2 border-gray-900/20 pb-1 mb-4 text-gray-900 font-bold">ATRIBUTOS</h3>
              <div className="flex justify-center gap-6 md:gap-12 flex-wrap">
                {[
                  { name: 'FOR', val: char.forca },
                  { name: 'AGI', val: char.agilidade },
                  { name: 'INT', val: char.intelecto },
                  { name: 'VIG', val: char.vigor },
                  { name: 'PRE', val: char.presenca },
                ].map((attr) => (
                  <div key={attr.name} className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border-4 border-gray-900 flex items-center justify-center text-3xl font-display font-bold text-gray-900 bg-white/50 shadow-inner">
                      {attr.val}
                    </div>
                    <span className="mt-2 font-display font-bold tracking-widest text-sm text-gray-900">{attr.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Combat Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="border border-gray-900/20 p-4 flex justify-between items-center">
                <span className="font-display font-bold text-gray-900">DEFESA</span>
                <span className="text-3xl font-display font-bold text-gray-900">{char.defesa || 10}</span>
              </div>
              <div className="border border-gray-900/20 p-4 flex justify-between items-center">
                <span className="font-display font-bold text-gray-900">PATENTE</span>
                <span className="text-xl font-display font-bold text-gray-900 uppercase">{char.patente || 'RECRUTA'}</span>
              </div>
            </div>

          </TabsContent>

          <TabsContent value="pericias">
            <CharacterPericiasTab
              charId={char.id}
              pericias={(char.pericias as string[]) ?? []}
              nex={char.nex ?? 5}
              forca={char.forca}
              agilidade={char.agilidade}
              intelecto={char.intelecto}
              vigor={char.vigor}
              presenca={char.presenca}
            />
          </TabsContent>

          <TabsContent value="inventario" className="min-h-[300px]">
             <div className="border-2 border-dashed border-gray-900/30 rounded-sm p-8 text-center text-gray-900/60 font-display">
                <Backpack className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Módulo de Inventário será implementado em atualizações futuras.</p>
             </div>
          </TabsContent>

          <TabsContent value="rituais" className="min-h-[300px]">
             <div className="border-2 border-dashed border-gray-900/30 rounded-sm p-8 text-center text-gray-900/60 font-display">
                <Skull className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Catálogo de Rituais aprendidos. (Em desenvolvimento)</p>
             </div>
          </TabsContent>

          <TabsContent value="historia">
            <div className="p-6 bg-white/40 border border-gray-900/20 rounded-sm font-sans text-lg text-gray-900 leading-relaxed whitespace-pre-wrap">
              {char.historia || "Nenhum histórico registrado para este agente. O passado permanece um mistério."}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
