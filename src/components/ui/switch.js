// src/components/ui/switch.js
// Placeholder for ShadCN/UI Switch component - Replace with actual component if using ShadCN
"use client";
import * as React from "react";

const Switch = React.forwardRef(
  ({ className, id, checked, onCheckedChange, ...props }, ref) => {
    const handleChange = (event) => {
      onCheckedChange?.(event.target.checked);
    };

    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange?.(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? "bg-blue-600" : "bg-gray-200"
        } ${className}`}
        ref={ref}
        id={id}
        {...props}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };

