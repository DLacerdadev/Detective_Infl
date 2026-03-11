import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skull } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-6">
        <Skull className="w-24 h-24 mx-auto text-destructive opacity-80" />
        <h1 className="text-4xl font-display font-bold">ERRO 404</h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Este arquivo foi expurgado ou a entidade que você procura rasgou a membrana para outra dimensão.
        </p>
        <Button asChild variant="outline" className="mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          <Link href="/">RETORNAR À BASE</Link>
        </Button>
      </div>
    </div>
  );
}
