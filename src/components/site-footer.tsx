import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-white/60 py-8 backdrop-blur-xl dark:bg-slate-950/60">
      <div className="container-shell flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[rgb(var(--muted-foreground))]">
          Built for recruiters, founders, and students who want proof over promises.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-[rgb(var(--muted-foreground))]">
          <Link href="/auth" className="transition hover:text-[rgb(var(--foreground))]">
            Sign in
          </Link>
          <Link href="/dashboard" className="transition hover:text-[rgb(var(--foreground))]">
            Dashboard
          </Link>
          <Link href="/profile/demo-student" className="transition hover:text-[rgb(var(--foreground))]">
            Demo profile
          </Link>
        </div>
      </div>
    </footer>
  );
}