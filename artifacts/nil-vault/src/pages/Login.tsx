import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MailCheck, Zap } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormValues = z.infer<typeof schema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { fetchProfile, enterDemo } = useAuthStore();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const handleDemo = () => {
    enterDemo();
    setLocation("/dashboard");
  };

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });
        if (signUpError) throw signUpError;

        if (!data.session) {
          setConfirmEmail(values.email);
          return;
        }

        await fetchProfile();
        setLocation("/onboarding");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (signInError) throw signInError;
        await fetchProfile();
        const profile = useAuthStore.getState().profile;
        if (profile?.role === "admin") {
          setLocation("/admin");
        } else if (!profile?.full_name) {
          setLocation("/onboarding");
        } else {
          setLocation("/dashboard");
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (confirmEmail) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <h1 className="font-headline text-5xl text-primary tracking-widest mb-2">NIL VAULT</h1>
          </div>
          <div className="bg-card border border-card-border rounded-xl p-8 text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MailCheck className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Check your email</h2>
            <p className="text-sm text-muted-foreground mb-1">We sent a confirmation link to:</p>
            <p className="text-sm font-mono text-primary mb-4">{confirmEmail}</p>
            <p className="text-xs text-muted-foreground mb-6">
              Click the link in your email, then come back here and sign in.
            </p>
            <Button
              className="w-full bg-primary text-primary-foreground font-semibold"
              onClick={() => {
                setConfirmEmail(null);
                setMode("signin");
                form.setValue("email", confirmEmail);
              }}
            >
              Back to Sign In
            </Button>
            <p className="text-xs text-muted-foreground mt-4">Didn't get it? Check your spam folder.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-headline text-5xl text-primary tracking-widest mb-2">NIL VAULT</h1>
          <p className="text-muted-foreground text-sm">The back office you never got.</p>
        </div>

        {/* Demo CTA */}
        <button
          onClick={handleDemo}
          className="w-full mb-4 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors group"
          data-testid="button-demo"
        >
          <Zap className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold text-primary">Try the Demo</span>
          <span className="text-xs text-muted-foreground">— no account needed</span>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or sign in</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="bg-card border border-card-border rounded-xl p-8">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            {mode === "signin" ? "Sign in to your account" : "Create your account"}
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs uppercase tracking-wider font-mono">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="you@school.edu"
                        className="bg-background border-input"
                        data-testid="input-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs uppercase tracking-wider font-mono">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="bg-background border-input"
                        data-testid="input-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <p className="text-destructive text-sm" data-testid="text-error">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                disabled={loading}
                data-testid="button-submit"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    {mode === "signin" ? "Signing in..." : "Creating account..."}
                  </span>
                ) : (
                  mode === "signin" ? "Sign In" : "Create Account"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              data-testid="button-toggle-mode"
            >
              {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">Free for athletes, always.</p>
      </div>
    </div>
  );
}
