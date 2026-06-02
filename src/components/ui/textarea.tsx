import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[120px] w-full rounded-2xl border border-[rgb(var(--border))] bg-white/70 px-4 py-3 text-sm text-[rgb(var(--foreground))] shadow-sm outline-none placeholder:text-slate-400 focus:border-[rgb(var(--ring))] focus:ring-2 focus:ring-[rgb(var(--ring))]/20 dark:bg-slate-950/50",
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";