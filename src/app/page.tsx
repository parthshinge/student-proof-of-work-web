import { LandingPage } from "@/components/landing-page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <LandingPage />
      <SiteFooter />
    </>
  );
}
