import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = z.object({
  brand_name: z.string().min(1, "Brand name is required"),
  deliverable_type: z.string().optional(),
  amount: z.string().optional(),
  deadline: z.string().optional(),
  source: z.enum(["dm", "email", "other"]).default("dm"),
  status: z.enum(["inquiry", "negotiating", "signed", "posted", "paid"]).default("inquiry"),
});
type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  initialStatus?: string;
}

export function AddDealModal({ open, onClose, onCreated, initialStatus = "inquiry" }: Props) {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      brand_name: "",
      deliverable_type: "",
      amount: "",
      deadline: "",
      source: "dm",
      status: initialStatus as FormValues["status"],
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { error: insertError } = await supabase.from("deals").insert({
        athlete_id: user.id,
        brand_name: values.brand_name,
        deliverable_type: values.deliverable_type || null,
        amount: values.amount ? Number(values.amount) : null,
        deadline: values.deadline || null,
        source: values.source,
        status: values.status,
      });
      if (insertError) throw insertError;
      form.reset();
      onCreated();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create deal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-card-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl tracking-wide">New Deal</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="brand_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Brand Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nike, Gatorade, ..." className="bg-background" data-testid="input-brand-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliverable_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Deliverable</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Instagram post, TikTok, YouTube, ..." className="bg-background" data-testid="input-deliverable" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Amount ($)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="500" className="bg-background" data-testid="input-amount" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Deadline</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" className="bg-background" data-testid="input-deadline" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Source</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background" data-testid="select-source">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="dm">DM</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Stage</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background" data-testid="select-status">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="inquiry">Inquiry</SelectItem>
                        <SelectItem value="negotiating">Negotiating</SelectItem>
                        <SelectItem value="signed">Signed</SelectItem>
                        <SelectItem value="posted">Posted</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button
                type="submit"
                className="bg-primary text-primary-foreground font-semibold"
                disabled={loading}
                data-testid="button-create-deal"
              >
                {loading ? "Creating..." : "Log Deal"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
