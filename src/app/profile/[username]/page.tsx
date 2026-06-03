import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { ProfileActions } from "@/components/profile-actions";
import { demoProfile } from "@/lib/demo-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProofRecord, ProjectRecord, ProfileRecord } from "@/lib/types";

async function getProfile(username: string) {
  if (username === demoProfile.username) {
    return demoProfile;
  }

  const supabase = await createSupabaseServerClient();
  const { data: profile } = await supabase.from("profiles").select("*").eq("username", username).maybeSingle();

  if (!profile) {
    return null;
  }

  await supabase
    .from("profiles")
    .update({ view_count: (profile.view_count ?? 0) + 1 })
    .eq("id", profile.id);

  const [projectsResult, proofsResult] = await Promise.all([
    supabase.from("projects").select("*").eq("profile_id", profile.id).order("created_at", { ascending: false }),
    supabase.from("proofs").select("*").eq("profile_id", profile.id).order("created_at", { ascending: false }),
  ]);

  return {
    ...(profile as ProfileRecord),
    projects: (projectsResult.data as ProjectRecord[] | null) ?? [],
    proofs: (proofsResult.data as ProofRecord[] | null) ?? [],
  };
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile) {
    return { title: "Profile not found" };
  }

  return {
    title: `${profile.full_name} (@${profile.username})`,
    description: profile.bio ?? "Student proof-of-work profile",
    openGraph: {
      title: `${profile.full_name} (@${profile.username})`,
      description: profile.bio ?? "Student proof-of-work profile",
      type: "profile",
    },
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile) {
    notFound();
  }

  const projects = "projects" in profile ? profile.projects : [];
  const proofs = "proofs" in profile ? profile.proofs : [];
  const featuredProject = projects[0];
  const academicSummary = [profile.branch, profile.year].filter(Boolean).join(" / ");

  return (
    <main className="container-shell py-10 lg:py-14">
      <Card className="overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border-b border-[rgb(var(--border))] p-8 lg:border-b-0 lg:border-r">
            <div className="flex flex-col items-start gap-5">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[2rem] bg-[rgb(var(--muted))]">
                {profile.profile_picture_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.profile_picture_url} alt={profile.full_name} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-heading text-3xl font-semibold">{profile.full_name.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div>
                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                  Open to work: {profile.open_to_work ? "Yes" : "No"}
                </Badge>
                <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight">{profile.full_name}</h1>
                <p className="mt-2 text-[rgb(var(--muted-foreground))]">@{profile.username}</p>
              </div>
              <div className="space-y-2 text-sm text-[rgb(var(--muted-foreground))]">
                <p>{profile.college}</p>
                {academicSummary ? <p>{academicSummary}</p> : null}
                <p>{profile.view_count ?? 0} public views</p>
              </div>
              <ProfileActions username={profile.username} walletAddress={profile.wallet_address} />
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-8">
              <section>
                <h2 className="font-heading text-2xl font-semibold">About</h2>
                <p className="mt-3 max-w-3xl text-[rgb(var(--muted-foreground))]">{profile.bio}</p>
              </section>

              <section>
                <h2 className="font-heading text-2xl font-semibold">Skills</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(profile.skills ?? []).map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </section>

              <section className="grid gap-4 sm:grid-cols-2">
                {[
                  ["GitHub", profile.github],
                  ["LinkedIn", profile.linkedin],
                  ["Portfolio", profile.website],
                  ["Twitter / X", profile.twitter],
                ].map(([label, value]) => (
                  <Card key={label as string} className="p-4">
                    <CardTitle className="text-base">{label}</CardTitle>
                    <CardDescription className="mt-2 break-all">
                      {value ? (
                        <a className="inline-flex items-center gap-2 underline-offset-4 hover:underline" href={value} target="_blank" rel="noreferrer">
                          {value} <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        "Not added"
                      )}
                    </CardDescription>
                  </Card>
                ))}
              </section>

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  ["Internship status", profile.internship_status],
                  ["PPO status", profile.ppo_status],
                  ["Stipend status", profile.stipend_status],
                  ["Wallet address", profile.wallet_address],
                  ["Resume", profile.resume_url],
                ].map(([label, value]) => (
                  <Card key={label as string} className="p-4">
                    <CardTitle className="text-base">{label}</CardTitle>
                    <CardDescription className="mt-2 break-words">{value ? value : "Not added"}</CardDescription>
                  </Card>
                ))}
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="font-heading text-2xl font-semibold">Featured project</h2>
                  {profile.resume_url ? (
                    <Button asChild variant="outline">
                      <Link href={profile.resume_url}>Download resume</Link>
                    </Button>
                  ) : null}
                </div>
                {featuredProject ? (
                  <Card className="overflow-hidden">
                    <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
                      <div className="aspect-[4/3] bg-[rgb(var(--muted))]">
                        {featuredProject.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={featuredProject.image_url} alt={featuredProject.title} className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <CardContent className="p-6">
                        <CardTitle>{featuredProject.title}</CardTitle>
                        <CardDescription>{featuredProject.description}</CardDescription>
                        <div className="flex flex-wrap gap-2">
                          {(featuredProject.tech_stack ?? []).map((tech) => (
                            <Badge key={tech}>{tech}</Badge>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {featuredProject.github_url ? (
                            <a className="inline-flex items-center gap-2 underline-offset-4 hover:underline" href={featuredProject.github_url} target="_blank" rel="noreferrer">
                              GitHub <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          ) : null}
                          {featuredProject.demo_url ? (
                            <a className="inline-flex items-center gap-2 underline-offset-4 hover:underline" href={featuredProject.demo_url} target="_blank" rel="noreferrer">
                              Live demo <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          ) : null}
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-6">
                    <CardDescription>No projects added yet.</CardDescription>
                  </Card>
                )}
              </section>

              <section>
                <h2 className="font-heading text-2xl font-semibold">Proof gallery</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {proofs.map((proof) => (
                    <Card key={proof.id} className="overflow-hidden p-0">
                      <div className="aspect-[4/3] bg-[rgb(var(--muted))]">
                        {proof.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={proof.image_url} alt={proof.title} className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <CardContent className="p-4">
                        <p className="font-medium">{proof.title}</p>
                        <p className="text-sm text-[rgb(var(--muted-foreground))]">{proof.type}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}
