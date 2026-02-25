import type { FindCurrentEventQuery, FindCurrentEventQueryVariables } from "types/graphql";

import { routes } from "@redwoodjs/router";
import type { CellFailureProps, CellSuccessProps, TypedDocumentNode } from "@redwoodjs/web";

import Card from "src/components/Card/Card";
import Skeleton from "src/components/Skeleton/Skeleton";

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

export const Loading = () => (
  <Skeleton type="card" className={'w-full md:w-96 h-64'} />
)

export const Empty = () => (
  <Card
    className="w-full md:w-96"
    title={'Kein aktuelles Event'}
    description={''}
  ></Card>
)

export const Failure = ({
  error,
}: CellFailureProps<FindCurrentEventQueryVariables>) => (
  <Card
    className={'w-full md:w-96 text-red-500'}
    title={'Hat nicht geklappt.'}
    description={error?.message}
  ></Card>
)

export const Success = ({
  currentEvent,
  variant = 'card',
  children,
}: SuccessProps) => {
  if (variant === 'date') {
    return <>
      {children && children(currentEvent)}
      <h1>{new Date(currentEvent.startDate).toLocaleDateString() + ' - ' + new Date(currentEvent.endDate).toLocaleDateString()}</h1>
    </>
  }
  return (
    <>
    {children && children(currentEvent)}
    <Card
      title={currentEvent.name}
      description={currentEvent.desc}
      className={'w-full md:w-96 mb-4'}
      button={{
        message: 'Anmeldung',
        to: routes.events({ id: String(currentEvent.id) }),
      }}
    />
    </>
  )
}
