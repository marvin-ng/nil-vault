import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AddDealModal } from "@/components/AddDealModal";
import { DollarSign, Briefcase, AlertTriangle, Clock, Plus, ChevronRight } from "lucide-react";
import { format, isPast, isWithinInterval, addDays } from "date-fns";

interface Deal {
  id: string;
  brand_name: string;
  amount: number | null;
  status: string;
  deadline: string | null;
  deliverable_type: string | null;
}

interface KpiData {
  totalEarned: number;
  activeDeals: number;
  overdue: number;
  pendingPayment: number;
  upcomingDeadlines: Deal[];
}

export default function Dashboard() {
  const { user, profile } = useAuthStore();
  const [, setLocation] = useLocation();
  const [kpi, setKpi] = useState<KpiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const fetchData = async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);

    const { data: deals } = await supabase
      .from("deals")
      .select("*")
      .eq("athlete_id", user.id);

    const { data: payments } = await supabase
      .from("payments")
      .select("amount")
      .eq("athlete_id", user.id);

    const totalEarned = (payments ?? []).reduce((sum, p) => sum + Number(p.amount), 0);
    const active = (deals ?? []).filter((d) => !["paid"].includes(d.status));
    const now = new Date();
    const overdue = (deals ?? []).filter(
      (d) => d.deadline && isPast(new Date(d.deadline)) && d.status !== "paid"
    );
    const pendingPayment = (deals ?? []).filter((d) => d.status === "posted");
    const upcomingDeadlines = (deals ?? [])
      .filter(
        (d) =>
          d.deadline &&
          d.status !== "paid" &&
          isWithinInterval(new Date(d.deadline), { start: now, end: addDays(now, 14) })
      )
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
      .slice(0, 5);

    setKpi({
      totalEarned,
      activeDeals: active.length,
      overdue: overdue.length,
      pendingPayment: pendingPayment.length,
      upcomingDeadlines,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const kpiCards = [
    {
      label: "Total Earned",
      value: kpi ? `$${kpi.totalEarned.toLocaleString()}` : "$0",
      icon: DollarSign,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Active Deals",
      value: kpi?.activeDeals ?? 0,
      icon: Briefcase,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Overdue",
      value: kpi?.overdue ?? 0,
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      label: "Pending Payment",
      value: kpi?.pendingPayment ?? 0,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-3xl text-foreground tracking-wide">
            {profile?.full_name ? `Welcome back, ${profile.full_name.split(" ")[0]}` : "Dashboard"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{profile?.sport} · {profile?.school}</p>
        </div>
        <Button
          onClick={() => setAddModalOpen(true)}
          className="bg-primary text-primary-foreground font-semibold gap-2"
          data-testid="button-add-deal"
        >
          <Plus className="w-4 h-4" />
          Add Deal
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="bg-card border border-card-border rounded-xl p-5"
            data-testid={`kpi-${card.label.toLowerCase().replace(/\s/g, "-")}`}
          >
            <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            {loading ? (
              <Skeleton className="h-7 w-16 mb-1" />
            ) : (
              <p className={`text-2xl font-bold font-mono ${card.color}`}>{card.value}</p>
            )}
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-card-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Upcoming Deadlines</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/deals")}
            className="text-muted-foreground text-xs gap-1"
          >
            View all <ChevronRight className="w-3 h-3" />
          </Button>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : kpi?.upcomingDeadlines.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground text-sm">No upcoming deadlines in the next 14 days.</p>
            <p className="text-muted-foreground text-xs mt-1">Time to sign more deals.</p>
          </div>
        ) : (
          <div className="divide-y divide-card-border">
            {kpi?.upcomingDeadlines.map((deal) => {
              const daysLeft = Math.ceil(
                (new Date(deal.deadline!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );
              const badgeClass =
                daysLeft <= 3 ? "text-destructive bg-destructive/10" :
                daysLeft <= 7 ? "text-amber-400 bg-amber-400/10" :
                "text-emerald-400 bg-emerald-400/10";

              return (
                <div
                  key={deal.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer transition-colors"
                  onClick={() => setLocation(`/deals/${deal.id}`)}
                  data-testid={`deadline-deal-${deal.id}`}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{deal.brand_name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{deal.deliverable_type ?? "Deliverable"}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded ${badgeClass}`}>
                      {daysLeft}d left
                    </span>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {format(new Date(deal.deadline!), "MMM d")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddDealModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onCreated={fetchData}
      />
    </div>
  );
}
