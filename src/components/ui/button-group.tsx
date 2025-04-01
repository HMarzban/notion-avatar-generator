import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonGroupVariants = cva("inline-flex items-center justify-center", {
  variants: {
    variant: {
      default:
        "bg-background border border-input rounded-md overflow-hidden [&>button]:border-0 [&>button:not(:first-child)]:border-l [&>button:not(:first-child)]:border-input [&>button]:rounded-none",
      outline: "rounded-md overflow-hidden [&>button]:rounded-none",
    },
    orientation: {
      horizontal:
        "flex-row [&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md",
      vertical:
        "flex-col [&>button:first-child]:rounded-t-md [&>button:last-child]:rounded-b-md [&>button:not(:first-child)]:border-t [&>button:not(:first-child)]:border-input",
    },
    size: {
      default: "gap-px",
      sm: "gap-0.5",
      lg: "gap-1",
    },
  },
  defaultVariants: {
    variant: "default",
    orientation: "horizontal",
    size: "default",
  },
});

export interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {
  children: React.ReactNode;
  orientation?: "horizontal" | "vertical";
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, variant, size, orientation, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          buttonGroupVariants({ variant, size, orientation, className })
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup, buttonGroupVariants };
