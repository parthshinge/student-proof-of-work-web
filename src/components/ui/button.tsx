import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] shadow-lg shadow-sky-500/20 hover:brightness-110",
  secondary: "bg-[rgb(var(--secondary))] text-[rgb(var(--secondary-foreground))] hover:opacity-90",
  outline: "border border-[rgb(var(--border))] bg-transparent hover:bg-[rgb(var(--muted))]",
  ghost: "bg-transparent hover:bg-[rgb(var(--muted))]",
  destructive: "bg-rose-500 text-white hover:bg-rose-600",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-11 px-5 py-2.5",
  sm: "h-9 px-3.5 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const mergedClassName = cn(
      "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-50",
      variantClasses[variant],
      sizeClasses[size],
      className,
    );

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;

      return React.cloneElement(children, {
        ...props,
        className: cn(mergedClassName, child.props.className),
        ref,
      } as React.Attributes & { className?: string });
    }

    return (
      <button ref={ref} className={mergedClassName} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";