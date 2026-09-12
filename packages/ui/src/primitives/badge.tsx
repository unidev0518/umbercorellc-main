import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-foreground text-surface-dark",
        accent: "border-brand-blue/40 bg-brand-blue/15 text-brand-blue",
        green: "border-brand-green/40 bg-brand-green/15 text-brand-green",
        danger: "border-brand-danger/40 bg-brand-danger/15 text-brand-danger",
        gradient:
          "border-brand-green/30 bg-gradient-to-r from-brand-green/15 to-brand-blue/15 text-brand-green-soft",
        secondary: "border-border bg-secondary text-foreground",
        outline: "border-border text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
