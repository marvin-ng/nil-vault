import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DealCard } from "@/components/DealCard";

interface Deal {
  id: string;
  brand_name: string;
  amount: number | null;
  status: string;
  deadline: string | null;
  deliverable_type: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  inquiry:     { label: "Inquiry",     color: "text-muted-foreground", dot: "bg-muted-foreground" },
  negotiating: { label: "Negotiating", color: "text-amber-400",        dot: "bg-amber-400" },
  signed:      { label: "Signed",      color: "text-blue-400",         dot: "bg-blue-400" },
  posted:      { label: "Posted",      color: "text-purple-400",       dot: "bg-purple-400" },
  paid:        { label: "Paid",        color: "text-emerald-400",      dot: "bg-emerald-400" },
};

interface Props {
  status: string;
  deals: Deal[];
  onDealClick: (id: string) => void;
}

export function KanbanColumn({ status, deals, onDealClick }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = STATUS_CONFIG[status] ?? { label: status, color: "text-foreground", dot: "bg-foreground" };

  const totalValue = deals.reduce((sum, d) => sum + (d.amount ?? 0), 0);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[240px] w-[240px] bg-card border rounded-xl transition-colors ${
        isOver ? "border-primary/50 bg-primary/5" : "border-card-border"
      }`}
    >
      {/* Column header */}
      <div className="px-4 py-3 border-b border-card-border">
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          <span className={`text-xs font-semibold uppercase tracking-wider font-mono ${config.color}`}>
            {config.label}
          </span>
          <span className="ml-auto text-xs text-muted-foreground font-mono bg-muted/30 px-1.5 py-0.5 rounded">
            {deals.length}
          </span>
        </div>
        {totalValue > 0 && (
          <p className="text-xs text-muted-foreground font-mono">
            ${totalValue.toLocaleString()}
          </p>
        )}
      </div>

      {/* Cards */}
      <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 p-2 space-y-2 min-h-[120px]">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onClick={() => onDealClick(deal.id)}
            />
          ))}
          {deals.length === 0 && (
            <div className="h-20 flex items-center justify-center rounded-lg border border-dashed border-card-border">
              <p className="text-xs text-muted-foreground/50">Drop here</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
