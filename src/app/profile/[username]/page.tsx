import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Eye,
  FileText,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileActions } from "@/components/profile-actions";
import { demoProfile } from "@/lib/demo-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProofRecord, ProjectRecord, ProfileRecord } from "@/lib/types";

async function getProfile(username: string) {
  if (username === demoProfile.username) {
    return demoProfile;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (!profile) {
    return null;
  }

  // Safely increment view count
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
    title: `${profile.full_name} | AI & Machine Learning Student Portfolio`,
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

  // Determine specific display features for the profile (demo vs database)
  const isDemo = username === demoProfile.username;
  const email = isDemo ? "shingeparth@gmail.com" : null;
  const phone = isDemo ? "+91 8975934779" : null;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      {/* 1. Hero banner with modern mesh gradient */}
      <div className="relative h-48 sm:h-64 md:h-72 w-full bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.3),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(30,27,75,0.4),transparent_50%)]" />
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>

      <div className="container-shell -mt-24 sm:-mt-32 relative z-10 px-4">
        {/* 2. Top Profile Summary Section */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-200/30 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/90 dark:shadow-slate-950/50">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
              {/* Profile Picture */}
              <div className="relative shrink-0 -mt-16 sm:-mt-24">
                <div className="h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-[2.2rem] border-4 border-white dark:border-slate-950 bg-slate-100 dark:bg-slate-900 shadow-2xl">
                  {profile.profile_picture_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.profile_picture_url} alt={profile.full_name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      <span className="font-heading text-4xl font-bold">{profile.full_name.slice(0, 2).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                {profile.open_to_work ? (
                  <span className="absolute bottom-2 right-2 flex h-5 w-5 rounded-full border-2 border-white dark:border-slate-950">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500"></span>
                  </span>
                ) : null}
              </div>

              {/* Identity & Main Info */}
              <div className="text-center sm:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {profile.full_name}
                  </h1>
                  <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15 transition border border-emerald-500/20 text-xs py-0.5 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Verified Student
                  </Badge>
                </div>
                
                <p className="text-slate-600 dark:text-slate-300 font-medium">@{profile.username}</p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-1 gap-x-4 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4 text-indigo-500 dark:text-indigo-400" /> {profile.college}</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-cyan-500 dark:text-cyan-400" /> {profile.branch}</span>
                </div>
              </div>
            </div>

            {/* View Counter & Actions */}
            <div className="flex flex-col items-center sm:items-end gap-3 self-center md:self-end">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-2 text-xs font-semibold text-slate-600 dark:border-slate-900 dark:bg-slate-900/40 dark:text-slate-400">
                <Eye className="h-4 w-4 text-blue-500 dark:text-blue-400" /> {profile.view_count ?? 0} profile views
              </div>
              <ProfileActions username={profile.username} walletAddress={profile.wallet_address} />
            </div>
          </div>
        </div>

        {/* 3. Main content breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          
          {/* SIDEBAR COLUMNS */}
          <div className="space-y-6">
            
            {/* Contact Details (For Demo profile/Parth Shinge specifically) */}
            {isDemo && (
              <Card className="border-slate-200/70 shadow-sm dark:border-slate-800/80">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Sparkles className="h-5 w-5 text-yellow-500" /> Contact Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3.5 text-sm">
                  {email && (
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <a href={`mailto:${email}`} className="hover:underline">{email}</a>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                        <Phone className="h-4 w-4" />
                      </div>
                      <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span>Maharashtra, India</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Professional Status Cards */}
            <Card className="border-slate-200/70 shadow-sm dark:border-slate-800/80">
              <CardHeader>
                <CardTitle className="text-lg">Credentials & Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Current Internship</p>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-900 dark:bg-slate-900/30">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.internship_status || "Not added"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Prior Experience / Achievements</p>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-900 dark:bg-slate-900/30">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.ppo_status || "Not added"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Academics Metrics / Stipend</p>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-900 dark:bg-slate-900/30">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile.stipend_status || "Not added"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic History Timeline */}
            {isDemo && (
              <Card className="border-slate-200/70 shadow-sm dark:border-slate-800/80">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><GraduationCap className="h-5 w-5 text-indigo-500" /> Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 relative border-l border-slate-200 dark:border-slate-800 ml-3.5 pl-6">
                  {/* Item 1 */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 ring-4 ring-white dark:ring-slate-950" />
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white">D.Y. Patil Agri. & Technical Univ.</h4>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">B.Tech – AI & Machine Learning</p>
                      <p className="text-xs text-slate-400 mt-0.5">2023 – 2026 | CGPA: 8.11 / 10.0</p>
                    </div>
                  </div>
                  
                  {/* Item 2 */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-400 ring-4 ring-white dark:ring-slate-950" />
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white">DKTE’s Yaswantrao Chavan Polytechnic</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Diploma – Computer Science Engineering</p>
                      <p className="text-xs text-slate-400 mt-0.5">2021 – 2023 | 73.43%</p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-400 ring-4 ring-white dark:ring-slate-950" />
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white">M.G. Shaha Vidhya Mandir & Jr. College</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Secondary School Certificate (SSC)</p>
                      <p className="text-xs text-slate-400 mt-0.5">2020 | 90.60%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Social Links Panel */}
            <Card className="border-slate-200/70 shadow-sm dark:border-slate-800/80">
              <CardHeader>
                <CardTitle className="text-lg">Professional Links</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {(() => {
                  const socialLinks: Array<[string, string | null, React.ComponentType<{ className?: string }>, string]> = [
                    ["GitHub", profile.github, Github, "hover:bg-slate-100 hover:text-black dark:hover:bg-slate-900 dark:hover:text-white"],
                    ["LinkedIn", profile.linkedin, Linkedin, "hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/20 dark:hover:text-blue-400"],
                    ["Portfolio", profile.website, Globe, "hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/20 dark:hover:text-indigo-400"],
                  ];
                  return socialLinks.map(([label, value, IconComp, hoverClass]) => {
                    const href = value;
                    return (
                      <a
                        key={label}
                        href={href || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center justify-between rounded-2xl border border-slate-100 p-3.5 text-sm font-medium text-slate-600 dark:border-slate-900 dark:text-slate-400 transition-all ${hoverClass}`}
                      >
                        <span className="flex items-center gap-3">
                          <IconComp className="h-5 w-5" /> {label}
                        </span>
                        <ExternalLink className="h-4 w-4 opacity-65" />
                      </a>
                    );
                  });
                })()}
              </CardContent>
            </Card>

          </div>

          {/* MAIN PORTFOLIO SECTIONS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* About Me Executive Card */}
            <Card className="border-slate-200/70 shadow-sm dark:border-slate-800/80">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2"><Trophy className="h-5.5 w-5.5 text-blue-500" /> Professional Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300 leading-7">
                  {profile.bio}
                </p>
                {isDemo && (
                  <div className="mt-6 border-t border-slate-100 dark:border-slate-900 pt-5">
                    <h5 className="font-semibold text-sm mb-3.5 text-slate-800 dark:text-slate-200">Key Highlights & Leadership:</h5>
                    <ul className="space-y-3.5 text-sm text-slate-600 dark:text-slate-300">
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                        <span><strong>Visiting Lecturer</strong> — Teaching Python and AI/ML courses to engineering students at P.V.P. Institute of Technology, Budhgaon.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                        <span><strong>Guest Speaker</strong> — Invited to deliver industry-focused technical lectures at Govt. Women&apos;s Polytechnic, Tasgaon.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                        <span><strong>Drone Systems Builder</strong> — Engineered and programmed custom drone systems from scratch for autonomous flights, surveys, and aerial data collection.</span>
                      </li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Core Skills Matrix */}
            <Card className="border-slate-200/70 shadow-sm dark:border-slate-800/80">
              <CardHeader>
                <CardTitle className="text-xl">Core Expertise & Skills</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2.5">
                {(profile.skills ?? []).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-xl border border-slate-200/60 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-300 hover:border-indigo-500/30 hover:bg-indigo-500/[0.04] hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    {skill}
                  </span>
                ))}
              </CardContent>
            </Card>

            {/* Projects Showcase section */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Featured Projects
                </h2>
                {profile.resume_url ? (
                  <Button asChild variant="outline" size="sm" className="rounded-2xl border-slate-200 dark:border-slate-800">
                    <a href={profile.resume_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs">
                      <FileText className="h-4 w-4" /> Download Resume
                    </a>
                  </Button>
                ) : null}
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {projects.map((project) => (
                  <Card key={project.id} className="overflow-hidden border-slate-200/70 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full dark:border-slate-800/80 dark:bg-slate-950">
                    <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden dark:bg-slate-900 border-b border-slate-100 dark:border-slate-900">
                      {project.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <Briefcase className="h-10 w-10 stroke-[1.2]" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition">
                        {project.title}
                      </h3>
                      
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed flex-1">
                        {project.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {(project.tech_stack ?? []).slice(0, 4).map((tech) => (
                          <span key={tech} className="rounded-lg bg-slate-100 dark:bg-slate-900 px-2 py-1 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between text-xs font-semibold">
                        {project.github_url ? (
                          <a
                            className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-colors"
                            href={project.github_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Github className="h-4 w-4" /> Code base
                          </a>
                        ) : (
                          <span />
                        )}
                        
                        {project.demo_url ? (
                          <a
                            className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline hover:underline-offset-4"
                            href={project.demo_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Live details <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Proof Gallery / Verified Certificates */}
            <div>
              <h2 className="mb-4 font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Verified Credentials & Proofs
              </h2>
              
              <div className="grid gap-6 sm:grid-cols-2">
                {proofs.map((proof) => (
                  <Card key={proof.id} className="overflow-hidden border-slate-200/70 shadow-sm dark:border-slate-800/80 dark:bg-slate-950">
                    <div className="relative aspect-[16/10] bg-slate-50 dark:bg-slate-900/60 overflow-hidden border-b border-slate-100 dark:border-slate-900">
                      {proof.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={proof.image_url} alt={proof.title} className="h-full w-full object-contain p-4" />
                      ) : null}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-sm text-slate-900 dark:text-white leading-snug">{proof.title}</p>
                          <p className="text-[10px] mt-1 font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{proof.type}</p>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[10px] py-0 px-2 shrink-0">
                          Verified
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
