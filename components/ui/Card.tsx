import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

const cardVariants = cva("card p-5", {
  variants: {
    tone: {
      default: "",
      blue: "border-blue-100 bg-blue-50/40",
      red: "border-red-100 bg-red-50/40",
    },
  },
  defaultVariants: { tone: "default" },
});

export function Card({ tone, className, ...props }: HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>) {
  return <div className={cardVariants({ tone, className })} {...props} />;
}