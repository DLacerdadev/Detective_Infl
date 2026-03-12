import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useListCharacters } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Skull, Activity, Shield, Trash2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { useDeleteCharacterMut } from "@/hooks/use-api-mutations";
import { useToast } from "@/hooks/use-toast";

export default function Characters() {
  const { user } = useAuth();
  const { data: characters, isLoading, error } = useListCharacters();
  const [, setLocation] = useLocation();
  const deleteMut = useDeleteCharacterMut();
  const { toast } = useToast();

  // id of the character pending deletion confirmation
  const [pendingDelete, setPendingDelete] = useState<{ id: string; nome: string } | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, char: { id: string; nome: string }) => {
    e.stopPropagation();
    setPendingDelete(char);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteMut.mutateAsync({ id: pendingDelete.id });
      toast({
        title: "AGENTE EXONERADO",
        description: `O dossiê de ${pendingDelete.nome} foi permanentemente removido dos arquivos.`,
      });
    } catch {
      toast({
        title: "FALHA NA OPERAÇÃO",
        description: "Não foi possível remover o dossiê. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setPendingDelete(null);
    }
  };

  if (isLoading) return <div className="p-8 flex justify-center text-muted-foreground font-display tracking-widest animate-pulse">ACESSANDO ARQUIVOS...</div>;
  if (error)     return <div className="p-8 text-destructive text-center">Erro ao acessar arquivos. Contate a base.</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-3xl font-display text-foreground tracking-widest mb-2">ARQUIVOS DE AGENTES</h1>
          <p className="text-muted-foreground font-sans">Dossiês vinculados ao operador {user?.firstName || user?.email}</p>
        </div>
        <Button onClick={() => setLocation("/characters/new")} className="mt-4 sm:mt-0 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
          <Plus className="mr-2 h-4 w-4" /> RECRUTAR AGENTE
        </Button>
      </div>

      {!characters || characters.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-sm max-w-2xl mx-auto mt-12 border-dashed border-2">
          <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-2xl font-display text-foreground mb-2">NENHUM REGISTRO ENCONTRADO</h2>
          <p className="text-muted-foreground mb-6 font-sans">Seu terminal não possui dossiês ativos. O paranormal não espera.</p>
          <Button onClick={() => setLocation("/characters/new")} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            INICIAR NOVO PROTOCOLO
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(characters as any[]).map((char: any, index: number) => (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="group cursor-pointer hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col bg-secondary/30"
                onClick={() => setLocation(`/characters/${char.id}`)}
              >
                <CardHeader className="pb-2 border-b border-border/30 bg-background/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="outline" className="mb-2 text-primary border-primary/30">NEX {char.nex}%</Badge>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors truncate max-w-[200px]">
                        {char.nome.toUpperCase()}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="p-2 bg-secondary rounded-sm shadow-inner border border-border/50">
                        <Shield className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 flex-grow font-sans">
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
                    <div><strong className="text-foreground">Classe:</strong> {char.classe?.nome || 'N/A'}</div>
                    <div><strong className="text-foreground">Origem:</strong> {char.origem?.nome || 'N/A'}</div>
                    <div><strong className="text-foreground">Patente:</strong> {char.patente || 'N/A'}</div>
                    <div><strong className="text-foreground">Nível:</strong> {char.nivel}</div>
                  </div>
                  <div className="space-y-3 mt-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-display tracking-widest">
                        <span className="text-pv">PV</span>
                        <span>{char.pvAtual}/{char.pvMaximo}</span>
                      </div>
                      <Progress value={((char.pvAtual || 0)/(char.pvMaximo || 1))*100} indicatorColor="bg-pv" className="h-1.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-display tracking-widest">
                        <span className="text-pe">PE</span>
                        <span>{char.peAtual}/{char.peMaximo}</span>
                      </div>
                      <Progress value={((char.peAtual || 0)/(char.peMaximo || 1))*100} indicatorColor="bg-pe" className="h-1.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-display tracking-widest">
                        <span className="text-san">SAN</span>
                        <span>{char.sanAtual}/{char.sanMaximo}</span>
                      </div>
                      <Progress value={((char.sanAtual || 0)/(char.sanMaximo || 1))*100} indicatorColor="bg-san" className="h-1.5" />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-background/80 py-2 px-4 border-t border-border/30 text-xs font-display tracking-widest flex justify-between items-center">
                  <span className="text-muted-foreground">ID: {char.id.substring(0, 8)}...</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDeleteClick(e, char)}
                      className="flex items-center gap-1 text-muted-foreground/40 hover:text-destructive transition-colors px-2 py-1 rounded-sm hover:bg-destructive/10"
                      title="Exonerar agente"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="text-[10px]">EXONERAR</span>
                    </button>
                    <span className="group-hover:text-primary transition-colors flex items-center text-muted-foreground">
                      ABRIR DOSSIÊ <Activity className="ml-1 w-3 h-3" />
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Confirmation Dialog ─────────────────────────────────── */}
      <AnimatePresence>
        {pendingDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={() => setPendingDelete(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel border border-destructive/40 rounded-sm max-w-md w-full p-8 shadow-[0_0_40px_rgba(220,38,38,0.25)]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-destructive/15 rounded-sm border border-destructive/30">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="font-display text-[10px] tracking-[0.3em] text-destructive/70 mb-0.5">ORDEM PARANORMAL — PROTOCOLO DE EXONERAÇÃO</p>
                  <h2 className="font-display text-lg text-foreground font-bold">CONFIRMAR EXONERAÇÃO</h2>
                </div>
              </div>

              <div className="bg-destructive/10 border border-destructive/25 rounded-sm p-4 mb-6">
                <p className="font-sans text-sm text-foreground/80 leading-relaxed">
                  O dossiê do agente{" "}
                  <span className="font-display font-bold text-foreground">{pendingDelete.nome.toUpperCase()}</span>{" "}
                  será <strong className="text-destructive">permanentemente removido</strong> dos arquivos da Ordem.
                  Esta operação é irreversível.
                </p>
              </div>

              <div className="font-mono text-[10px] text-muted-foreground border border-border/40 rounded-sm p-3 mb-6 space-y-0.5">
                <p>{'>'} ALVO: {pendingDelete.nome.toUpperCase()}</p>
                <p>{'>'} OPERAÇÃO: EXONERAÇÃO PERMANENTE</p>
                <p>{'>'} STATUS: <span className="text-destructive animate-pulse">AGUARDANDO CONFIRMAÇÃO...</span></p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setPendingDelete(null)}
                  disabled={deleteMut.isPending}
                >
                  CANCELAR
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 gap-2"
                  onClick={handleConfirmDelete}
                  disabled={deleteMut.isPending}
                >
                  <Skull className="w-4 h-4" />
                  {deleteMut.isPending ? "REMOVENDO..." : "EXONERAR AGENTE"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
