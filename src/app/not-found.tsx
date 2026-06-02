import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="container-shell flex min-h-[70vh] items-center justify-center py-16">
      <Card className="max-w-xl text-center">
        <CardContent className="space-y-4 p-8">
          <CardTitle className="text-2xl">Profile not found</CardTitle>
          <p className="text-[rgb(var(--muted-foreground))]">The username you are looking for does not exist yet.</p>
          <Button asChild>
            <Link href="/">Return home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}