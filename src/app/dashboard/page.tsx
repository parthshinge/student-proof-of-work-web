import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard-client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DashboardPayload, ProofRecord, ProjectRecord, ProfileRecord } from "@/lib/types";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
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