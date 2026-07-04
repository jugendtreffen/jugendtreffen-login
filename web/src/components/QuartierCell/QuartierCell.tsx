import type {
  ParticipantsQuery,
  ParticipantsQueryVariables,
} from 'types/graphql'

import {
  type CellSuccessProps,
  type CellFailureProps,
  type TypedDocumentNode,
  useMutation,
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
import { Search, UserRoundPen } from "lucide-react";
import { Row } from 'react-day-picker';
import { Checkbox } from '../ui/checkbox';
import { ParticipantsFilters } from "src/components/AccomodationParticipants/ParticipantsFilters"
import { ro } from 'date-fns/locale';

export const QUERY: TypedDocumentNode<
  ParticipantsQuery,
  ParticipantsQueryVariables
> = gql`
  query AccomodationParticipantsQuery($date: Date!) {
    accomodationParticipants(date: $date) {
      id
      name
      familyName
      gender
      birthdate
      phoneNumber
      phoneCaretakerContact
      startDate
      endDate
      accommodation
      accomodationCheckIns {
        id
      }
    }
  }
`

const TOGGLE_CHECKIN_MUTATION = gql`
  mutation ToggleAccomodationCheckIn(
    $participantId: String!
    $date: Date!
  ) {
    toggleAccommodationCheckIn(
      participantId: $participantId
      date: $date
    ) {
      id
    }
  }
`

export type ParticipantQueryResult = {
  id: string
  name: string
  familyName: string
  gender: string
  birthdate: string
  phoneNumber: string
  phoneCaretakerContact: string
  startDate: string
  endDate: string
  accomodation: string
  accomodationCheckIns: {
    id: number
  }[]
}

function calculateAge(birthdateString: string) {
  console.log(birthdateString)
  const birthdate = new Date(birthdateString)
  const today = new Date()

  let age = today.getFullYear() - birthdate.getFullYear()

  if (
    today.getMonth() < birthdate.getMonth() ||
    (today.getMonth() === birthdate.getMonth() &&
      today.getDate() < birthdate.getDate())
  ) {
    age--
  }
  console.log(age)
  return age
}

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<ParticipantsQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  accomodationParticipants,
  date,
}: CellSuccessProps<ParticipantsQuery, ParticipantsQueryVariables>) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  // Kombinierter Suchstate für Vor- und Nachname
  const [globalSearch, setGlobalSearch] = React.useState("");

  const [setAccomodationCheckIn] = useMutation(
    TOGGLE_CHECKIN_MUTATION,
    {
      refetchQueries: ['AccomodationParticipantsQuery']
    }
  )

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
      accessorKey: "gender",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Geschlecht" label="Geschlecht" />
      ),
      cell: ({ row }) => <span>{row.getValue("gender")}</span>,
      enableSorting: true,
      filterFn: (row, id, value) => {
        if (!value) return true
        return row.getValue(id) === value
      },
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
        <DataTableColumnHeader column={column} title="Alter" label="Alter" />
      ),
      cell: ({ row }) => (
        <span>
          {calculateAge(row.getValue("birthdate"))}
        </span>
      ),
    },
    {
      id: "age",
      accessorFn: (row) => calculateAge(row.birthdate),
      enableHiding: false,
      enableColumnFilter: true,
      filterFn: (row, id, value) => {
        const age = calculateAge(row.getValue("birthdate"))
        if (!value) return true
        if (value === "under18") return age < 18
        if (value === "18plus") return age >= 18
        return true
      }
    },
    {
      accessorKey: "accommodation",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Unterkunft" label="Unterkunft" />
      ),
      cell: ({ row }) => (
        <span>
          {row.getValue("accommodation")}
        </span>
      ),
      filterFn: (row, id, value) => {
        if (!value) return true
        return row.getValue(id) === value
      }
    },
    {
      accessorKey: "checkbox",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Eingecheckt" label="Eingecheckt" />
      ),
      cell: ({ row }) => {
        const participant = row.original
        return (
          <Checkbox w-10 justify-center
            checked={participant.accomodationCheckIns.length > 0}
            onCheckedChange={(checked) => {
              setAccomodationCheckIn({
                variables: {
                  participantId: participant.id,
                  date: date
                }
              })
            }
            }
            aria-label="Eingecheckt"
          />
        )
      },
      enableSorting: false,
      enableHiding: false,
    }
  ];

  const table = useReactTable({
    data: accomodationParticipants,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter: globalSearch,
    },
    initialState: {
      columnVisibility: {
        age: false
      }
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
        <Input
          placeholder="Nach Vor- oder Nachname suchen..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="h-8 w-96"
        />
        <ParticipantsFilters table={table}></ParticipantsFilters>
      </DataTableToolbar>

      <DataTable table={table} />
    </div>
  )
}
