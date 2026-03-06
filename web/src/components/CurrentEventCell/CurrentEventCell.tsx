import type {
  FindCurrentEventQuery,
  FindCurrentEventQueryVariables,
} from 'types/graphql'

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Alert from '@/components/Alert/Alert'
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

export const Loading = () => <Skeleton className={'w-full max-w-2xl h-96'} />

export const Empty = () => (
  <Card className="w-full md:w-96">
    <CardTitle>Kein aktuelles Event</CardTitle>
  </Card>
)

export const Failure = ({
  error,
}: CellFailureProps<FindCurrentEventQueryVariables>) => (
  <Card>
    <Alert id={error.name} type="error" message={error.message} />
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
