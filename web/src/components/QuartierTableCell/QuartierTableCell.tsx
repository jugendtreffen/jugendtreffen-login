import type {
  ParticipantsByAccommodationQueryVariables,
} from 'types/graphql'

import {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
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
import {DataTableColumnHeader} from "@/components/ui/data-table/data-table-column-header";
import {DataTableToolbar} from "@/components/ui/data-table/data-table-toolbar";
import {Input} from "@/components/ui/input";
import {DataTable} from "@/components/ui/data-table/data-table";
import { ColorSwatch } from '@/components/ui/color-swatch'
import { getColor } from '@/lib/utils'

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
      bandColour
      phoneNumber
      phoneCaretakerContact
      startDate
      endDate
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

export const beforeQuery = ({gender, location}: {gender: string, location: string}) => {
  const { currentUser } = useAuth()
  const role = currentUser.roles.at(0)
  console.log('beforeQuery: ', { gender, location })
  return {
    variables: {
      input: {
        gender: gender ?? '',
        accommodation: location ?? '',
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

  const columns: ColumnDef<ParticipantQueryResult, any>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Vorname"
          label="Vorname"
        />
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
    {
      accessorKey: 'bandColour',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Bandfarbe"
          label="Bandfarbe"
        />
      ),
      cell: ({ row }) => (
        <ColorSwatch color={getColor(row.getValue('bandColour') ?? '')} />
      ),
    },
    {
      accessorKey: 'phoneNumber',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Telefonnummer"
          label="Telefinnummer"
        />
      ),
      cell: ({ row }) => <span>{row.getValue('phoneNumber')}</span>,
    },
    {
      accessorKey: 'phoneCaretakerContact',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Tel.Nr. Elternteil"
          label="Tel.Nr. Elternteil"
        />
      ),
      cell: ({ row }) => <span>{row.getValue('phoneNumber')}</span>,
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
