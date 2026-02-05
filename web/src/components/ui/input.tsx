import * as React from "react";

import {cn} from "src/lib/utils";
import {InputField, PasswordField} from "@redwoodjs/forms";
import {Checkbox} from "@/components/ui/checkbox";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({name, className, type, ...props}, ref) => {
    switch (type) {
      case "password":
        return (
          <PasswordField
            name={name}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              className
            )}
            ref={ref}
            {...props}
          />
        );
      default:
        return (
          <InputField
            name={name}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              className
            )}
            ref={ref}
            {...props}
          />
        );
    }

  }
)
Input.displayName = "Input"

export {Input}
