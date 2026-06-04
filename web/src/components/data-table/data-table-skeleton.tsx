import { Skeleton } from "src/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import { cn } from "src/lib/utils";

interface DataTableSkeletonProps extends React.ComponentProps<"div"> {
  columnCount: number;
  rowCount?: number;
  filterCount?: number;
  cellWidths?: string[];
  withViewOptions?: boolean;
  withPagination?: boolean;
  shrinkZero?: boolean;
}

export function DataTableSkeleton({
  columnCount,
  rowCount = 10,
  filterCount = 0,
  cellWidths = ["auto"],
  withViewOptions = true,
  withPagination = true,
  shrinkZero = false,
  className,
  ...props
}: DataTableSkeletonProps) {
  const cozyCellWidths = Array.from(
    { length: columnCount },
    (_, index) => cellWidths[index % cellWidths.length] ?? "auto",
  );

  return (
    <div
      className={cn("dark:flex dark:w-full dark:flex-col dark:gap-2.5 dark:overflow-auto", className)}
      {...props}
    >
      <div className="dark:flex dark:w-full dark:items-center dark:justify-between dark:gap-2 dark:overflow-auto dark:p-1">
        <div className="dark:flex dark:flex-1 dark:items-center dark:gap-2">
          {filterCount > 0
            ? Array.from({ length: filterCount }).map((_, i) => (
                <Skeleton key={i} className="dark:h-7 dark:w-18 dark:border-dashed" />
              ))
            : null}
        </div>
        {withViewOptions ? (
          <Skeleton className="dark:ml-auto dark:hidden dark:h-7 dark:w-18 dark:lg:flex" />
        ) : null}
      </div>
      <div className="dark:rounded-md dark:border">
        <Table>
          <TableHeader>
            {Array.from({ length: 1 }).map((_, i) => (
              <TableRow key={i} className="dark:hover:bg-transparent">
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableHead
                    key={j}
                    style={{
                      width: cozyCellWidths[j],
                      minWidth: shrinkZero ? cozyCellWidths[j] : "auto",
                    }}
                  >
                    <Skeleton className="dark:h-6 dark:w-full" />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, i) => (
              <TableRow key={i} className="dark:hover:bg-transparent">
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableCell
                    key={j}
                    style={{
                      width: cozyCellWidths[j],
                      minWidth: shrinkZero ? cozyCellWidths[j] : "auto",
                    }}
                  >
                    <Skeleton className="dark:h-6 dark:w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {withPagination ? (
        <div className="dark:flex dark:w-full dark:items-center dark:justify-between dark:gap-4 dark:overflow-auto dark:p-1 dark:sm:gap-8">
          <Skeleton className="dark:h-7 dark:w-40 dark:shrink-0" />
          <div className="dark:flex dark:items-center dark:gap-4 dark:sm:gap-6 dark:lg:gap-8">
            <div className="dark:flex dark:items-center dark:gap-2">
              <Skeleton className="dark:h-7 dark:w-24" />
              <Skeleton className="dark:h-7 dark:w-18" />
            </div>
            <div className="dark:flex dark:items-center dark:justify-center dark:font-medium dark:text-sm">
              <Skeleton className="dark:h-7 dark:w-20" />
            </div>
            <div className="dark:flex dark:items-center dark:gap-2">
              <Skeleton className="dark:hidden dark:size-7 dark:lg:block" />
              <Skeleton className="dark:size-7" />
              <Skeleton className="dark:size-7" />
              <Skeleton className="dark:hidden dark:size-7 dark:lg:block" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
