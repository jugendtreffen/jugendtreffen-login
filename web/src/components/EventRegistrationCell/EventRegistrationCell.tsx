import type {
  FindCurrentEventQuery,
  FindCurrentEventQueryVariables,
} from 'types/graphql'

import EventRegistrationForm from '@/components/EventRegistrationForm/EventRegistrationForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<
  FindCurrentEventQuery,
  FindCurrentEventQueryVariables
> = gql`
  query FindEventRegistrationQuery() {
    currentEvent: currentEvent() {
      id
      name
      desc
      startDate
      endDate
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindCurrentEventQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  currentEvent: currentEvent,
}: CellSuccessProps<
  FindCurrentEventQueryVariables,
  FindCurrentEventQueryVariables
>) => {
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
