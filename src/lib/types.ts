export type ProofType =
  | "Internship Certificate"
  | "Offer Letter"
  | "PPO Letter"
  | "Hackathon Certificate"
  | "Course Certificate"
  | "Achievement Proof";

export type ProfileRecord = {
  id: string;
  user_id: string;
  username: string;
  full_name: string;
  profile_picture_url: string | null;
  college: string | null;
  branch: string | null;
  year: string | null;
  bio: string | null;
  skills: string[] | null;
  github: string | null;
  linkedin: string | null;
  website: string | null;
  twitter: string | null;
  wallet_address: string | null;
  internship_status: string | null;
  ppo_status: string | null;
  stipend_status: string | null;
  open_to_work: boolean | null;
  resume_url: string | null;
  view_count: number | null;
  created_at: string;
  updated_at: string | null;
};

export type ProjectRecord = {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  tech_stack: string[] | null;
  github_url: string | null;
  demo_url: string | null;
  image_url: string | null;
  created_at?: string;
  updated_at?: string | null;
};

export type ProofRecord = {
  id: string;
  profile_id: string;
  title: string;
  type: ProofType | string;
  image_url: string | null;
  created_at?: string;
  updated_at?: string | null;
};

export type DashboardPayload = {
  profile: ProfileRecord | null;
  projects: ProjectRecord[];
  proofs: ProofRecord[];
};

export type DemoProfile = ProfileRecord & {
  projects: ProjectRecord[];
  proofs: ProofRecord[];
};