import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthPage } from "@/components/auth-page";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Authentication",
};

export default async function AuthRoute() {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      redirect("/dashboard");
    }
  }

  return <AuthPage supabaseConfigured={Boolean(supabase)} />;
}
