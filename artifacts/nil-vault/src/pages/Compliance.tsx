import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, Download, ShieldCheck, ShieldAlert } from "lucide-react";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { DEMO_DEALS } from "@/lib/mockData";

interface Deal {
  id: string;
  brand_name: string;
  amount: number | null;
  status: string;
  deadline: string | null;
  ftc_compliant: boolean | null;
  deliverable_type: string | null;
}

const FTC_KEYWORDS = ["#ad", "#sponsored", "#partner"];

function checkFTC(caption: string): boolean {
  return FTC_KEYWORDS.some((kw) => caption.toLowerCase().includes(kw));
}

export default function Compliance() {
  const { user, profile, demoMode } = useAuthStore();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState("");
  const [ftcResult, setFtcResult] = useState<boolean | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    if (demoMode) {
      setDeals(DEMO_DEALS as Deal[]);
      setLoading(false);
      return;
    }
    if (!user) { setLoading(false); return; }
    supabase
      .from("deals")
      .select("id, brand_name, amount, status, deadline, ftc_compliant, deliverable_type")
      .eq("athlete_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setDeals((data as Deal[]) ?? []);
        setLoading(false);
      });
  }, [user, demoMode]);

  const checkCaption = async () => {
    const result = checkFTC(caption);
    setFtcResult(result);

    if (demoMode) {
      // Update local state only in demo mode
      const matchedDeal = deals.find((d) => d.status === "posted" && d.ftc_compliant !== result);
      if (matchedDeal) {
        setDeals((prev) =>
          prev.map((d) => (d.id === matchedDeal.id ? { ...d, ftc_compliant: result } : d))
        );
      }
      return;
    }

    const matchedDeal = deals.find((d) => d.status === "posted" && d.ftc_compliant !== result);
    if (matchedDeal) {
      await supabase
        .from("deals")
        .update({ ftc_compliant: result, caption })
        .eq("id", matchedDeal.id);
      setDeals((prev) =>
        prev.map((d) => (d.id === matchedDeal.id ? { ...d, ftc_compliant: result } : d))
      );
    }
  };

  const exportPDF = () => {
    const reportProfile = profile ?? {
      full_name: "Jordan Williams",
      school: "University of Texas",
      sport: "Basketball",
      division: "NCAA D1",
    };
    setExportLoading(true);

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("NIL VAULT — Compliance Report", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Athlete: ${reportProfile.full_name ?? "—"}`, 14, 32);
    doc.text(`School: ${reportProfile.school ?? "—"}  |  Sport: ${reportProfile.sport ?? "—"}  |  Division: ${reportProfile.division ?? "—"}`, 14, 39);
    doc.text(`Generated: ${format(new Date(), "MMMM d, yyyy")}`, 14, 46);

    const totalEarned = deals.reduce((s, d) => s + (d.amount ?? 0), 0);
    const compliantCount = deals.filter((d) => d.ftc_compliant).length;
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 14, 58);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Deals: ${deals.length}   Total Earned: $${totalEarned.toLocaleString()}   FTC Compliant: ${compliantCount}/${deals.length}`, 14, 65);

    let y = 78;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Brand", 14, y);
    doc.text("Deliverable", 55, y);
    doc.text("Amount", 110, y);
    doc.text("Status", 135, y);
    doc.text("Deadline", 160, y);
    doc.text("FTC", 190, y);

    doc.setDrawColor(200, 200, 200);
    doc.line(14, y + 2, pageWidth - 14, y + 2);

    y += 8;
    doc.setFont("helvetica", "normal");

    for (const deal of deals) {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text((deal.brand_name ?? "").slice(0, 18), 14, y);
      doc.text((deal.deliverable_type ?? "—").slice(0, 18), 55, y);
      doc.text(deal.amount != null ? `$${Number(deal.amount).toLocaleString()}` : "—", 110, y);
      doc.text(deal.status ?? "—", 135, y);
      doc.text(deal.deadline ? format(new Date(deal.deadline), "MM/dd/yy") : "—", 160, y);
      doc.text(deal.ftc_compliant ? "Yes" : "No", 190, y);
      y += 7;
    }

    const name = reportProfile.full_name?.replace(/\s+/g, "-") ?? "report";
    doc.save(`NIL-Vault-Compliance-${name}-${format(new Date(), "yyyy-MM-dd")}.pdf`);
    setExportLoading(false);
  };

  const compliantCount = deals.filter((d) => d.ftc_compliant).length;
  const nonCompliantCount = deals.filter((d) => d.status === "posted" && !d.ftc_compliant).length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-3xl text-foreground tracking-wide">Compliance</h1>
          <p className="text-muted-foreground text-sm mt-0.5">FTC disclosure checker + compliance history</p>
        </div>
        <Button
          onClick={exportPDF}
          disabled={exportLoading || loading}
          className="bg-primary text-primary-foreground font-semibold gap-2"
          data-testid="button-export-pdf"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-card border border-card-border rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold font-mono text-emerald-400">{compliantCount}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono">FTC Compliant</p>
          </div>
        </div>
        <div className="bg-card border border-card-border rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <p className="text-2xl font-bold font-mono text-destructive">{nonCompliantCount}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono">Needs Review</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-1">FTC Caption Checker</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Paste your post caption. NIL Vault checks for{" "}
          <span className="font-mono text-primary">#ad</span>,{" "}
          <span className="font-mono text-primary">#sponsored</span>, or{" "}
          <span className="font-mono text-primary">#partner</span>.
        </p>
        <Textarea
          value={caption}
          onChange={(e) => {
            setCaption(e.target.value);
            setFtcResult(null);
          }}
          placeholder="Just tried @Brand's new product and honestly love it…"
          className="bg-background mb-3 min-h-[100px] font-mono text-sm"
          data-testid="textarea-caption"
        />
        {ftcResult !== null && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg mb-3 text-sm font-medium ${
              ftcResult
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-destructive/10 text-destructive border border-destructive/20"
            }`}
            data-testid="text-ftc-result"
          >
            {ftcResult ? (
              <><CheckCircle2 className="w-4 h-4" /> FTC Compliant — disclosure detected</>
            ) : (
              <><XCircle className="w-4 h-4" /> Missing disclosure — add #ad, #sponsored, or #partner</>
            )}
          </div>
        )}
        <Button
          onClick={checkCaption}
          disabled={!caption.trim()}
          className="bg-primary text-primary-foreground font-semibold"
          data-testid="button-check-ftc"
        >
          Check Caption
        </Button>
      </div>

      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-card-border">
          <h2 className="text-sm font-semibold text-foreground">Deal Compliance History</h2>
        </div>
        {loading ? (
          <div className="p-6 space-y-2">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : deals.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">
            No deals yet. Log your first brand deal to track compliance.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border">
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider font-mono text-muted-foreground">Brand</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-mono text-muted-foreground hidden sm:table-cell">Deliverable</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-mono text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider font-mono text-muted-foreground">FTC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {deals.map((deal) => (
                <tr key={deal.id} className="hover:bg-white/[0.02]" data-testid={`compliance-row-${deal.id}`}>
                  <td className="px-6 py-3 font-medium text-foreground">{deal.brand_name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{deal.deliverable_type ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono capitalize text-muted-foreground">{deal.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {deal.ftc_compliant === true ? (
                      <span className="flex items-center gap-1 text-emerald-400 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Yes
                      </span>
                    ) : deal.status === "posted" ? (
                      <span className="flex items-center gap-1 text-destructive text-xs">
                        <XCircle className="w-3.5 h-3.5" /> Pending
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50 text-xs">—</span>
                    )}
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
