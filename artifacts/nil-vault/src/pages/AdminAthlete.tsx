import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { format, isPast } from "date-fns";

interface Profile {
  id: string;
  full_name: string | null;
  sport: string | null;
  school: string | null;
  division: string | null;
  email: string;
}

interface Deal {
  id: string;
  brand_name: string;
  amount: number | null;
  status: string;
  deadline: string | null;
  deliverable_type: string | null;
  ftc_compliant: boolean | null;
}

const STATUS_COLORS: Record<string, string> = {
  inquiry: "text-muted-foreground bg-muted/30",
  negotiating: "text-amber-400 bg-amber-400/10",
  signed: "text-blue-400 bg-blue-400/10",
  posted: "text-purple-400 bg-purple-400/10",
  paid: "text-emerald-400 bg-emerald-400/10",
};

export default function AdminAthlete() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const [profRes, dealRes, payRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).single(),
        supabase.from("deals").select("*").eq("athlete_id", id).order("created_at", { ascending: false }),
        supabase.from("payments").select("amount").eq("athlete_id", id),
      ]);

      if (profRes.data) setProfile(profRes.data as Profile);
      setDeals((dealRes.data as Deal[]) ?? []);
      const earned = ((payRes.data as { amount: number }[]) ?? []).reduce((s, p) => s + Number(p.amount), 0);
      setTotalEarned(earned);
      setLoading(false);
    };
    load();
  }, [id]);

  const overdueCount = deals.filter(
    (d) => d.deadline && isPast(new Date(d.deadline)) && d.status !== "paid"
  ).length;
  const compliantCount = deals.filter((d) => d.ftc_compliant).length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => setLocation("/admin")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
        data-testid="button-back"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Program
      </button>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="font-headline text-3xl text-foreground tracking-wide">
              {profile?.full_name ?? "Athlete"}
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {profile?.sport} · {profile?.school} · {profile?.division}
            </p>
            <p className="text-muted-foreground text-xs mt-0.5">{profile?.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/20 px-2 py-1 rounded border border-card-border">
              Read-only view
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: "Total Earned", value: `$${totalEarned.toLocaleString()}`, color: "text-primary" },
              { label: "Total Deals", value: deals.length, color: "text-foreground" },
              { label: "Overdue", value: overdueCount, color: overdueCount > 0 ? "text-destructive" : "text-emerald-400" },
              { label: "FTC Compliant", value: `${compliantCount}/${deals.length}`, color: "text-foreground" },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-card border border-card-border rounded-xl p-4">
                <p className={`text-xl font-bold font-mono ${kpi.color}`}>{kpi.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono mt-1">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* Deals table */}
          <div className="bg-card border border-card-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-card-border">
              <h2 className="text-sm font-semibold text-foreground">Deal Pipeline</h2>
            </div>
            {deals.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground text-sm">
                No deals logged yet.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-card-border">
                    <th className="text-left px-6 py-3 text-xs uppercase tracking-wider font-mono text-muted-foreground">Brand</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-mono text-muted-foreground hidden sm:table-cell">Deliverable</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-mono text-muted-foreground">Amount</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-mono text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-mono text-muted-foreground">Deadline</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-mono text-muted-foreground">FTC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  {deals.map((deal) => {
                    const overdue = deal.deadline && isPast(new Date(deal.deadline)) && deal.status !== "paid";
                    return (
                      <tr key={deal.id} className="hover:bg-white/[0.02]" data-testid={`admin-deal-row-${deal.id}`}>
                        <td className="px-6 py-3 font-medium text-foreground">{deal.brand_name}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{deal.deliverable_type ?? "—"}</td>
                        <td className="px-4 py-3 font-mono text-primary font-bold">
                          {deal.amount != null ? `$${Number(deal.amount).toLocaleString()}` : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-mono px-2 py-0.5 rounded capitalize ${STATUS_COLORS[deal.status] ?? ""}`}>
                            {deal.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          {deal.deadline ? (
                            <span className={overdue ? "text-destructive" : "text-muted-foreground"}>
                              {format(new Date(deal.deadline), "MMM d, yyyy")}
                              {overdue && " ⚠"}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-4 py-3">
                          {deal.ftc_compliant === true ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-muted-foreground/40" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
