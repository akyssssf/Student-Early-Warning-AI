import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva("inline-flex rounded-full px-2.5 py-1 text-xs font-bold", {
  variants: {
    variant: {
      low: "bg-emerald-100 text-emerald-700",
      medium: "bg-amber-100 text-amber-700",
      high: "bg-red-100 text-red-700",
      neutral: "bg-slate-100 text-slate-700",
    },
  },
  defaultVariants: { variant: "neutral" },
});

export function Badge({ variant, children }: VariantProps<typeof badgeVariants> & { children: React.ReactNode }) {
  return <span className={badgeVariants({ variant })}>{children}</span>;
}