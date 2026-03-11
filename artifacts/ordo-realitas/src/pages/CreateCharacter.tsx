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
  forca: z.number().min(1).max(5),
  agilidade: z.number().min(1).max(5),
  intelecto: z.number().min(1).max(5),
  vigor: z.number().min(1).max(5),
  presenca: z.number().min(1).max(5),
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
                  <div className={`font-display text-sm px-3 py-1 rounded-sm ${pointsRemaining === 0 ? 'bg-green-900/30 text-green-500' : pointsRemaining < 0 ? 'bg-destructive/30 text-destructive' : 'bg-secondary text-foreground'}`}>
                    PONTOS: {pointsRemaining}
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center py-8">
                  {/* Pentagram layout for attributes could go here, for now a list */}
                  <div className="w-full max-w-md space-y-6 bg-background/50 p-6 rounded-sm border border-border">
                    {(['forca', 'agilidade', 'intelecto', 'vigor', 'presenca'] as const).map((attr) => (
                      <div key={attr} className="flex items-center justify-between">
                        <Label className="w-32 text-lg">{attr.toUpperCase()}</Label>
                        <div className="flex items-center space-x-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                            onClick={() => form.setValue(attr, Math.max(1, form.getValues(attr) - 1))}
                          >-</Button>
                          <span className="w-8 text-center font-display text-2xl text-primary">{form.watch(attr)}</span>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                            disabled={pointsRemaining <= 0 && form.getValues(attr) < 5}
                            onClick={() => form.setValue(attr, Math.min(5, form.getValues(attr) + 1))}
                          >+</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {pointsRemaining < 0 && <p className="text-destructive text-sm text-center">Você usou pontos demais.</p>}
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
