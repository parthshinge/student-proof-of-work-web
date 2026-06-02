import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-2xl border border-[rgb(var(--border))] bg-white/70 px-4 py-2 text-sm text-[rgb(var(--foreground))] shadow-sm outline-none ring-offset-transparent placeholder:text-slate-400 focus:border-[rgb(var(--ring))] focus:ring-2 focus:ring-[rgb(var(--ring))]/20 dark:bg-slate-950/50",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";