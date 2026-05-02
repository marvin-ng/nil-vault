import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

interface Payment {
  id: string;
  deal_id: string;
  amount: number;
  paid_at: string;
  notes: string | null;
  deals?: { brand_name: string };
}

interface ChartPoint {
  month: string;
  amount: number;
}

export default function Income() {
  const { user } = useAuthStore();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase
      .from("payments")
      .select("*, deals(brand_name)")
      .eq("athlete_id", user.id)
      .order("paid_at", { ascending: false })
      .then(({ data }) => {
        const rows = (data as Payment[]) ?? [];
        setPayments(rows);

        // Build monthly chart data for last 12 months
        const now = new Date();
        const points: ChartPoint[] = [];
        for (let i = 11; i >= 0; i--) {
          const monthDate = subMonths(now, i);
          const start = startOfMonth(monthDate);
          const end = endOfMonth(monthDate);
          const total = rows
            .filter((p) => {
              const d = new Date(p.paid_at);
              return d >= start && d <= end;
            })
            .reduce((sum, p) => sum + Number(p.amount), 0);
          points.push({
            month: format(monthDate, "MMM"),
            amount: total,
          });
        }
        setChartData(points);
        setLoading(false);
      });
  }, [user]);

  const totalEarned = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const avgMonthly = chartData.length
    ? chartData.reduce((s, c) => s + c.amount, 0) / chartData.filter((c) => c.amount > 0).length || 0
    : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-headline text-3xl text-foreground tracking-wide">Income</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Payment history and monthly earnings</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-card border border-card-border rounded-xl p-5">
          {loading ? <Skeleton className="h-8 w-24" /> : (
            <p className="text-3xl font-bold font-mono text-primary">${totalEarned.toLocaleString()}</p>
          )}
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono mt-1">Total Earned</p>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-5">
          {loading ? <Skeleton className="h-8 w-24" /> : (
            <p className="text-3xl font-bold font-mono text-foreground">
              {avgMonthly > 0 ? `$${Math.round(avgMonthly).toLocaleString()}` : "$0"}
            </p>
          )}
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono mt-1">Avg / Active Month</p>
        </div>
      </div>

      {/* Monthly bar chart */}
      <div className="bg-card border border-card-border rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-6">Monthly Earnings (Last 12 Months)</h2>
        {loading ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="month"
                tick={{ fill: "hsl(0 0% 50%)", fontSize: 11, fontFamily: "DM Mono" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(0 0% 50%)", fontSize: 10, fontFamily: "DM Mono" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v > 0 ? `$${(v / 1000).toFixed(0)}k` : ""}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0 0% 7%)",
                  border: "1px solid hsl(0 0% 12%)",
                  borderRadius: "8px",
                  color: "hsl(0 0% 95%)",
                  fontFamily: "DM Mono",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Earned"]}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.amount > 0 ? "hsl(41 80% 60%)" : "hsl(0 0% 10%)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Payment log table */}
      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-card-border">
          <h2 className="text-sm font-semibold text-foreground">Payment History</h2>
        </div>
        {loading ? (
          <div className="p-6 space-y-2">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : payments.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">
            No payments logged yet. Log your first payment on a deal's detail page.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border">
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider font-mono text-muted-foreground">Brand</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-mono text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-mono text-muted-foreground hidden sm:table-cell">Note</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-mono text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02]" data-testid={`payment-row-${p.id}`}>
                  <td className="px-6 py-3 font-medium text-foreground">
                    {p.deals?.brand_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-primary">
                    ${Number(p.amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {p.notes ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                    {format(new Date(p.paid_at), "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
