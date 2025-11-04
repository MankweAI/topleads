// src/components/ui/label.js
// Placeholder for ShadCN/UI Label component - Replace with actual component if using ShadCN
"use client";
import * as React from "react";

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };

