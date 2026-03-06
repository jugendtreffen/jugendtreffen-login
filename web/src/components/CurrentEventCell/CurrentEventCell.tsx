import type {
  FindCurrentEventQuery,
  FindCurrentEventQueryVariables,
} from 'types/graphql'

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import EventRegistrationForm from '@/components/EventRegistrationForm/EventRegistrationForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card'
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
>

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

export const Success = ({ currentEvent }: SuccessProps) => {
  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Anmeldung {currentEvent.name}</CardTitle>
        <CardDescription>{currentEvent.desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <EventRegistrationForm event={currentEvent} />
      </CardContent>
    </Card>
  )
}
