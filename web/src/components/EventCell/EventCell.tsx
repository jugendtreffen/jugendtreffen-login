import type { FindEventQuery, FindEventQueryVariables } from "types/graphql";

import { CellFailureProps, CellSuccessProps, TypedDocumentNode, useQuery } from "@redwoodjs/web";

import LoadingSpinner from "src/components/Loading/LoadingSpinner";

export const QUERY: TypedDocumentNode<FindEventQuery, FindEventQueryVariables> =
  gql`
    query FindEventQuery($id: Int!) {
      event: event(id: $id) {
        id
        name
        desc
        startDate
        endDate
      }
    }
  `

export const Loading = () => <LoadingSpinner />

export const Empty = () => <div>Event</div>

export const Failure = ({
  error,
}: CellFailureProps<FindEventQueryVariables>) => (
  <div className={'error'}>Error: {error?.message}</div>
)

export const Success = ({
  event,
}: CellSuccessProps<FindEventQuery, FindEventQueryVariables>) => {
  const startDate = new Date(event.startDate)
  const endDate = new Date(event.endDate)
  return (
    <div className={'flex flex-col justify-end gap-2 items-center'}>
      <h1 className={'md:text-3xl'}>{event.name}</h1>
      <h3 className={'text-gray-500'}>
        Von{' '}
        <span className={'text-blue-500'}>
          {startDate.getDate()}.{startDate.getMonth() + 1}.
          {startDate.getFullYear()}
        </span>{' '}
        bis{' '}
        <span className={'text-blue-500'}>
          {endDate.getDate()}.{endDate.getMonth() + 1}.{endDate.getFullYear()}
        </span>
      </h3>
    </div>
  )
}

export const getEventStartDate = () => {
  const { data, error } = useQuery(QUERY)
  return error ? undefined : new Date(data.event?.startDate)
}

export const getEventEndDate = () => {
  const { data, error } = useQuery(QUERY)
  return error ? undefined : new Date(data.event?.endDate)
}

export const getEventName = () => {
  const { data, error } = useQuery(QUERY)
  return error ? undefined : new Date(data.event?.name)
}
