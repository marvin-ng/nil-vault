import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { KanbanColumn } from "@/components/KanbanColumn";
import { DealCard } from "@/components/DealCard";
import { AddDealModal } from "@/components/AddDealModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DEMO_DEALS } from "@/lib/mockData";

interface Deal {
  id: string;
  brand_name: string;
  amount: number | null;
  status: "inquiry" | "negotiating" | "signed" | "posted" | "paid";
  deadline: string | null;
  deliverable_type: string | null;
}

const STATUSES = ["inquiry", "negotiating", "signed", "posted", "paid"] as const;

export default function Deals() {
  const { user, demoMode } = useAuthStore();
  const [, setLocation] = useLocation();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const fetchDeals = useCallback(async () => {
    if (demoMode) {
      setDeals(DEMO_DEALS as Deal[]);
      setLoading(false);
      return;
    }
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("deals")
      .select("id, brand_name, amount, status, deadline, deliverable_type")
      .eq("athlete_id", user.id)
      .order("created_at", { ascending: false });
    setDeals((data as Deal[]) ?? []);
    setLoading(false);
  }, [user, demoMode]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const dealId = active.id as string;
    const newStatus = over.id as Deal["status"];

    if (!STATUSES.includes(newStatus)) return;

    const deal = deals.find((d) => d.id === dealId);
    if (!deal || deal.status === newStatus) return;

    // Optimistic update always
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, status: newStatus } : d))
    );

    // Persist only for real accounts
    if (!demoMode) {
      await supabase
        .from("deals")
        .update({ status: newStatus })
        .eq("id", dealId);
    }
  };

  const activeDeal = deals.find((d) => d.id === activeId);

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="font-headline text-3xl text-foreground tracking-wide">Deal Pipeline</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {deals.length} deal{deals.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => setAddModalOpen(true)}
          className="bg-primary text-primary-foreground font-semibold gap-2"
          data-testid="button-add-deal"
          disabled={demoMode}
          title={demoMode ? "Sign in to add deals" : undefined}
        >
          <Plus className="w-4 h-4" />
          Add Deal
        </Button>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUSES.map((s) => (
            <div key={s} className="min-w-[240px] w-[240px] bg-card border border-card-border rounded-xl p-3 space-y-2">
              <Skeleton className="h-5 w-24 mb-3" />
              {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
            </div>
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
            {STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                deals={deals.filter((d) => d.status === status)}
                onDealClick={(id) => !demoMode && setLocation(`/deals/${id}`)}
              />
            ))}
          </div>
          <DragOverlay>
            {activeDeal && <DealCard deal={activeDeal} onClick={() => {}} />}
          </DragOverlay>
        </DndContext>
      )}

      <AddDealModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onCreated={fetchDeals}
      />
    </div>
  );
}
