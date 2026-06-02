"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const response =
      mode === "signup"
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/dashboard`,
              data: { username },
            },
          })
        : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (response.error) {
      toast.error(response.error.message);
      return;
    }

    toast.success(mode === "signup" ? "Account created" : "Logged in");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="container-shell grid min-h-[calc(100vh-4rem)] items-center py-16 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="mb-10 space-y-5 lg:mb-0">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[rgb(var(--muted-foreground))]">Authentication</p>
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">Create your student proof-of-work account.</h1>
        <p className="max-w-xl text-lg leading-8 text-[rgb(var(--muted-foreground))]">
          Sign up to manage your profile, add proof screenshots, connect your wallet, and publish a public recruiter-ready page.
        </p>
      </div>

      <Card className="mx-auto w-full max-w-xl">
        <CardHeader>
          <div>
            <CardTitle>{mode === "signup" ? "Create your account" : "Welcome back"}</CardTitle>
            <CardDescription>
              {mode === "signup"
                ? "Use your email to create a profile and claim a username."
                : "Sign in to continue managing your profile and projects."}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" ? (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="yourname"
                    className="pl-11"
                    required
                  />
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@college.edu"
                  className="pl-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="pl-11"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {mode === "signup" ? "Create profile" : "Log in"}
            </Button>
          </form>

          <div className="mt-5 flex items-center justify-between gap-4 text-sm text-[rgb(var(--muted-foreground))]">
            <button
              type="button"
              className="font-medium text-[rgb(var(--foreground))] hover:underline"
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            >
              {mode === "signup" ? "Already have an account? Log in" : "Need an account? Sign up"}
            </button>
            <Link href="/profile/demo-student" className="hover:underline">
              View demo
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}