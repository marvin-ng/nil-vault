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
import { useState, useEffect } from "react";
import { LogIn, Database, Copy, Check, ExternalLink } from "lucide-react";

const schema = z.object({
  full_name: z.string().min(2, "Enter your full name"),
  sport: z.string().min(2, "Select or enter your sport"),
  school: z.string().min(2, "Enter your school"),
  division: z.string().min(1, "Select your division"),
});
type FormValues = z.infer<typeof schema>;

const SPORTS = ["Basketball", "Football", "Baseball", "Softball", "Soccer", "Track & Field", "Swimming", "Tennis", "Golf", "Volleyball", "Lacrosse", "Wrestling", "Gymnastics", "Other"];
const DIVISIONS = ["NCAA D1", "NCAA D2", "NCAA D3", "NAIA", "NJCAA", "Other"];

type DbStatus = "checking" | "ok" | "missing";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { user, fetchProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<DbStatus>("checking");
  const [copied, setCopied] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", sport: "", school: "", division: "" },
  });

  // Quick DB health check on mount
  useEffect(() => {
    const check = async () => {
      try {
        const { error } = await supabase.from("profiles").select("id").limit(1);
        if (error && (error.code === "42P01" || error.message.includes("does not exist"))) {
          setDbStatus("missing");
        } else {
          setDbStatus("ok");
        }
      } catch {
        setDbStatus("missing");
      }
    };
    check();
  }, []);

  const copySql = async () => {
    try {
      const res = await fetch("/supabase-schema.sql");
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      setError("Your session has expired. Please sign in again.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Use update first (trigger auto-creates the row on signup), fall back to upsert
      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email ?? "",
          ...values,
          role: "athlete",
        }, { onConflict: "id" });

      if (upsertError) {
        if (upsertError.code === "42P01") {
          throw new Error("Database tables not found. Run supabase-schema.sql in your Supabase SQL Editor first.");
        }
        throw upsertError;
      }
      await fetchProfile();
      setLocation("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-headline text-4xl text-primary tracking-widest mb-2">NIL VAULT</h1>
          <h2 className="text-xl font-semibold text-foreground">Set up your profile</h2>
          <p className="text-muted-foreground text-sm mt-1">This takes 30 seconds. Let's get your back office ready.</p>
        </div>

        {/* DB not set up banner */}
        {dbStatus === "missing" && (
          <div className="bg-destructive/10 border border-destructive/25 rounded-xl px-5 py-4 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-destructive shrink-0" />
              <p className="text-sm text-destructive font-semibold">Database not set up yet</p>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              The profiles table is missing. You need to run the schema SQL in your Supabase project before you can save your profile.
            </p>
            <ol className="text-xs text-muted-foreground space-y-1.5 mb-4 list-none">
              <li className="flex items-start gap-2"><span className="text-primary font-mono font-bold shrink-0">1.</span> Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">Supabase Dashboard <ExternalLink className="w-3 h-3" /></a></li>
              <li className="flex items-start gap-2"><span className="text-primary font-mono font-bold shrink-0">2.</span> Open <span className="font-mono bg-muted/30 px-1 rounded">SQL Editor → New Query</span></li>
              <li className="flex items-start gap-2"><span className="text-primary font-mono font-bold shrink-0">3.</span> Paste and run the schema SQL (copy button below)</li>
              <li className="flex items-start gap-2"><span className="text-primary font-mono font-bold shrink-0">4.</span> Come back here and refresh</li>
            </ol>
            <div className="flex gap-2">
              <Button
                onClick={copySql}
                size="sm"
                className="bg-primary text-primary-foreground text-xs gap-1.5"
              >
                {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Schema SQL</>}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
              >
                Open Supabase
              </Button>
            </div>
          </div>
        )}

        {/* Session warning when no user */}
        {dbStatus !== "missing" && !user && (
          <div className="bg-amber-400/10 border border-amber-400/25 rounded-xl px-5 py-4 mb-5 flex items-start gap-3">
            <LogIn className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-amber-400 font-medium">Session not active</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Confirm your email first, then{" "}
                <button onClick={() => setLocation("/login")} className="text-primary hover:underline">
                  sign in here
                </button>.
              </p>
            </div>
          </div>
        )}

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

              {error && (
                <div className="text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-semibold disabled:opacity-40"
                disabled={loading || !user || dbStatus === "missing"}
                data-testid="button-save-profile"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : "Enter the Vault"}
              </Button>

              {!user && (
                <Button type="button" variant="outline" className="w-full" onClick={() => setLocation("/login")}>
                  Back to Sign In
                </Button>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
