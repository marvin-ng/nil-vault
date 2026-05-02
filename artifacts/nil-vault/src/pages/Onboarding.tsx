import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const schema = z.object({
  full_name: z.string().min(2, "Enter your full name"),
  sport: z.string().min(2, "Select or enter your sport"),
  school: z.string().min(2, "Enter your school"),
  division: z.string().min(1, "Select your division"),
});
type FormValues = z.infer<typeof schema>;

const SPORTS = ["Basketball", "Football", "Baseball", "Softball", "Soccer", "Track & Field", "Swimming", "Tennis", "Golf", "Volleyball", "Lacrosse", "Wrestling", "Gymnastics", "Other"];
const DIVISIONS = ["NCAA D1", "NCAA D2", "NCAA D3", "NAIA", "NJCAA", "Other"];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { user, fetchProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", sport: "", school: "", division: "" },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email ?? "",
          ...values,
          role: "athlete",
        });
      if (upsertError) throw upsertError;
      await fetchProfile();
      setLocation("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-headline text-4xl text-primary tracking-widest mb-2">NIL VAULT</h1>
          <h2 className="text-xl font-semibold text-foreground">Set up your profile</h2>
          <p className="text-muted-foreground text-sm mt-1">This takes 30 seconds. Let's get your back office ready.</p>
        </div>

        <div className="bg-card border border-card-border rounded-xl p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs uppercase tracking-wider font-mono">Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Jordan Williams" className="bg-background" data-testid="input-full-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs uppercase tracking-wider font-mono">Sport</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background" data-testid="select-sport">
                          <SelectValue placeholder="Select your sport" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SPORTS.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs uppercase tracking-wider font-mono">School</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="University of..." className="bg-background" data-testid="input-school" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="division"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs uppercase tracking-wider font-mono">Division</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background" data-testid="select-division">
                          <SelectValue placeholder="Select division" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DIVISIONS.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <p className="text-destructive text-sm">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-semibold"
                disabled={loading}
                data-testid="button-save-profile"
              >
                {loading ? "Saving..." : "Enter the Vault"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
