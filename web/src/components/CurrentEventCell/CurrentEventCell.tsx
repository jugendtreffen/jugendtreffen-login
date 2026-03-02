import type {
  FindCurrentEventQuery,
  FindCurrentEventQueryVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardTitle } from 'src/components/ui/card'
import { Skeleton } from 'src/components/ui/skeleton'

export const QUERY: TypedDocumentNode<
  FindCurrentEventQuery,
  FindCurrentEventQueryVariables
> = gql`
  query FindCurrentEventQuery {
    currentEvent {
      id
      name
      desc
      startDate
      endDate
    }
  }
`

type Variant = 'card' | 'date'

type SuccessProps = CellSuccessProps<
  FindCurrentEventQuery,
  FindCurrentEventQueryVariables
> & {
  variant: Variant
}

export const Loading = () => <Skeleton className={'w-full md:w-96 h-64'} />

export const Empty = () => (
  <Card className="w-full md:w-96">
    <CardTitle>Kein aktuelles Event</CardTitle>
  </Card>
)

export const Failure = ({
  error,
}: CellFailureProps<FindCurrentEventQueryVariables>) => (
  <Card className="w-full md:w-96 text-red-500">
    <CardTitle>Hat nicht geklappt</CardTitle>
    <CardContent>{error?.message}</CardContent>
  </Card>
)

export const Success = ({ currentEvent, variant = 'card' }: SuccessProps) => {
  if (variant === 'date') {
    return (
      <h1>
        {new Date(currentEvent.startDate).toLocaleDateString() +
          ' - ' +
          new Date(currentEvent.endDate).toLocaleDateString()}
      </h1>
    )
  }
  return (
    <Card className={'w-full md:w-96 mb-4'}>
      <CardTitle>{currentEvent.name}</CardTitle>
      <CardContent>
        {currentEvent.desc}
        <button onClick={() => navigate(routes.eventRegistration())}>
          Anmeldung
          <ArrowRight />
        </button>
      </CardContent>
    </Card>
  )
}
