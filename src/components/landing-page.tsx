import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Globe2,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Public recruiter-ready profile",
    description: "Share a single URL with verified skills, projects, internships, and proof screenshots.",
    icon: Globe2,
  },
  {
    title: "Supabase auth and data",
    description: "Use email/password sign up and a protected dashboard backed by row-level security.",
    icon: ShieldCheck,
  },
  {
    title: "Proof-first storytelling",
    description: "Add screenshots, certificates, and wallet details to back up every claim you make.",
    icon: UploadCloud,
  },
  {
    title: "Wallet connect built in",
    description: "Connect an EVM wallet with ethers.js without touching transactions or payments.",
    icon: Wallet,
  },
];

const steps = [
  "Create your account and claim a username.",
  "Add your academics, skills, projects, and proof images.",
  "Publish your public profile and share it with recruiters.",
];

export function LandingPage() {
  return (
    <main>
      <section className="container-shell grid min-h-[calc(100vh-4rem)] items-center gap-14 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-sky-500/10 text-sky-700 dark:text-sky-300">Recruiter-friendly SaaS profile builder</Badge>
            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">Next.js 15 + Supabase</Badge>
          </div>

          <div className="space-y-5">
            <h1 className="font-heading text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Build Your <span className="gradient-text">Student Proof-of-Work</span> Profile
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[rgb(var(--muted-foreground))] sm:text-xl">
              Show recruiters what you&apos;ve actually built. Publish projects, internships, proofs, wallet details,
              and your resume in one elegant public page.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/auth">
                Create Profile <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/profile/demo-student">View Demo Profile</Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Public share link", "One URL for recruiters and mentors"],
              ["Profile completion", "Track readiness before you apply"],
              ["Proof gallery", "Show certificates and screenshots"],
            ].map(([title, description]) => (
              <Card key={title} className="p-5">
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription className="mt-2">{description}</CardDescription>
              </Card>
            ))}
          </div>
        </div>

        <Card className="relative overflow-hidden border-white/20 bg-slate-950 text-white shadow-[0_30px_120px_rgba(15,23,42,0.35)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.35),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.2),transparent_30%)]" />
          <CardHeader className="relative">
            <div>
              <Badge className="border-white/15 bg-white/10 text-white">Live proof preview</Badge>
              <CardTitle className="mt-4 text-2xl text-white">A clean, recruiter&apos;s-eye profile</CardTitle>
              <CardDescription className="mt-2 text-slate-300">
                The public profile combines evidence, credibility, and a crisp professional layout.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 overflow-hidden rounded-3xl border-2 border-white/10 bg-sky-400/20">
                  <img src="/parth-shinge.jpg" alt="Parth Shinge" className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-heading text-xl font-semibold">Parth Shinge</p>
                  <p className="text-sm text-slate-300">AI & Machine Learning / Final Year</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Python", "TensorFlow", "Power BI", "Scikit-learn"].map((tag) => (
                  <Badge key={tag} className="border-white/10 bg-white/10 text-white">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/8 p-5">
                <p className="flex items-center gap-2 text-sm text-slate-300">
                  <Sparkles className="h-4 w-4 text-emerald-300" /> Profile completion
                </p>
                <p className="mt-2 text-3xl font-semibold">92%</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/8 p-5">
                <p className="flex items-center gap-2 text-sm text-slate-300">
                  <BadgeCheck className="h-4 w-4 text-sky-300" /> Proof uploads
                </p>
                <p className="mt-2 text-3xl font-semibold">6 verified assets</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="features" className="section-padding container-shell">
        <div className="mb-8 max-w-2xl space-y-4">
          <Badge className="bg-slate-900 text-white dark:bg-white dark:text-slate-950">Features</Badge>
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for credibility, speed, and mobile browsing.
          </h2>
          <p className="text-[rgb(var(--muted-foreground))]">
            The platform is optimized for recruiters skimming on the move and students updating their proof quickly.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="h-full">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgb(var(--muted))] text-[rgb(var(--foreground))]">
                    <Icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="section-padding container-shell">
        <Card className="overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border-b border-[rgb(var(--border))] p-8 lg:border-b-0 lg:border-r">
              <Badge>How it works</Badge>
              <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight">
                Publish your proof in three clear steps.
              </h2>
              <p className="mt-4 text-[rgb(var(--muted-foreground))]">
                The workflow keeps the profile fast to complete and easy to keep current as your achievements grow.
              </p>
            </div>
            <div className="p-8">
              <div className="space-y-5">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-4 rounded-2xl border border-[rgb(var(--border))] bg-white/60 p-4 dark:bg-slate-950/40"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgb(var(--primary))] text-sm font-semibold text-[rgb(var(--primary-foreground))]">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-sm leading-6 text-[rgb(var(--muted-foreground))]">{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild>
                  <Link href="/auth">Get started</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/profile/demo-student">See a sample profile</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="section-padding container-shell">
        <Card className="bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.94))] text-white">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <Badge className="border-white/15 bg-white/10 text-white">Call to action</Badge>
              <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Ship your public student profile today.
              </h2>
              <p className="mt-4 max-w-2xl text-slate-300">
                Use the dashboard to manage personal info, projects, proof screenshots, wallet connection, and resume
                links in one place.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild size="lg">
                <Link href="/auth">Create Profile</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link href="/dashboard">Open Dashboard</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}
