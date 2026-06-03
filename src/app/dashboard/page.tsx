import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardClient } from "@/components/dashboard-client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DashboardPayload, ProofRecord, ProjectRecord, ProfileRecord } from "@/lib/types";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <main className="container-shell flex min-h-[calc(100vh-4rem)] items-center justify-center py-16">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Supabase setup required</CardTitle>
            <CardDescription>
              Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel to enable the profile builder dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/profile/demo-student">View demo profile</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Back to landing page</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    redirect("/auth");
  }

  const [profileResult, projectsResult, proofsResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", auth.user.id).maybeSingle(),
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    supabase.from("proofs").select("*").order("created_at", { ascending: false }),
  ]);

  const payload: DashboardPayload = {
    profile: (profileResult.data as ProfileRecord | null) ?? null,
    projects: (projectsResult.data as ProjectRecord[] | null) ?? [],
    proofs: (proofsResult.data as ProofRecord[] | null) ?? [],
  };

  return <DashboardClient user={auth.user} initialData={payload} />;
}
