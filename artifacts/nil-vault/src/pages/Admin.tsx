import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Search, ChevronRight } from "lucide-react";
import { isPast } from "date-fns";

interface AthleteRow {
  id: string;
  full_name: string | null;
  sport: string | null;
  school: string | null;
  email: string;
  dealCount: number;
  totalEarned: number;
  overdue: boolean;
}

export default function Admin() {
  const { profile } = useAuthStore();
  const [, setLocation] = useLocation();
  const [athletes, setAthletes] = useState<AthleteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!profile?.program_id) return;

    const load = async () => {
      // Fetch all athletes in same program
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, sport, school, email")
        .eq("program_id", profile.program_id)
        .eq("role", "athlete");

      if (!profiles) { setLoading(false); return; }

      // Fetch deals for all athletes
      const ids = profiles.map((p) => p.id);
      const { data: deals } = await supabase
        .from("deals")
        .select("id, athlete_id, status, deadline")
        .in("athlete_id", ids);

      const { data: payments } = await supabase
        .from("payments")
        .select("athlete_id, amount")
        .in("athlete_id", ids);

      const rows: AthleteRow[] = profiles.map((p) => {
        const athDeals = (deals ?? []).filter((d) => d.athlete_id === p.id);
        const athPayments = (payments ?? []).filter((pay) => pay.athlete_id === p.id);
        const totalEarned = athPayments.reduce((s, pay) => s + Number(pay.amount), 0);
        const overdue = athDeals.some(
          (d) => d.deadline && isPast(new Date(d.deadline)) && d.status !== "paid"
        );
        return {
          id: p.id,
          full_name: p.full_name,
          sport: p.sport,
          school: p.school,
          email: p.email,
          dealCount: athDeals.length,
          totalEarned,
          overdue,
        };
      });

      setAthletes(rows);
      setLoading(false);
    };

    load();
  }, [profile]);

  const filtered = athletes.filter((a) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (a.full_name ?? "").toLowerCase().includes(q) ||
      (a.sport ?? "").toLowerCase().includes(q) ||
      (a.school ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-headline text-3xl text-foreground tracking-wide">Program Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Read-only view — {profile?.school ?? "your program"}
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-card-border rounded-xl p-5">
          <p className="text-2xl font-bold font-mono text-foreground">{athletes.length}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono mt-1">Athletes</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-5">
          <p className="text-2xl font-bold font-mono text-primary">
            ${athletes.reduce((s, a) => s + a.totalEarned, 0).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono mt-1">Program Earnings</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-5">
          <p className="text-2xl font-bold font-mono text-destructive">
            {athletes.filter((a) => a.overdue).length}
          </p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono mt-1">Overdue Flags</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search athletes..."
          className="bg-card border-card-border pl-9"
          data-testid="input-search"
        />
      </div>

      {/* Athletes table */}
      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border">
              <th className="text-left px-6 py-3 text-xs uppercase tracking-wider font-mono text-muted-foreground">Athlete</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-mono text-muted-foreground hidden sm:table-cell">Sport</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-mono text-muted-foreground">Deals</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-mono text-muted-foreground">Earned</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-mono text-muted-foreground">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-3" colSpan={6}><Skeleton className="h-8 w-full" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td className="px-6 py-8 text-center text-muted-foreground text-sm" colSpan={6}>
                  No athletes found{search ? ` matching "${search}"` : " in this program"}.
                </td>
              </tr>
            ) : (
              filtered.map((athlete) => (
                <tr
                  key={athlete.id}
                  className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                  onClick={() => setLocation(`/admin/athlete/${athlete.id}`)}
                  data-testid={`athlete-row-${athlete.id}`}
                >
                  <td className="px-6 py-3">
                    <p className="font-medium text-foreground">{athlete.full_name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{athlete.email}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{athlete.sport ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-foreground">{athlete.dealCount}</td>
                  <td className="px-4 py-3 font-mono font-bold text-primary">
                    ${athlete.totalEarned.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {athlete.overdue ? (
                      <span className="flex items-center gap-1 text-destructive text-xs">
                        <AlertTriangle className="w-3.5 h-3.5" /> Overdue
                      </span>
                    ) : (
                      <span className="text-emerald-400 text-xs">Clear</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
