import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { isPast, isWithinInterval, addDays, format } from "date-fns";

interface Deal {
  id: string;
  brand_name: string;
  amount: number | null;
  status: string;
  deadline: string | null;
  deliverable_type: string | null;
}

interface Props {
  deal: Deal;
  onClick: () => void;
}

function DeadlineBadge({ deadline }: { deadline: string | null }) {
  if (!deadline) return null;
  const date = new Date(deadline);
  const now = new Date();

  const overdue = isPast(date) ;
  const soon = !overdue && isWithinInterval(date, { start: now, end: addDays(now, 7) });

  const cls = overdue
    ? "bg-destructive/20 text-destructive border border-destructive/30"
    : soon
    ? "bg-amber-400/15 text-amber-400 border border-amber-400/30"
    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";

  return (
    <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded ${cls}`}>
      {overdue ? "OVERDUE" : format(date, "MMM d")}
    </span>
  );
}

export function DealCard({ deal, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-card border border-card-border rounded-lg p-3.5 hover:border-primary/30 transition-colors group select-none"
      data-testid={`deal-card-${deal.id}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <p className="text-sm font-semibold text-foreground leading-tight">{deal.brand_name}</p>
        {deal.amount != null && (
          <span className="text-xs font-mono font-bold text-primary shrink-0">
            ${Number(deal.amount).toLocaleString()}
          </span>
        )}
      </div>

      {deal.deliverable_type && (
        <p className="text-xs text-muted-foreground mb-2.5 truncate">{deal.deliverable_type}</p>
      )}

      <DeadlineBadge deadline={deal.deadline} />
    </div>
  );
}
