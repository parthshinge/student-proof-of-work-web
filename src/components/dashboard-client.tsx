"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { ethers } from "ethers";
import {
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Share2,
  Trash2,
  Upload,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { calculateCompletion } from "@/lib/completion";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { DashboardPayload, ProofRecord, ProofType, ProjectRecord, ProfileRecord } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

const proofTypes: ProofType[] = [
  "Internship Certificate",
  "Offer Letter",
  "PPO Letter",
  "Hackathon Certificate",
  "Course Certificate",
  "Achievement Proof",
];

type FormState = {
  full_name: string;
  username: string;
  profile_picture_url: string;
  college: string;
  branch: string;
  year: string;
  bio: string;
  skills: string;
  github: string;
  linkedin: string;
  website: string;
  twitter: string;
  wallet_address: string;
  internship_status: string;
  ppo_status: string;
  stipend_status: string;
  open_to_work: boolean;
  resume_url: string;
};

type ProjectForm = {
  title: string;
  description: string;
  tech_stack: string;
  github_url: string;
  demo_url: string;
  image_url: string;
};

type ProofForm = {
  title: string;
  type: ProofType;
  image_url: string;
};

function emptyProfileForm(profile: ProfileRecord | null): FormState {
  return {
    full_name: profile?.full_name ?? "",
    username: profile?.username ?? "",
    profile_picture_url: profile?.profile_picture_url ?? "",
    college: profile?.college ?? "",
    branch: profile?.branch ?? "",
    year: profile?.year ?? "",
    bio: profile?.bio ?? "",
    skills: profile?.skills?.join(", ") ?? "",
    github: profile?.github ?? "",
    linkedin: profile?.linkedin ?? "",
    website: profile?.website ?? "",
    twitter: profile?.twitter ?? "",
    wallet_address: profile?.wallet_address ?? "",
    internship_status: profile?.internship_status ?? "",
    ppo_status: profile?.ppo_status ?? "",
    stipend_status: profile?.stipend_status ?? "",
    open_to_work: profile?.open_to_work ?? true,
    resume_url: profile?.resume_url ?? "",
  };
}

const emptyProjectForm: ProjectForm = {
  title: "",
  description: "",
  tech_stack: "",
  github_url: "",
  demo_url: "",
  image_url: "",
};

const emptyProofForm: ProofForm = {
  title: "",
  type: "Internship Certificate",
  image_url: "",
};

function splitValues(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function DashboardClient({ user, initialData }: { user: User; initialData: DashboardPayload }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [payload, setPayload] = useState(initialData);
  const [profileForm, setProfileForm] = useState(() => emptyProfileForm(initialData.profile));
  const [projectForm, setProjectForm] = useState<ProjectForm>(emptyProjectForm);
  const [proofForm, setProofForm] = useState<ProofForm>(emptyProofForm);
  const [saving, setSaving] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [proofDialogOpen, setProofDialogOpen] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);

  useEffect(() => {
    setPayload(initialData);
    setProfileForm(emptyProfileForm(initialData.profile));
  }, [initialData]);

  const completion = calculateCompletion(payload);
  const profile = payload.profile;

  async function refreshData() {
    const [profileResult, projectResult, proofResult] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("proofs").select("*").order("created_at", { ascending: false }),
    ]);

    const nextPayload: DashboardPayload = {
      profile: (profileResult.data as ProfileRecord | null) ?? null,
      projects: (projectResult.data as ProjectRecord[] | null) ?? [],
      proofs: (proofResult.data as ProofRecord[] | null) ?? [],
    };

    setPayload(nextPayload);
    setProfileForm(emptyProfileForm(nextPayload.profile));
  }

  async function saveProfile() {
    setSaving(true);

    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        full_name: profileForm.full_name.trim(),
        username: profileForm.username.trim().toLowerCase(),
        profile_picture_url: profileForm.profile_picture_url.trim() || null,
        college: profileForm.college.trim() || null,
        branch: profileForm.branch.trim() || null,
        year: profileForm.year.trim() || null,
        bio: profileForm.bio.trim() || null,
        skills: splitValues(profileForm.skills),
        github: profileForm.github.trim() || null,
        linkedin: profileForm.linkedin.trim() || null,
        website: profileForm.website.trim() || null,
        twitter: profileForm.twitter.trim() || null,
        wallet_address: profileForm.wallet_address.trim() || null,
        internship_status: profileForm.internship_status.trim() || null,
        ppo_status: profileForm.ppo_status.trim() || null,
        stipend_status: profileForm.stipend_status.trim() || null,
        open_to_work: profileForm.open_to_work,
        resume_url: profileForm.resume_url.trim() || null,
      },
      { onConflict: "user_id" },
    );

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Profile saved");
    await refreshData();
  }

  async function addProject() {
    if (!payload.profile) {
      toast.error("Save your profile first");
      return;
    }

    const { error } = await supabase.from("projects").insert({
      profile_id: payload.profile.id,
      title: projectForm.title.trim(),
      description: projectForm.description.trim() || null,
      tech_stack: splitValues(projectForm.tech_stack),
      github_url: projectForm.github_url.trim() || null,
      demo_url: projectForm.demo_url.trim() || null,
      image_url: projectForm.image_url.trim() || null,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Project added");
    setProjectDialogOpen(false);
    setProjectForm(emptyProjectForm);
    await refreshData();
  }

  async function addProof() {
    if (!payload.profile) {
      toast.error("Save your profile first");
      return;
    }

    const { error } = await supabase.from("proofs").insert({
      profile_id: payload.profile.id,
      title: proofForm.title.trim(),
      type: proofForm.type,
      image_url: proofForm.image_url.trim() || null,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Proof added");
    setProofDialogOpen(false);
    setProofForm(emptyProofForm);
    await refreshData();
  }

  async function removeItem(table: "projects" | "proofs", id: string) {
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Removed");
    await refreshData();
  }

  async function connectWallet() {
    const ethereum = (window as Window & { ethereum?: { request: (args: { method: string }) => Promise<string[]> } }).ethereum;

    if (!ethereum) {
      toast.error("No wallet provider found. Install MetaMask or another EVM wallet.");
      return;
    }

    try {
      setWalletLoading(true);
      const provider = new ethers.BrowserProvider(ethereum as ethers.Eip1193Provider);
      const accounts = await provider.send("eth_requestAccounts", []);
      setProfileForm((current) => ({ ...current, wallet_address: accounts[0] ?? current.wallet_address }));
      toast.success("Wallet connected");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Wallet connection failed");
    } finally {
      setWalletLoading(false);
    }
  }

  async function copyProfileUrl() {
    const url = `${window.location.origin}/profile/${profileForm.username || profile?.username || "your-username"}`;
    await navigator.clipboard.writeText(url);
    toast.success("Profile URL copied");
  }

  async function shareProfile() {
    const url = `${window.location.origin}/profile/${profileForm.username || profile?.username || "your-username"}`;

    if (navigator.share) {
      await navigator.share({ title: "My student proof-of-work profile", url });
      return;
    }

    await navigator.clipboard.writeText(url);
    toast.success("Share link copied");
  }

  async function logout() {
    await supabase.auth.signOut();
    toast.success("Logged out");
    window.location.href = "/";
  }

  const featuredProject = payload.projects[0];

  return (
    <main className="container-shell py-10 lg:py-14">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">Protected dashboard</Badge>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Manage your proof-of-work profile.</h1>
          <p className="max-w-2xl text-[rgb(var(--muted-foreground))]">
            Update everything from personal details to proofs, projects, wallet connectivity, and resume links in one place.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={refreshData}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Profile readiness</CardTitle>
                <CardDescription>Keep this above 80% before sharing with recruiters.</CardDescription>
              </div>
              <Badge>{completion}% complete</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-3 overflow-hidden rounded-full bg-[rgb(var(--muted))]">
                <div className="h-full rounded-full bg-[rgb(var(--primary))] transition-all" style={{ width: `${completion}%` }} />
              </div>
              <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Projects", `${payload.projects.length}`],
                  ["Proofs", `${payload.proofs.length}`],
                  ["Views", `${profile?.view_count ?? 0}`],
                  ["Open to work", profileForm.open_to_work ? "Yes" : "No"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-[rgb(var(--border))] bg-white/60 p-4 dark:bg-slate-950/40">
                    <p className="text-sm text-[rgb(var(--muted-foreground))]">{label}</p>
                    <p className="mt-1 text-xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Personal information</CardTitle>
                <CardDescription>Fill in the fields that shape your public profile.</CardDescription>
              </div>
              <Button onClick={saveProfile} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save profile
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["Full Name", "full_name"],
                  ["Username", "username"],
                  ["College", "college"],
                  ["Branch", "branch"],
                  ["Year", "year"],
                  ["Profile Picture URL", "profile_picture_url"],
                ].map(([label, key]) => (
                  <div key={key} className="space-y-2">
                    <Label>{label}</Label>
                    <Input
                      value={profileForm[key as keyof FormState] as string}
                      onChange={(event) =>
                        setProfileForm((current) => ({ ...current, [key]: event.target.value } as FormState))
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label>Bio</Label>
                  <Textarea
                    value={profileForm.bio}
                    onChange={(event) => setProfileForm((current) => ({ ...current, bio: event.target.value }))}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Skills</Label>
                  <Input
                    value={profileForm.skills}
                    onChange={(event) => setProfileForm((current) => ({ ...current, skills: event.target.value }))}
                    placeholder="Next.js, TypeScript, Supabase"
                  />
                </div>
                {[
                  ["GitHub", "github"],
                  ["LinkedIn", "linkedin"],
                  ["Portfolio Website", "website"],
                  ["Twitter / X", "twitter"],
                  ["Resume URL", "resume_url"],
                ].map(([label, key]) => (
                  <div key={key} className="space-y-2">
                    <Label>{label}</Label>
                    <Input
                      value={profileForm[key as keyof FormState] as string}
                      onChange={(event) =>
                        setProfileForm((current) => ({ ...current, [key]: event.target.value } as FormState))
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["Internship Status", "internship_status"],
                  ["PPO Status", "ppo_status"],
                  ["Stipend Information", "stipend_status"],
                  ["Wallet Address", "wallet_address"],
                ].map(([label, key]) => (
                  <div key={key} className="space-y-2">
                    <Label>{label}</Label>
                    <Input
                      value={profileForm[key as keyof FormState] as string}
                      onChange={(event) =>
                        setProfileForm((current) => ({ ...current, [key]: event.target.value } as FormState))
                      }
                    />
                  </div>
                ))}
                <div className="space-y-2 md:col-span-2">
                  <Label>Open to work</Label>
                  <div className="flex items-center gap-3 rounded-2xl border border-[rgb(var(--border))] bg-white/60 px-4 py-3 dark:bg-slate-950/40">
                    <input
                      checked={profileForm.open_to_work}
                      onChange={(event) => setProfileForm((current) => ({ ...current, open_to_work: event.target.checked }))}
                      type="checkbox"
                      className="h-4 w-4 rounded border-[rgb(var(--border))] text-[rgb(var(--primary))]"
                    />
                    <span className="text-sm text-[rgb(var(--muted-foreground))]">
                      Show recruiters that you are available for opportunities.
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={connectWallet} disabled={walletLoading}>
                  <Wallet className="h-4 w-4" /> {walletLoading ? "Connecting..." : "Connect Wallet"}
                </Button>
                <Button variant="outline" onClick={copyProfileUrl}>
                  <Copy className="h-4 w-4" /> Copy Profile URL
                </Button>
                <Button variant="outline" onClick={shareProfile}>
                  <Share2 className="h-4 w-4" /> Share Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>Showcase multiple projects as recruiter-friendly cards.</CardDescription>
                </div>
                <Button onClick={() => setProjectDialogOpen(true)}>
                  <Plus className="h-4 w-4" /> Add project
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payload.projects.length === 0 ? (
                    <Skeleton className="h-28 w-full" />
                  ) : (
                    payload.projects.map((project) => (
                      <div key={project.id} className="rounded-2xl border border-[rgb(var(--border))] bg-white/60 p-4 dark:bg-slate-950/40">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold">{project.title}</h3>
                            <p className="mt-1 text-sm text-[rgb(var(--muted-foreground))]">{project.description}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeItem("projects", project.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(project.tech_stack ?? []).map((tech) => (
                            <Badge key={tech}>{tech}</Badge>
                          ))}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-3 text-sm">
                          {project.github_url ? (
                            <a className="inline-flex items-center gap-1 underline-offset-4 hover:underline" href={project.github_url} target="_blank" rel="noreferrer">
                              <ExternalLink className="h-3.5 w-3.5" /> GitHub
                            </a>
                          ) : null}
                          {project.demo_url ? (
                            <a className="inline-flex items-center gap-1 underline-offset-4 hover:underline" href={project.demo_url} target="_blank" rel="noreferrer">
                              <ExternalLink className="h-3.5 w-3.5" /> Live demo
                            </a>
                          ) : null}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Proof uploads</CardTitle>
                  <CardDescription>Store certificates, offer letters, and achievement screenshots.</CardDescription>
                </div>
                <Button onClick={() => setProofDialogOpen(true)}>
                  <Upload className="h-4 w-4" /> Add proof
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {payload.proofs.length === 0 ? (
                    <Skeleton className="h-32 w-full sm:col-span-2" />
                  ) : (
                    payload.proofs.map((proof) => (
                      <div key={proof.id} className="overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-white/60 dark:bg-slate-950/40">
                        <div className="aspect-[4/3] bg-[rgb(var(--muted))]">
                          {proof.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={proof.image_url} alt={proof.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[rgb(var(--muted-foreground))]">
                              <ImageIcon className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2 p-4">
                          <p className="text-sm font-medium">{proof.title}</p>
                          <p className="text-xs uppercase tracking-wide text-[rgb(var(--muted-foreground))]">{proof.type}</p>
                          <button className="text-sm text-rose-500 hover:underline" onClick={() => removeItem("proofs", proof.id)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Public profile preview</CardTitle>
                <CardDescription>What recruiters will see when they visit your page.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 rounded-3xl border border-[rgb(var(--border))] bg-white/60 p-5 dark:bg-slate-950/40">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl bg-[rgb(var(--muted))]">
                    {profileForm.profile_picture_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={profileForm.profile_picture_url} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-lg font-semibold">{(profileForm.full_name || user.email || "SP").slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-semibold">{profileForm.full_name || "Your Name"}</h3>
                    <p className="text-sm text-[rgb(var(--muted-foreground))]">@{profileForm.username || "username"}</p>
                  </div>
                </div>
                <p className="text-sm leading-6 text-[rgb(var(--muted-foreground))]">
                  {profileForm.bio || "Add a short bio that explains what you build and why it matters."}
                </p>
                <Separator />
                <div className="grid gap-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span>College</span>
                    <span className="text-[rgb(var(--muted-foreground))]">{profileForm.college || "Add your college"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Branch</span>
                    <span className="text-[rgb(var(--muted-foreground))]">{profileForm.branch || "Add your branch"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Year</span>
                    <span className="text-[rgb(var(--muted-foreground))]">{profileForm.year || "Add your year"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Wallet</span>
                    <span className="max-w-[12rem] truncate text-[rgb(var(--muted-foreground))]">
                      {profileForm.wallet_address || "Not connected"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {featuredProject ? (
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Featured project</CardTitle>
                  <CardDescription>Automatically highlights your latest project.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 rounded-3xl border border-[rgb(var(--border))] bg-white/60 p-5 dark:bg-slate-950/40">
                  <h3 className="text-lg font-semibold">{featuredProject.title}</h3>
                  <p className="text-sm text-[rgb(var(--muted-foreground))]">{featuredProject.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(featuredProject.tech_stack ?? []).map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Account</CardTitle>
                <CardDescription>Profile username and visibility details.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-[rgb(var(--muted-foreground))]">
                <p>User: {user.email}</p>
                <p>
                  Profile URL:{" "}
                  <Link href={`/profile/${profileForm.username || profile?.username || "your-username"}`} className="underline">
                    /profile/{profileForm.username || profile?.username || "your-username"}
                  </Link>
                </p>
                <p>Public views: {profile?.view_count ?? 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {projectDialogOpen ? (
        <DialogShell title="Add project" onClose={() => setProjectDialogOpen(false)}>
          <div className="space-y-4">
            {[
              ["Project Name", "title"],
              ["GitHub URL", "github_url"],
              ["Live Demo URL", "demo_url"],
              ["Project Screenshot URL", "image_url"],
            ].map(([label, key]) => (
              <div key={key} className="space-y-2">
                <Label>{label}</Label>
                <Input
                  value={projectForm[key as keyof ProjectForm]}
                  onChange={(event) => setProjectForm((current) => ({ ...current, [key]: event.target.value } as ProjectForm))}
                />
              </div>
            ))}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={projectForm.description}
                onChange={(event) => setProjectForm((current) => ({ ...current, description: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Tech Stack</Label>
              <Input
                value={projectForm.tech_stack}
                onChange={(event) => setProjectForm((current) => ({ ...current, tech_stack: event.target.value }))}
                placeholder="Next.js, PostgreSQL, Prisma"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setProjectDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addProject}>Save project</Button>
            </div>
          </div>
        </DialogShell>
      ) : null}

      {proofDialogOpen ? (
        <DialogShell title="Add proof" onClose={() => setProofDialogOpen(false)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Proof Title</Label>
              <Input
                value={proofForm.title}
                onChange={(event) => setProofForm((current) => ({ ...current, title: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Proof Type</Label>
              <select
                value={proofForm.type}
                onChange={(event) => setProofForm((current) => ({ ...current, type: event.target.value as ProofType }))}
                className="h-11 w-full rounded-2xl border border-[rgb(var(--border))] bg-white/70 px-4 text-sm dark:bg-slate-950/50"
              >
                {proofTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={proofForm.image_url}
                onChange={(event) => setProofForm((current) => ({ ...current, image_url: event.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setProofDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addProof}>Save proof</Button>
            </div>
          </div>
        </DialogShell>
      ) : null}
    </main>
  );
}

function DialogShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-2xl shadow-slate-950/20">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-semibold">{title}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <span aria-hidden="true">x</span>
            <span className="sr-only">Close</span>
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
