import { Link, useLocation } from "wouter";
import { LayoutDashboard, Briefcase, ShieldCheck, DollarSign, Users, LogOut, Menu, X, LogIn } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const athleteNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Deals", href: "/deals", icon: Briefcase },
  { label: "Compliance", href: "/compliance", icon: ShieldCheck },
  { label: "Income", href: "/income", icon: DollarSign },
];

const adminNav: NavItem[] = [
  { label: "Program", href: "/admin", icon: Users },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { profile, signOut } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = profile?.role === "admin" ? adminNav : athleteNav;

  const isActive = (href: string) =>
    href === "/" ? location === href : location.startsWith(href);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-sidebar-border bg-sidebar">
        {/* Logo */}
        <div className="px-6 pt-8 pb-6 border-b border-sidebar-border">
          <Link href={profile?.role === "admin" ? "/admin" : "/dashboard"}>
            <span className="font-headline text-2xl text-primary tracking-widest">
              NIL VAULT
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground hover:bg-white/5 hover:text-foreground"
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <item.icon className={`w-4 h-4 ${isActive(item.href) ? "text-primary" : "text-muted-foreground"}`} />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>

        {/* User info / Sign in */}
        <div className="border-t border-sidebar-border p-4">
          {profile ? (
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {profile.full_name ?? profile.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {profile.sport ?? (profile.role === "admin" ? "Admin" : "")}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="shrink-0 text-muted-foreground hover:text-destructive"
                data-testid="button-signout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-primary/10 border border-primary/20 cursor-pointer hover:bg-primary/15 transition-colors">
                <LogIn className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-primary">Sign In</p>
                  <p className="text-[10px] text-muted-foreground">to save your deals</p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile header + bottom tab bar */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-sidebar">
          <span className="font-headline text-xl text-primary tracking-widest">NIL VAULT</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </header>

        {/* Mobile slide-down menu */}
        {mobileOpen && (
          <div className="md:hidden border-b border-border bg-sidebar px-4 pb-4 pt-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium cursor-pointer mb-1 ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-sidebar-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
              </Link>
            ))}
            <button
              onClick={signOut}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-destructive w-full mt-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          {children}
        </main>

        {/* Mobile bottom tab bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border flex z-50">
          {navItems.slice(0, 4).map((item) => (
            <Link key={item.href} href={item.href} className="flex-1">
              <div
                className={`flex flex-col items-center justify-center py-2 gap-1 ${
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
