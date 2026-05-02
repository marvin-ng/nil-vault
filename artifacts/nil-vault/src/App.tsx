import { useEffect } from "react";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/authStore";

import Login from "@/pages/Login";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Deals from "@/pages/Deals";
import DealDetail from "@/pages/DealDetail";
import Compliance from "@/pages/Compliance";
import Income from "@/pages/Income";
import Admin from "@/pages/Admin";
import AdminAthlete from "@/pages/AdminAthlete";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, adminOnly = false }: {
  component: React.ComponentType;
  adminOnly?: boolean;
}) {
  const { session, profile, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <Redirect to="/login" />;
  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (profile && !profile.full_name && !profile.sport) {
    return <Redirect to="/onboarding" />;
  }

  if (adminOnly && profile.role !== "admin") return <Redirect to="/dashboard" />;

  return (
    <Layout>
      <Component />
    </Layout>
  );
}

function AuthRoute({ component: Component }: { component: React.ComponentType }) {
  const { session, profile } = useAuthStore();

  if (session && profile) {
    if (profile.role === "admin") return <Redirect to="/admin" />;
    return <Redirect to="/dashboard" />;
  }

  return <Component />;
}

function Router() {
  const [location] = useLocation();
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // suppress unused warning
  void location;

  return (
    <Switch>
      <Route path="/login" component={() => <AuthRoute component={Login} />} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/deals/:id" component={() => <ProtectedRoute component={DealDetail} />} />
      <Route path="/deals" component={() => <ProtectedRoute component={Deals} />} />
      <Route path="/compliance" component={() => <ProtectedRoute component={Compliance} />} />
      <Route path="/income" component={() => <ProtectedRoute component={Income} />} />
      <Route path="/admin/athlete/:id" component={() => <ProtectedRoute component={AdminAthlete} adminOnly />} />
      <Route path="/admin" component={() => <ProtectedRoute component={Admin} adminOnly />} />
      <Route path="/" component={() => <Redirect to="/dashboard" />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
