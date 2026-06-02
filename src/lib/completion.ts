import type { DashboardPayload } from "@/lib/types";

const profileFields = [
  "full_name",
  "username",
  "profile_picture_url",
  "college",
  "branch",
  "year",
  "bio",
  "skills",
  "github",
  "linkedin",
  "website",
  "twitter",
  "wallet_address",
  "internship_status",
  "ppo_status",
  "stipend_status",
  "resume_url",
];

export function calculateCompletion(payload: DashboardPayload) {
  if (!payload.profile) {
    return 0;
  }

  const profile = payload.profile;
  const filled = profileFields.filter((field) => {
    const value = profile[field as keyof typeof profile];

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === "boolean") {
      return value;
    }

    return Boolean(value);
  }).length;

  const projectScore = Math.min(payload.projects.length, 4);
  const proofScore = Math.min(payload.proofs.length, 4);
  const totalScore = filled + projectScore + proofScore + 3;
  const maxScore = profileFields.length + 8 + 3;

  return Math.min(100, Math.round((totalScore / maxScore) * 100));
}