import type {
  ParticipantsByAccommodationQuery,
  ParticipantsByAccommodationQueryVariables,
} from 'types/graphql'

import {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode, useMutation,
} from '@redwoodjs/web'
import {useAuth} from "@/auth";
import {Skeleton} from "@/components/ui/skeleton";
import Alert from "@/components/ui/Alert/Alert";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel, getPaginationRowModel, getSortedRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import {Checkbox} from "@/components/animate-ui/components/radix/checkbox";
import {DataTableColumnHeader} from "@/components/ui/data-table/data-table-column-header";
import {Badge} from "@/components/ui/badge";
import {DataTableToolbar} from "@/components/ui/data-table/data-table-toolbar";
import {Input} from "@/components/ui/input";
import {DataTable} from "@/components/ui/data-table/data-table";

export const QUERY: TypedDocumentNode<
  ParticipantsByAccommodationQuery,
  ParticipantsByAccommodationQueryVariables
> = gql`
  query ParticipantsByAccommodationQuery($input: AccommodationInput!) {
    participantsByAccommodation(input: $input) {
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

const CHECKIN_PARTICIPANT = gql`
  mutation CheckinParticipantFromQuartier($participantId: String!, $) {
    checkinParticipant(id: $id) {
      id
      checkinConfirmed
    }
  }
`

type ParticipantQueryResult= {
  id: string
  name: string
  familyName: string
  birthdate: string
  phoneNumber: string
  phoneCaretakerContact: string
  startDate: string
  endDate: string
}

export const beforeQuery = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { currentUser } = useAuth()
  const role = currentUser?.roles?.at(0).split('_')[1]
  return {
    variables: {
      input: {
        gender: role ?? '',
        accommodation: 'jugendtreffen',
      },
    },
    // Re-fetch when the role changes (e.g. on login)
    skip: !role,
  }
}

export const Loading = () => (
    <>
      <Skeleton className="h-8 w-full rounded-xl" />
      <Skeleton className="h-150 w-full rounded-xl" />
    </>
  )

export const Empty = () => (
  <Alert
    id="quartier-empty-alert"
    message="Keine Teilnehmer für dieses Quartier gefunden."
    type="info"
    dismissible={false}
  />
)

export const Failure = ({
                          error,
                        }: CellFailureProps<ParticipantsByAccommodationQueryVariables>) => (
  <Alert
    id="quartier-error-alert"
    message={`Fehler beim Laden: ${error.message}`}
    type="error"
    dismissible={false}
  />
)

export const Success = ({
                          participantsByAccommodation,
                        }: CellSuccessProps<
  ParticipantsByAccommodationQuery,
  ParticipantsByAccommodationQueryVariables
>) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalSearch, setGlobalSearch] = React.useState('')

  const [checkinParticipant] = useMutation(CHECKIN_PARTICIPANT, {
    // Apollo updates the cache automatically because we return `id` + the
    // changed field – no manual refetch needed.
  })

  const columns: ColumnDef<ParticipantQueryResult, any>[] = [
    {
      accessorKey: 'checkinConfirmed',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Anwesend"
          label="Anwesend"
        />
      ),
      cell: ({ row }) => {
        const confirmed = !!row.getValue('checkinConfirmed')
        const id: string = row.getValue('id')

        return (
          <Checkbox
            checked={confirmed}
            disabled={confirmed} // once checked-in, prevent accidental un-check
            onCheckedChange={(checked) => {
              if (checked) {
                checkinParticipant({ variables: { id } })
              }
            }}
            aria-label={`Anwesenheit bestätigen für ${row.getValue('name')} ${row.getValue('familyName')}`}
          />
        )
      },
      enableSorting: true,
    },
    // ── Name ───────────────────────────────────────────────────────────────
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vorname" label="Vorname" />
      ),
      cell: ({ row }) => <span>{row.getValue('name')}</span>,
      enableSorting: true,
    },
    {
      accessorKey: 'familyName',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Nachname"
          label="Nachname"
        />
      ),
      cell: ({ row }) => <span>{row.getValue('familyName')}</span>,
      enableSorting: true,
    },
    // ── Birthdate ──────────────────────────────────────────────────────────
    {
      accessorKey: 'birthdate',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Geburtsdatum"
          label="Geburtsdatum"
        />
      ),
      cell: ({ row }) => (
        <span>
          {new Date(row.getValue('birthdate')).toLocaleDateString('de-AT')}
        </span>
      ),
    },
    // ── Status badge ───────────────────────────────────────────────────────
    {
      accessorKey: 'id',
      header: () => null,
      cell: ({ row }) =>
        row.getValue('checkinConfirmed') ? (
          <Badge variant="success">Eingecheckt</Badge>
        ) : (
          <Badge variant="destructive">Ausstehend</Badge>
        ),
      enableSorting: false,
      enableHiding: false,
      size: 120,
    },
  ]

  const table = useReactTable({
    data: participantsByAccommodation,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter: globalSearch,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalSearch,
    globalFilterFn: (row, _columnId, filterValue: string) => {
      const search = filterValue.toLowerCase()
      const first = String(row.getValue<string>('name') ?? '').toLowerCase()
      const last = String(
        row.getValue<string>('familyName') ?? ''
      ).toLowerCase()
      return first.includes(search) || last.includes(search)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-4 w-full">
      <DataTableToolbar table={table}>
        <Input
          placeholder="Nach Vor- oder Nachname suchen..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="h-8 w-96"
        />
      </DataTableToolbar>

      <DataTable table={table} />
    </div>
  )
}
