import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="container-shell py-10 lg:py-14">
      <Card className="grid gap-6 p-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Skeleton className="h-[32rem] w-full" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </Card>
    </main>
  );
}