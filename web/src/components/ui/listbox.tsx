import * as ListboxPrimitive from "@diceui/listbox";
import { Check } from "lucide-react";
import type * as React from "react";
import { cn } from "src/lib/utils";

const Listbox = (({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ListboxPrimitive.Root>) => {
  return (
    <ListboxPrimitive.Root
      data-slot="listbox"
      orientation={orientation}
      className={cn(
        "dark:flex dark:gap-2 dark:focus-visible:outline-none",
        orientation === "vertical" &&
          "dark:flex-col dark:*:data-[slot=listbox-group]:flex-col",
        className,
      )}
      {...props}
    />
  );
}) as ListboxPrimitive.ListboxRootComponentProps;

function ListboxGroup({
  className,
  ...props
}: React.ComponentProps<typeof ListboxPrimitive.Group>) {
  return (
    <ListboxPrimitive.Group
      data-slot="listbox-group"
      className={cn("dark:flex dark:flex-col dark:gap-2", className)}
      {...props}
    />
  );
}

function ListboxGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof ListboxPrimitive.GroupLabel>) {
  return (
    <ListboxPrimitive.GroupLabel
      data-slot="listbox-group-label"
      className={cn(
        "dark:px-2 dark:pt-1 dark:font-medium dark:text-muted-foreground dark:text-sm",
        className,
      )}
      {...props}
    />
  );
}

function ListboxItem({
  className,
  ...props
}: React.ComponentProps<typeof ListboxPrimitive.Item>) {
  return (
    <ListboxPrimitive.Item
      data-slot="listbox-item"
      className={cn(
        "dark:flex dark:w-full dark:cursor-default dark:select-none dark:items-center dark:justify-between dark:gap-2 dark:rounded-md dark:p-4 dark:outline-hidden dark:ring-1 dark:ring-border dark:focus-visible:ring-ring dark:data-disabled:pointer-events-none dark:data-highlighted:bg-accent dark:data-highlighted:text-accent-foreground dark:data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function ListboxItemIndicator({
  ...props
}: React.ComponentProps<typeof ListboxPrimitive.ItemIndicator>) {
  return (
    <ListboxPrimitive.ItemIndicator
      data-slot="listbox-item-indicator"
      {...props}
    >
      <Check className="dark:size-4" />
    </ListboxPrimitive.ItemIndicator>
  );
}

export {
  Listbox,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
  ListboxItemIndicator,
};
