import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, Upload, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { format, isPast } from "date-fns";

interface Deal {
  id: string;
  brand_name: string;
  amount: number | null;
  status: "inquiry" | "negotiating" | "signed" | "posted" | "paid";
  deliverable_type: string | null;
  deadline: string | null;
  source: string | null;
  notes: string | null;
  ftc_compliant: boolean | null;
  caption: string | null;
  athlete_id: string;
}

interface Deliverable {
  id: string;
  deal_id: string;
  title: string;
  completed: boolean;
  due_date: string | null;
}

interface Payment {
  id: string;
  amount: number;
  paid_at: string;
  notes: string | null;
}

interface Document {
  id: string;
  file_name: string;
  file_url: string;
}

const STATUS_LABELS: Record<string, string> = {
  inquiry: "Inquiry",
  negotiating: "Negotiating",
  signed: "Signed",
  posted: "Posted",
  paid: "Paid",
};

export default function DealDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuthStore();

  const [deal, setDeal] = useState<Deal | null>(null);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newDeliverable, setNewDeliverable] = useState("");
  const [newPaymentAmount, setNewPaymentAmount] = useState("");
  const [newPaymentNote, setNewPaymentNote] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchAll = async () => {
    if (!id) return;
    setLoading(true);

    const [dealRes, delivRes, payRes, docRes] = await Promise.all([
      supabase.from("deals").select("*").eq("id", id).single(),
      supabase.from("deliverables").select("*").eq("deal_id", id).order("created_at"),
      supabase.from("payments").select("*").eq("deal_id", id).order("paid_at", { ascending: false }),
      supabase.from("documents").select("*").eq("deal_id", id).order("created_at"),
    ]);

    if (dealRes.data) setDeal(dealRes.data as Deal);
    setDeliverables((delivRes.data as Deliverable[]) ?? []);
    setPayments((payRes.data as Payment[]) ?? []);
    setDocuments((docRes.data as Document[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, [id]);

  const updateDeal = async (updates: Partial<Deal>) => {
    if (!deal) return;
    setSaving(true);
    const merged = { ...deal, ...updates };
    setDeal(merged);
    await supabase.from("deals").update(updates).eq("id", deal.id);
    setSaving(false);
  };

  const toggleDeliverable = async (deliv: Deliverable) => {
    const updated = { ...deliv, completed: !deliv.completed };
    setDeliverables((prev) => prev.map((d) => (d.id === deliv.id ? updated : d)));
    await supabase.from("deliverables").update({ completed: !deliv.completed }).eq("id", deliv.id);
  };

  const addDeliverable = async () => {
    if (!newDeliverable.trim() || !deal) return;
    const { data } = await supabase
      .from("deliverables")
      .insert({ deal_id: deal.id, title: newDeliverable.trim(), completed: false })
      .select()
      .single();
    if (data) setDeliverables((prev) => [...prev, data as Deliverable]);
    setNewDeliverable("");
  };

  const addPayment = async () => {
    if (!newPaymentAmount || !deal || !user) return;
    const { data } = await supabase
      .from("payments")
      .insert({
        deal_id: deal.id,
        athlete_id: user.id,
        amount: Number(newPaymentAmount),
        notes: newPaymentNote || null,
        paid_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (data) {
      setPayments((prev) => [data as Payment, ...prev]);
      setNewPaymentAmount("");
      setNewPaymentNote("");
    }
  };

  const uploadContract = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !deal || !user) return;
    const file = e.target.files[0];
    setUploading(true);
    const path = `${user.id}/${deal.id}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("contracts")
      .upload(path, file, { upsert: true });

    if (!uploadError) {
      const { data: urlData } = supabase.storage.from("contracts").getPublicUrl(path);
      const { data } = await supabase
        .from("documents")
        .insert({
          deal_id: deal.id,
          athlete_id: user.id,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_type: file.type,
        })
        .select()
        .single();
      if (data) setDocuments((prev) => [...prev, data as Document]);
    }
    setUploading(false);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Deal not found.
      </div>
    );
  }

  const isOverdue = deal.deadline && isPast(new Date(deal.deadline)) && deal.status !== "paid";
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back + header */}
      <button
        onClick={() => setLocation("/deals")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
        data-testid="button-back"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Pipeline
      </button>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline text-3xl text-foreground tracking-wide">{deal.brand_name}</h1>
          {isOverdue && (
            <span className="text-xs text-destructive font-mono font-medium mt-1 inline-block">
              OVERDUE
            </span>
          )}
        </div>
        {saving && <span className="text-xs text-muted-foreground font-mono animate-pulse">Saving...</span>}
      </div>

      {/* Deal fields */}
      <div className="bg-card border border-card-border rounded-xl p-6 mb-6">
        <h2 className="text-xs uppercase tracking-wider font-mono text-muted-foreground mb-4">Deal Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider block mb-1.5">Brand</label>
            <Input
              value={deal.brand_name}
              onChange={(e) => setDeal({ ...deal, brand_name: e.target.value })}
              onBlur={() => updateDeal({ brand_name: deal.brand_name })}
              className="bg-background"
              data-testid="input-brand-name"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider block mb-1.5">Deliverable</label>
            <Input
              value={deal.deliverable_type ?? ""}
              onChange={(e) => setDeal({ ...deal, deliverable_type: e.target.value })}
              onBlur={() => updateDeal({ deliverable_type: deal.deliverable_type })}
              className="bg-background"
              data-testid="input-deliverable"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider block mb-1.5">Amount</label>
            <Input
              type="number"
              value={deal.amount ?? ""}
              onChange={(e) => setDeal({ ...deal, amount: e.target.value ? Number(e.target.value) : null })}
              onBlur={() => updateDeal({ amount: deal.amount })}
              className="bg-background font-mono"
              data-testid="input-amount"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider block mb-1.5">Deadline</label>
            <Input
              type="date"
              value={deal.deadline ?? ""}
              onChange={(e) => setDeal({ ...deal, deadline: e.target.value || null })}
              onBlur={() => updateDeal({ deadline: deal.deadline })}
              className="bg-background"
              data-testid="input-deadline"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider block mb-1.5">Status</label>
            <Select
              value={deal.status}
              onValueChange={(v) => updateDeal({ status: v as Deal["status"] })}
            >
              <SelectTrigger className="bg-background" data-testid="select-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider block mb-1.5">FTC Status</label>
            <div className="flex items-center gap-2 h-10">
              {deal.ftc_compliant ? (
                <span className="flex items-center gap-1.5 text-emerald-400 text-sm">
                  <CheckCircle2 className="w-4 h-4" /> Compliant
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <XCircle className="w-4 h-4" /> Not checked
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Deliverables checklist */}
      <div className="bg-card border border-card-border rounded-xl p-6 mb-6">
        <h2 className="text-xs uppercase tracking-wider font-mono text-muted-foreground mb-4">Deliverables Checklist</h2>
        <div className="space-y-2 mb-4">
          {deliverables.length === 0 && (
            <p className="text-sm text-muted-foreground">No deliverables yet. Add what you agreed to deliver.</p>
          )}
          {deliverables.map((deliv) => (
            <div key={deliv.id} className="flex items-center gap-3 py-1" data-testid={`deliverable-${deliv.id}`}>
              <Checkbox
                checked={deliv.completed}
                onCheckedChange={() => toggleDeliverable(deliv)}
                id={deliv.id}
              />
              <label
                htmlFor={deliv.id}
                className={`text-sm cursor-pointer select-none ${deliv.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
              >
                {deliv.title}
              </label>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newDeliverable}
            onChange={(e) => setNewDeliverable(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addDeliverable()}
            placeholder="Add deliverable..."
            className="bg-background text-sm"
            data-testid="input-new-deliverable"
          />
          <Button
            onClick={addDeliverable}
            variant="outline"
            size="icon"
            className="shrink-0"
            data-testid="button-add-deliverable"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Payment log */}
      <div className="bg-card border border-card-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Payment Log</h2>
          {totalPaid > 0 && (
            <span className="text-primary font-mono font-bold text-sm">${totalPaid.toLocaleString()} total</span>
          )}
        </div>
        {payments.length === 0 ? (
          <p className="text-sm text-muted-foreground mb-4">No payments logged yet.</p>
        ) : (
          <div className="space-y-2 mb-4">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-card-border last:border-0" data-testid={`payment-${p.id}`}>
                <div>
                  <p className="text-sm font-mono font-semibold text-primary">${Number(p.amount).toLocaleString()}</p>
                  {p.notes && <p className="text-xs text-muted-foreground">{p.notes}</p>}
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {format(new Date(p.paid_at), "MMM d, yyyy")}
                </span>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            type="number"
            value={newPaymentAmount}
            onChange={(e) => setNewPaymentAmount(e.target.value)}
            placeholder="Amount"
            className="bg-background text-sm w-28 font-mono"
            data-testid="input-payment-amount"
          />
          <Input
            value={newPaymentNote}
            onChange={(e) => setNewPaymentNote(e.target.value)}
            placeholder="Note (optional)"
            className="bg-background text-sm flex-1"
            data-testid="input-payment-note"
          />
          <Button
            onClick={addPayment}
            className="bg-primary text-primary-foreground shrink-0 text-sm"
            data-testid="button-log-payment"
          >
            Log
          </Button>
        </div>
      </div>

      {/* Contract uploads */}
      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-xs uppercase tracking-wider font-mono text-muted-foreground mb-4">Contract & Documents</h2>
        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground mb-4">No documents uploaded. Upload your contract.</p>
        ) : (
          <div className="space-y-2 mb-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between py-2 border-b border-card-border last:border-0">
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline truncate"
                  data-testid={`document-${doc.id}`}
                >
                  {doc.file_name}
                </a>
              </div>
            ))}
          </div>
        )}
        <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-dashed border-card-border px-4 py-2.5 rounded-lg hover:border-primary/40">
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload Document"}
          <input
            type="file"
            className="hidden"
            onChange={uploadContract}
            accept=".pdf,.doc,.docx,.png,.jpg"
            data-testid="input-file-upload"
          />
        </label>
      </div>
    </div>
  );
}
