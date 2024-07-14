"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import * as ProgressPrimitive from "@radix-ui/react-progress";

const Progress = React.forwardRef<
  React.ElementRef,
  React.ComponentPropsWithoutRef
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="bg-primary h-full w-full flex-1 transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
