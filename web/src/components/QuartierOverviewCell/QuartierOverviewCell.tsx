import React from 'react'

import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import type {
  QuartierOverviewQuery,
  QuartierOverviewQueryVariables,
} from 'types/graphql'

import {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
  useMutation,
} from '@redwoodjs/web'

import { ColorSwatch } from '@/components/ui/color-swatch'
import { DataTable } from '@/components/ui/data-table/data-table'
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import Alert from '@/components/ui/Alert/Alert'
import { useAlert } from '@/hooks/AlertHook'
import { QUARTIER_STATUS_LABELS } from '@/lib/quartier'
import { getColor } from '@/lib/utils'

export const QUERY: TypedDocumentNode<
  QuartierOverviewQuery,
  QuartierOverviewQueryVariables
> = gql`
  query QuartierOverviewQuery($input: AccommodationInput!, $date: Date!) {
    participantsByAccommodation(input: $input) {
      id
      name
      familyName
      bandColour
      participationRole
    }
    quartierStatusByDate(date: $date, input: $input) {
      participantId
      status
      carriedOver
    }
  }
`

const SET_STATUS = gql`
  mutation SetQuartierStatus(
    $participantId: String!
    $date: Date!
    $status: String!
  ) {
    setQuartierStatus(participantId: $participantId, date: $date, status: $status) {
      participantId
      status
      carriedOver
    }
  }
`

export const beforeQuery = ({
  gender,
  location,
  date,
}: {
  gender: string
  location: string
  date: string
}) => ({
  variables: {
    input: { gender, accommodation: location ?? 'jugendtreffen' },
    date,
  },
  fetchPolicy: 'network-only' as const,
})

export const Loading = () => (
  <>
    <Skeleton className="h-8 w-full rounded-xl" />
    <Skeleton className="h-150 w-full rounded-xl" />
  </>
)

export const Empty = () => (
  <Alert
    id="quartier-overview-empty-alert"
    message="Keine Teilnehmer für dieses Quartier gefunden."
    type="info"
    dismissible={false}
  />
)

export const Failure = ({ error }: CellFailureProps) => (
  <Alert
    id="quartier-overview-error-alert"
    message={`Fehler beim Laden: ${error.message}`}
    type="error"
    dismissible={false}
  />
)

type Row = {
  id: string
  name: string
  familyName: string
  bandColour?: string | null
  participationRole?: string | null
  status: string
  carriedOver: boolean
}

export const Success = ({
  participantsByAccommodation,
  quartierStatusByDate,
  date,
  editable,
}: CellSuccessProps<QuartierOverviewQuery, QuartierOverviewQueryVariables> & {
  date: string
  editable: boolean
}) => {
  const { addAlert } = useAlert()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalSearch, setGlobalSearch] = React.useState('')

  const [setStatus] = useMutation(SET_STATUS, {
    refetchQueries: ['QuartierOverviewQuery'],
    onError: (error) =>
      addAlert(`Status konnte nicht gespeichert werden: ${error.message}`, 'error'),
  })

  const rows: Row[] = React.useMemo(() => {
    const byId = new Map(quartierStatusByDate.map((s) => [s.participantId, s]))
    return participantsByAccommodation.map((p) => ({
      ...p,
      status: byId.get(p.id)?.status ?? '',
      carriedOver: byId.get(p.id)?.carriedOver ?? false,
    }))
  }, [participantsByAccommodation, quartierStatusByDate])

  const columns: ColumnDef<Row, any>[] = [
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" label="Status" />
      ),
      cell: ({ row }) => (
        <Select
          value={row.original.status || undefined}
          disabled={!editable}
          onValueChange={(status) =>
            setStatus({
              variables: { participantId: row.original.id, date, status },
            })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Kein Status" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(QUARTIER_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
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
        <DataTableColumnHeader column={column} title="Nachname" label="Nachname" />
      ),
      cell: ({ row }) => <span>{row.getValue('familyName')}</span>,
      enableSorting: true,
    },
    {
      accessorKey: 'bandColour',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bandfarbe" label="Bandfarbe" />
      ),
      cell: ({ row }) => (
        <ColorSwatch color={getColor(row.getValue('bandColour') ?? '')} />
      ),
    },
    {
      id: 'carriedOver',
      header: () => <span>Hinweis</span>,
      cell: ({ row }) =>
        row.original.carriedOver ? (
          <span className="text-xs text-muted-foreground">
            vom Vortag übernommen
          </span>
        ) : null,
    },
  ]

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, globalFilter: globalSearch },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalSearch,
    globalFilterFn: (row, _columnId, filterValue: string) => {
      const search = filterValue.toLowerCase()
      return (
        String(row.getValue('name') ?? '').toLowerCase().includes(search) ||
        String(row.getValue('familyName') ?? '').toLowerCase().includes(search)
      )
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="w-full space-y-4">
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
