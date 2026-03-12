import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useListClasses, useListPericias } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { OrigensTab } from "@/components/OrigensTab";
import { RituaisAdminTab } from "@/components/RituaisAdminTab";

function GenericTable({ title, data, columns }: { title: string; data: any[] | undefined; columns: { key: string; label: string }[] }) {
  if (!data) return <div className="p-4 text-muted-foreground animate-pulse font-mono text-sm">Carregando...</div>;
  if (data.length === 0) return <div className="p-4 text-muted-foreground font-mono text-sm">Nenhum registro encontrado.</div>;
  return (
    <Card className="glass-panel p-4">
      <h3 className="font-display text-xl mb-4 text-primary">{title}</h3>
      <div className="rounded-sm border border-border overflow-x-auto">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className="font-display tracking-wider text-foreground">{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row: any) => (
              <TableRow key={row.id} className="border-border/50 hover:bg-secondary/30">
                {columns.map((col) => (
                  <TableCell key={col.key} className="font-sans">
                    {Array.isArray(row[col.key]) ? row[col.key].join(", ") : String(row[col.key] || "")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export default function Admin() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data: classes } = useListClasses();
  const { data: pericias } = useListPericias();

  if (isLoading) return null;
  if (user?.role !== "admin") {
    setLocation("/characters");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8 border-b border-border/50 pb-4">
        <ShieldAlert className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-display tracking-widest">PAINEL DA DIREÇÃO</h1>
          <p className="text-muted-foreground font-sans">Nível de acesso: VERÍSSIMO</p>
        </div>
      </div>

      <Tabs defaultValue="origens" className="w-full">
        <TabsList className="mb-6 bg-secondary/20 p-1 border border-border">
          <TabsTrigger value="origens">ORIGENS</TabsTrigger>
          <TabsTrigger value="classes">CLASSES</TabsTrigger>
          <TabsTrigger value="pericias">PERÍCIAS</TabsTrigger>
          <TabsTrigger value="rituais">RITUAIS</TabsTrigger>
        </TabsList>

        <TabsContent value="origens">
          <OrigensTab />
        </TabsContent>

        <TabsContent value="classes">
          <GenericTable
            title="Classes Registradas"
            data={classes}
            columns={[
              { key: "nome", label: "Nome" },
              { key: "pvPorNivel", label: "PV/Nvl" },
              { key: "pePorNivel", label: "PE/Nvl" },
              { key: "sanPorNivel", label: "SAN/Nvl" },
            ]}
          />
        </TabsContent>

        <TabsContent value="pericias">
          <GenericTable
            title="Perícias Registradas"
            data={pericias}
            columns={[
              { key: "nome", label: "Nome" },
              { key: "atributoBase", label: "Atributo Base" },
              { key: "somenteTrainada", label: "Só Treinada" },
            ]}
          />
        </TabsContent>

        <TabsContent value="rituais">
          <RituaisAdminTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
