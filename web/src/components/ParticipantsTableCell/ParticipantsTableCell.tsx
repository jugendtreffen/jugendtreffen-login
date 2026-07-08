import type {
  ParticipantsQuery,
  ParticipantsQueryVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import {DataTableColumnHeader} from "@/components/ui/data-table/data-table-column-header";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel, SortingState, useReactTable
} from "@tanstack/react-table";
import {DataTableToolbar} from "@/components/ui/data-table/data-table-toolbar";
import {Input} from "@/components/ui/input";
import {DataTable} from "@/components/ui/data-table/data-table";
import {MoreHorizontal } from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {useSidebar} from "@/layouts/SidebarLayout/SidebarLayout";
import Alert from "@/components/ui/Alert/Alert";
import {Skeleton} from "@/components/ui/skeleton";

export const QUERY: TypedDocumentNode<
  ParticipantsQuery,
  ParticipantsQueryVariables
> = gql`
  query ParticipantsQuery {
    participants {
      id
      email
      name
      familyName
      birthdate
    }
  }
`

export type ParticipantQueryResult = {
  id: string;
  email: string;
  name: string;
  familyName: string;
  birthdate: string;
};

export const Loading = () =>
  <>
    <Skeleton className="h-8 w-full rounded-xl" />
    <Skeleton className="h-150 w-full rounded-xl" />
  </>

export const Empty = () => <Alert id="empty-alert" message="Es haben sich noch keine Teilnehmer angemeldet" type="info" dismissible={false}></Alert>

export const Failure = ({
  error,
}: CellFailureProps<ParticipantsQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  participants,
}: CellSuccessProps<ParticipantsQuery, ParticipantsQueryVariables>) => {
  const {setSubState} = useSidebar()
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const [globalSearch, setGlobalSearch] = React.useState("");

  const onEdit = (id: string) => {
    localStorage.setItem('selectedParticipantId', id)
    setSubState('Details')
  }

  const columns: ColumnDef<ParticipantQueryResult, any>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vorname" label="Vorname" />
      ),
      cell: ({ row }) => <span>{row.getValue("name")}</span>,
      enableSorting: true,
    },
    {
      accessorKey: "familyName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nachname" label="Nachname" />
      ),
      cell: ({ row }) => <span>{row.getValue("familyName")}</span>,
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="E-Mail" label="E-Mail"/>
      ),
      cell: ({ row }) => (
        <span>
        {row.getValue("email")}
      </span>
      ),
      enableColumnFilter: false,
    },
    {
      accessorKey: "birthdate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Geburtsdatum" label="Geburtsdatum" />
      ),
      cell: ({ row }) => {
        const raw = row.getValue("birthdate");
        return <span>{new Date(raw).toLocaleDateString("de-AT")}</span>;
      },
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Details" label="Details" />
      ),
      cell: function Cell({ row }) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(row.getValue("id"))}>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive hover:bg-destructive/10">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 32,
      enableSorting: false,
      enableHiding: false,
    }
  ];

  const table = useReactTable({
    data: participants,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter: globalSearch,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalSearch,
    // Suche nur auf name + familyName einschränken
    globalFilterFn: (row, _columnId, filterValue: string) => {
      const search = filterValue.toLowerCase();
      const firstName = String(row.getValue<string>("name") ?? "").toLowerCase();
      const lastName = String(row.getValue<string>("familyName") ?? "").toLowerCase();
      return firstName.includes(search) || lastName.includes(search);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4 w-full">
      <DataTableToolbar table={table}>
        {/* Suchfeld für Vor- und Nachname */}
        <Input
          placeholder="Nach Vor- oder Nachname suchen..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="h-8 w-96"
        />
      </DataTableToolbar>

      <DataTable table={table}/>
    </div>
  );
}
