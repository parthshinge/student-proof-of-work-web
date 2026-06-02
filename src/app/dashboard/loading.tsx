import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="container-shell py-10 lg:py-14">
      <Card className="space-y-4 p-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-56 w-full" />
      </Card>
    </main>
  );
}