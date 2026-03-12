import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useListClasses, useListOrigins, useListPericias } from "@workspace/api-client-react";
import { useCreateCharacterMut } from "@/hooks/use-api-mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

// Form schemas based on API definitions
const characterSchema = z.object({
  nome: z.string().min(2, "Nome muito curto"),
  historia: z.string().optional(),
  classeId: z.string().min(1, "Selecione uma classe"),
  origemId: z.string().min(1, "Selecione uma origem"),
  forca: z.number().min(0).max(3),
  agilidade: z.number().min(0).max(3),
  intelecto: z.number().min(0).max(3),
  vigor: z.number().min(0).max(3),
  presenca: z.number().min(0).max(3),
  pericias: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof characterSchema>;

export default function CreateCharacter() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  const { data: classes } = useListClasses();
  const { data: origins } = useListOrigins();
  const { data: pericias } = useListPericias();
  const createMut = useCreateCharacterMut();

  const form = useForm<FormData>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      nome: "",
      historia: "",
      classeId: "",
      origemId: "",
      forca: 1,
      agilidade: 1,
      intelecto: 1,
      vigor: 1,
      presenca: 1,
      pericias: [],
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await createMut.mutateAsync({ data });
      toast({ title: "Dossiê Criado", description: "Agente registrado com sucesso." });
      setLocation(`/characters/${result.id}`);
    } catch (e) {
      toast({ title: "Erro", description: "Falha ao registrar agente.", variant: "destructive" });
    }
  };

  const nextStep = async () => {
    let valid = false;
    if (step === 1) valid = await form.trigger(["nome"]);
    if (step === 2) valid = await form.trigger(["classeId"]);
    if (step === 3) valid = await form.trigger(["origemId"]);
    if (step === 4) valid = await form.trigger(["forca", "agilidade", "intelecto", "vigor", "presenca"]);
    
    if (valid) setStep((s) => s + 1);
  };

  const attrPointsTotal = 4; // Base starting points to distribute beyond the 1 in each
  const currentTotal = 
    form.watch("forca") + 
    form.watch("agilidade") + 
    form.watch("intelecto") + 
    form.watch("vigor") + 
    form.watch("presenca");
  const pointsRemaining = attrPointsTotal - (currentTotal - 5); // -5 because each starts at 1

  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-display text-foreground mb-2">NOVO RECRUTAMENTO</h1>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`h-2 flex-1 rounded-sm ${step >= i ? 'bg-primary' : 'bg-secondary'}`} />
          ))}
        </div>
      </div>

      <Card className="glass-panel p-8 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 text-muted/10 pointer-events-none">
          <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="relative z-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-xl font-display text-primary border-b border-border/50 pb-2">I. IDENTIFICAÇÃO</h2>
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Agente</Label>
                  <Input id="nome" {...form.register("nome")} className="font-display text-lg tracking-widest placeholder:font-sans placeholder:tracking-normal" placeholder="ex: Arthur Cervero" />
                  {form.formState.errors.nome && <p className="text-destructive text-sm">{form.formState.errors.nome.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="historia">Histórico (Opcional)</Label>
                  <Textarea id="historia" {...form.register("historia")} rows={5} className="font-sans resize-none" placeholder="Qual a relação deste agente com o paranormal?" />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-xl font-display text-primary border-b border-border/50 pb-2">II. ESPECIALIDADE (CLASSE)</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {classes?.map((c) => (
                    <div 
                      key={c.id}
                      onClick={() => form.setValue("classeId", c.id)}
                      className={`cursor-pointer p-4 border rounded-sm transition-all ${form.watch("classeId") === c.id ? 'border-primary bg-primary/10 shadow-[0_0_10px_rgba(220,38,38,0.2)]' : 'border-border bg-secondary/30 hover:border-primary/50'}`}
                    >
                      <h3 className="font-display font-bold text-lg mb-2 text-foreground">{c.nome}</h3>
                      <p className="text-sm text-muted-foreground font-sans line-clamp-3">{c.descricao || "Sem descrição"}</p>
                    </div>
                  ))}
                </div>
                {form.formState.errors.classeId && <p className="text-destructive text-sm mt-2">{form.formState.errors.classeId.message}</p>}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-xl font-display text-primary border-b border-border/50 pb-2">III. ORIGEM</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2">
                  {origins?.map((o) => (
                    <div 
                      key={o.id}
                      onClick={() => form.setValue("origemId", o.id)}
                      className={`cursor-pointer p-4 border rounded-sm transition-all ${form.watch("origemId") === o.id ? 'border-primary bg-primary/10 shadow-[0_0_10px_rgba(220,38,38,0.2)]' : 'border-border bg-secondary/30 hover:border-primary/50'}`}
                    >
                      <h3 className="font-display font-bold text-lg text-foreground">{o.nome}</h3>
                      <p className="text-sm text-muted-foreground font-sans mt-1">{o.poderConcedido}</p>
                    </div>
                  ))}
                </div>
                {form.formState.errors.origemId && <p className="text-destructive text-sm mt-2">{form.formState.errors.origemId.message}</p>}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="flex justify-between items-end border-b border-border/50 pb-2">
                  <h2 className="text-xl font-display text-primary">IV. ATRIBUTOS</h2>
                  <div className={`font-display text-sm px-3 py-1 rounded-sm ${pointsRemaining === 0 ? 'bg-green-900/30 text-green-500 border border-green-800' : pointsRemaining < 0 ? 'bg-destructive/30 text-destructive border border-destructive/50' : 'bg-secondary text-foreground border border-border'}`}>
                    {pointsRemaining < 0 ? `${Math.abs(pointsRemaining)} PONTO${Math.abs(pointsRemaining) > 1 ? 'S' : ''} A MAIS` : `${pointsRemaining} PONTO${pointsRemaining !== 1 ? 'S' : ''} RESTANTE${pointsRemaining !== 1 ? 'S' : ''}`}
                  </div>
                </div>

                {/* Rules box */}
                <div className="bg-amber-950/20 border border-amber-800/30 rounded-sm px-4 py-3 text-xs text-amber-200/70 font-mono space-y-1 leading-relaxed">
                  <p>• Todos os atributos começam em <strong className="text-amber-300">1</strong>. Você tem <strong className="text-amber-300">4 pontos</strong> para distribuir.</p>
                  <p>• Reduza um atributo para <strong className="text-amber-300">0</strong> para receber <strong className="text-amber-300">+1 ponto</strong> adicional.</p>
                  <p>• Valor máximo inicial por atributo: <strong className="text-amber-300">3</strong>.</p>
                </div>
                
                <div className="w-full max-w-md mx-auto space-y-4 bg-background/50 p-6 rounded-sm border border-border">
                  {([
                    { key: 'forca', label: 'FORÇA' },
                    { key: 'agilidade', label: 'AGILIDADE' },
                    { key: 'intelecto', label: 'INTELECTO' },
                    { key: 'vigor', label: 'VIGOR' },
                    { key: 'presenca', label: 'PRESENÇA' },
                  ] as const).map(({ key, label }) => {
                    const val = form.watch(key);
                    const isZero = val === 0;
                    const isMax = val === 3;
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <Label className={`w-36 text-base font-display tracking-widest ${isZero ? 'text-destructive/70' : 'text-foreground'}`}>
                          {label}
                          {isZero && <span className="ml-2 text-[10px] text-amber-400 font-sans normal-case tracking-normal">+1 pt</span>}
                        </Label>
                        <div className="flex items-center space-x-4">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            disabled={val <= 0}
                            onClick={() => form.setValue(key, Math.max(0, val - 1))}
                          >−</Button>
                          <span className={`w-8 text-center font-display text-2xl ${isZero ? 'text-destructive' : isMax ? 'text-amber-400' : 'text-primary'}`}>
                            {val}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            disabled={isMax || pointsRemaining <= 0}
                            onClick={() => form.setValue(key, Math.min(3, val + 1))}
                          >+</Button>
                        </div>
                        {/* Bar indicator */}
                        <div className="flex gap-1 ml-4">
                          {[1, 2, 3].map((pip) => (
                            <div
                              key={pip}
                              className={`h-3 w-3 rounded-sm border transition-colors ${
                                pip <= val
                                  ? pip === 3 ? 'bg-amber-500 border-amber-400' : 'bg-primary border-primary/80'
                                  : 'bg-secondary border-border/50'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {pointsRemaining < 0 && <p className="text-destructive text-sm text-center font-mono">Distribua menos {Math.abs(pointsRemaining)} ponto{Math.abs(pointsRemaining) > 1 ? 's' : ''}.</p>}
                {pointsRemaining > 0 && <p className="text-amber-400/70 text-xs text-center font-mono">Você ainda tem pontos para distribuir — não é obrigatório usá-los.</p>}
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-xl font-display text-primary border-b border-border/50 pb-2">V. PERÍCIAS TREINADAS</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-2">
                  {pericias?.map((p) => {
                    const isSelected = form.watch("pericias")?.includes(p.id);
                    return (
                      <div 
                        key={p.id}
                        onClick={() => {
                          const current = form.getValues("pericias") || [];
                          if (isSelected) {
                            form.setValue("pericias", current.filter(id => id !== p.id));
                          } else {
                            form.setValue("pericias", [...current, p.id]);
                          }
                        }}
                        className={`cursor-pointer p-3 border rounded-sm flex justify-between items-center transition-all ${isSelected ? 'border-primary bg-primary/20 text-primary-foreground' : 'border-border bg-secondary/30 text-muted-foreground'}`}
                      >
                        <span className="font-sans text-sm font-semibold">{p.nome}</span>
                        <span className="text-xs opacity-50 font-display">{p.atributoBase}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)}>VOLTAR</Button>
            ) : <div />}
            
            {step < 5 ? (
              <Button type="button" onClick={nextStep}>AVANÇAR</Button>
            ) : (
              <Button type="submit" disabled={createMut.isPending || pointsRemaining < 0} className="animate-pulse hover:animate-none">
                {createMut.isPending ? "REGISTRANDO..." : "FINALIZAR DOSSIÊ"}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
