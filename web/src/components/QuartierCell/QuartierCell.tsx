import type {
  ParticipantsQuery,
  ParticipantsQueryVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel, SortingState, useReactTable
} from "@tanstack/react-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table/data-table";
import { UserRoundPen } from "lucide-react";
import { Row } from 'react-day-picker';
import { Checkbox } from '../ui/checkbox';

export const QUERY: TypedDocumentNode<
  ParticipantsQuery,
  ParticipantsQueryVariables
> = gql`
  query ParticipantsQuery {
    participants {
      id
      name
      familyName
      birthdate
      phoneNumber
      phoneCaretakerContact
      startDate
      endDate
    }
  }
`

export type ParticipantQueryResult = {
  id: string;
  name: string;
  familyName: string;
  birthdate: string;
  phoneNumber: string;
  phoneCaretakerContact: string;
  startDate: string;
  endDate: string;
};

export const columns: ColumnDef<ParticipantQueryResult, any>[] = [
  {
    accessorKey: "checkbox",
    header: () => <Checkbox />,
    cell: ({ row }) => {
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Eingecheckt"
      />
    },
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Telefonnummer (Teilnehmer)" label="Telefonnummer (Teilnehmer)" />
    ),
    cell: ({ row }) => (
      <span>
        {row.getValue("phoneNumber")}
      </span>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: "phoneCaretakerContact",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Telefonnummer (Erziehungsberechtigter)" label="Telefonnummer (Erziehungsberechtigter)" />
    ),
    cell: ({ row }) => (
      <span>
        {row.getValue("phoneCaretakerContact")}
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
    cell: ({ row }) => (
      <a href={`/register-success/${row.getValue("id")}`} className="text-muted-foreground hover:underline inline-flex gap-1">
        Bearbeiten <UserRoundPen className="h-4 w-4" />
      </a>
    ),
    enableSorting: false,
    enableHiding: false,
  }
];

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<ParticipantsQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  participants,
}: CellSuccessProps<ParticipantsQuery, ParticipantsQueryVariables>) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  // Kombinierter Suchstate für Vor- und Nachname
  const [globalSearch, setGlobalSearch] = React.useState("");

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

      <DataTable table={table} />
    </div>
  );
}