"use client";

import type { Column } from "@tanstack/react-table";
import { Check, PlusCircle, XCircle } from "lucide-react";
import * as React from "react";

import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "src/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/popover";
import { Separator } from "src/components/ui/separator";
import { cn } from "src/lib/utils";
import type { Option } from "src/components/data-table/data-table";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: Option[];
  multiple?: boolean;
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  multiple,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const [open, setOpen] = React.useState(false);

  const columnFilterValue = column?.getFilterValue();
  const selectedValues = new Set(
    Array.isArray(columnFilterValue) ? columnFilterValue : [],
  );

  const onItemSelect = React.useCallback(
    (option: Option, isSelected: boolean) => {
      if (!column) return;

      if (multiple) {
        const newSelectedValues = new Set(selectedValues);
        if (isSelected) {
          newSelectedValues.delete(option.value);
        } else {
          newSelectedValues.add(option.value);
        }
        const filterValues = Array.from(newSelectedValues);
        column.setFilterValue(filterValues.length ? filterValues : undefined);
      } else {
        column.setFilterValue(isSelected ? undefined : [option.value]);
        setOpen(false);
      }
    },
    [column, multiple, selectedValues],
  );

  const onReset = React.useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation();
      column?.setFilterValue(undefined);
    },
    [column],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="dark:border-dashed dark:font-normal"
        >
          {selectedValues?.size > 0 ? (
            <div
              role="button"
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              className="dark:rounded-sm dark:opacity-70 dark:transition-opacity dark:hover:opacity-100 dark:focus-visible:outline-none dark:focus-visible:ring-1 dark:focus-visible:ring-ring"
              onClick={onReset}
            >
              <XCircle />
            </div>
          ) : (
            <PlusCircle />
          )}
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator
                orientation="vertical"
                className="dark:mx-0.5 dark:data-[orientation=vertical]:h-4"
              />
              <Badge
                variant="secondary"
                className="dark:rounded-sm dark:px-1 dark:font-normal dark:lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="dark:hidden dark:items-center dark:gap-1 dark:lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="dark:rounded-sm dark:px-1 dark:font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="dark:rounded-sm dark:px-1 dark:font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="dark:w-50 dark:p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList className="dark:max-h-full">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="dark:max-h-[300px] dark:scroll-py-1 dark:overflow-y-auto dark:overflow-x-hidden">
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => onItemSelect(option, isSelected)}
                  >
                    <div
                      className={cn(
                        "dark:flex dark:size-4 dark:items-center dark:justify-center dark:rounded-sm dark:border dark:border-primary",
                        isSelected
                          ? "dark:bg-primary"
                          : "dark:opacity-50 dark:[&_svg]:invisible",
                      )}
                    >
                      <Check />
                    </div>
                    {option.icon && <option.icon />}
                    <span className="dark:truncate">{option.label}</span>
                    {option.count && (
                      <span className="dark:ml-auto dark:font-mono dark:text-xs">
                        {option.count}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onReset()}
                    className="dark:justify-center dark:text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
