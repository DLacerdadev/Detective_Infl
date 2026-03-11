import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Characters from "@/pages/Characters";
import CreateCharacter from "@/pages/CreateCharacter";
import CharacterSheet from "@/pages/CharacterSheet";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ component: Component, adminOnly = false }: { component: any, adminOnly?: boolean }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    }
    if (!isLoading && isAuthenticated && adminOnly && user?.role !== 'admin') {
      setLocation("/characters");
    }
  }, [isLoading, isAuthenticated, user, adminOnly, setLocation]);

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!isAuthenticated) return null;
  if (adminOnly && user?.role !== 'admin') return null;

  return <Component />;
}

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/characters">
            {() => <ProtectedRoute component={Characters} />}
          </Route>
          <Route path="/characters/new">
            {() => <ProtectedRoute component={CreateCharacter} />}
          </Route>
          <Route path="/characters/:id">
            {() => <ProtectedRoute component={CharacterSheet} />}
          </Route>
          <Route path="/admin">
            {() => <ProtectedRoute component={Admin} adminOnly={true} />}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID ?? ""}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
