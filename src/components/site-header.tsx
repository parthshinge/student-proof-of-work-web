import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/70 backdrop-blur-xl dark:bg-slate-950/70">
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 font-heading text-base font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[rgb(var(--primary))] text-sm font-bold text-[rgb(var(--primary-foreground))]">
            SPOW
          </span>
          <span>Student Proof-of-Work</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-sm text-[rgb(var(--muted-foreground))] transition hover:text-[rgb(var(--foreground))]">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-[rgb(var(--muted-foreground))] transition hover:text-[rgb(var(--foreground))]">
            How it works
          </a>
          <Link href="/profile/demo-student" className="text-sm text-[rgb(var(--muted-foreground))] transition hover:text-[rgb(var(--foreground))]">
            Demo
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/auth">Create Profile</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}