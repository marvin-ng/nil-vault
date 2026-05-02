import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-headline text-5xl text-foreground tracking-wide mb-2">404</h1>
        <p className="text-muted-foreground text-sm mb-6">This page doesn't exist in the vault.</p>
        <Button
          onClick={() => setLocation("/dashboard")}
          className="bg-primary text-primary-foreground font-semibold"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
