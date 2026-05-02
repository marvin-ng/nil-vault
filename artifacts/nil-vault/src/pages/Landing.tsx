import { useLocation } from "wouter";
import { useAuthStore } from "@/store/authStore";
import { Zap, Briefcase, ShieldCheck, DollarSign, ArrowRight, MoveRight } from "lucide-react";

const FEATURES = [
  {
    icon: Briefcase,
    title: "Deal Pipeline",
    desc: "Drag-and-drop kanban board tracks every brand deal from first DM to final payment.",
  },
  {
    icon: ShieldCheck,
    title: "FTC Compliance",
    desc: "Paste any caption and instantly know if your disclosure is NCAA and FTC-legal.",
  },
  {
    icon: DollarSign,
    title: "Income Tracker",
    desc: "Monthly earnings chart, payment history, and a one-click PDF report for compliance audits.",
  },
];

const DEMO_DEALS = [
  { brand: "Nike", type: "Instagram Reel", amount: "$3,500", status: "signed", color: "text-blue-400 bg-blue-400/10" },
  { brand: "Gatorade", type: "TikTok Video", amount: "$1,200", status: "posted", color: "text-purple-400 bg-purple-400/10" },
  { brand: "Under Armour", type: "Brand Ambassador", amount: "$5,000", status: "inquiry", color: "text-muted-foreground bg-muted/20" },
  { brand: "Beats by Dre", type: "YouTube Integration", amount: "$2,800", status: "negotiating", color: "text-amber-400 bg-amber-400/10" },
];

export default function Landing() {
  const [, setLocation] = useLocation();
  const { enterDemo } = useAuthStore();

  const handleDemo = () => {
    enterDemo();
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
        <span className="font-headline text-2xl text-primary tracking-widest">NIL VAULT</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLocation("/login")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </button>
          <button
            onClick={handleDemo}
            className="flex items-center gap-1.5 text-sm font-semibold text-background bg-primary px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Demo <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 md:py-28">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full mb-8">
          <Zap className="w-3 h-3" />
          Free for student athletes, always
        </div>

        <h1 className="font-headline text-5xl md:text-7xl text-foreground tracking-wide leading-tight max-w-3xl mb-6">
          The back office<br />
          <span className="text-primary">you never got.</span>
        </h1>

        <p className="text-muted-foreground text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
          Track NIL brand deals, check FTC compliance, and log income — all in one place built for college athletes.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleDemo}
            className="flex items-center gap-2.5 bg-primary text-background font-bold text-base px-8 py-4 rounded-xl hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
            data-testid="button-hero-demo"
          >
            <Zap className="w-4 h-4" />
            Try the Live Demo
          </button>
          <button
            onClick={() => setLocation("/login")}
            className="flex items-center gap-1.5 text-muted-foreground text-sm hover:text-primary transition-colors px-4 py-4"
          >
            Create free account <MoveRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground/60 mt-4">No sign-up needed · Demo resets on exit</p>
      </section>

      {/* App preview strip */}
      <section className="px-4 md:px-12 pb-16 max-w-5xl mx-auto w-full">
        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: "Total Earned", value: "$7,725", color: "text-primary" },
            { label: "Active Deals", value: "7", color: "text-blue-400" },
            { label: "Overdue", value: "2", color: "text-red-400" },
            { label: "Pending Payment", value: "2", color: "text-amber-400" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-card border border-card-border rounded-xl px-4 py-4">
              <p className={`text-2xl font-bold font-mono ${kpi.color}`}>{kpi.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono mt-1">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Deal cards preview */}
        <div className="bg-card border border-card-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-card-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Deal Pipeline Preview</p>
          </div>
          <div className="divide-y divide-card-border">
            {DEMO_DEALS.map((deal) => (
              <div key={deal.brand} className="px-5 py-3.5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{deal.brand}</p>
                  <p className="text-xs text-muted-foreground">{deal.type}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-primary">{deal.amount}</span>
                  <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded capitalize ${deal.color}`}>
                    {deal.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-card-border">
            <button
              onClick={handleDemo}
              className="text-xs text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all"
            >
              Explore the full app <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 md:px-12 pb-20 max-w-5xl mx-auto w-full">
        <div className="grid md:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-card border border-card-border rounded-xl p-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-white/5 px-4 py-16 text-center">
        <p className="text-muted-foreground text-sm mb-6">Ready to take control of your NIL deals?</p>
        <button
          onClick={handleDemo}
          className="inline-flex items-center gap-2 bg-primary text-background font-bold px-8 py-3.5 rounded-xl hover:bg-primary/90 transition-colors text-sm"
        >
          <Zap className="w-4 h-4" />
          Launch the Demo
        </button>
        <p className="text-xs text-muted-foreground/50 mt-4">
          Or{" "}
          <button onClick={() => setLocation("/login")} className="underline hover:text-primary transition-colors">
            create a free account
          </button>{" "}
          to save your real deals.
        </p>
      </section>

      <footer className="border-t border-white/5 px-6 py-5 flex items-center justify-between">
        <span className="font-headline text-lg text-primary tracking-widest opacity-60">NIL VAULT</span>
        <p className="text-xs text-muted-foreground/40">Free for athletes, always.</p>
      </footer>
    </div>
  );
}
