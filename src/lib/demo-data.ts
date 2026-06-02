import type { DemoProfile } from "@/lib/types";

export const demoProfile: DemoProfile = {
  id: "demo-profile",
  user_id: "demo-user",
  username: "demo-student",
  full_name: "Aarav Mehta",
  profile_picture_url:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
  college: "National Institute of Technology",
  branch: "Computer Science & Engineering",
  year: "Final Year",
  bio: "I build product-focused systems with measurable outcomes, strong internship proof, and recruiter-friendly case studies.",
  skills: ["Next.js", "TypeScript", "React", "Supabase", "Tailwind CSS", "Node.js"],
  github: "https://github.com/demo-student",
  linkedin: "https://linkedin.com/in/demo-student",
  website: "https://demo-student.dev",
  twitter: "https://x.com/demo-student",
  wallet_address: "0x8B3c1d7B8c6D3e9dBf2BfeF0d5d3c47e2D9A1a10",
  internship_status: "Summer internship completed at a SaaS startup",
  ppo_status: "PPO received",
  stipend_status: "Stipend: INR 1.2L/month",
  open_to_work: true,
  resume_url: "https://example.com/demo-resume.pdf",
  view_count: 1842,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  projects: [
    {
      id: "project-1",
      profile_id: "demo-profile",
      title: "Placement Companion",
      description:
        "A recruiter-friendly platform that tracks interview progress, proof assets, and portfolio readiness.",
      tech_stack: ["Next.js", "Supabase", "Postgres", "Tailwind"],
      github_url: "https://github.com/demo-student/placement-companion",
      demo_url: "https://placement-companion.example.com",
      image_url:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "project-2",
      profile_id: "demo-profile",
      title: "Hackathon Ops Dashboard",
      description:
        "A real-time dashboard for tracking submissions, team progress, and scoring signals during hackathons.",
      tech_stack: ["React", "Socket.io", "Node.js"],
      github_url: "https://github.com/demo-student/hackathon-ops",
      demo_url: "https://hackathon-ops.example.com",
      image_url:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    },
  ],
  proofs: [
    {
      id: "proof-1",
      profile_id: "demo-profile",
      title: "Internship Certificate",
      type: "Internship Certificate",
      image_url:
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "proof-2",
      profile_id: "demo-profile",
      title: "Hackathon Winner",
      type: "Hackathon Certificate",
      image_url:
        "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "proof-3",
      profile_id: "demo-profile",
      title: "PPO Letter",
      type: "PPO Letter",
      image_url:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    },
  ],
};