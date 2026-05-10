import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "secondary" | "soft" | "accent";

const VARIANTS: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground border-transparent",
  outline: "border-border bg-transparent text-foreground/80",
  secondary: "bg-muted text-foreground/80 border-transparent",
  soft: "bg-primary-soft text-primary border-transparent",
  accent: "bg-accent-soft text-accent border-transparent",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
